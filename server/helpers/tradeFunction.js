import Sequelize from 'sequelize'
import { BirCurrency, BirMarketCourse, BirMarket, BirBalanceHistory, BirTradeagent, BirTradeagentMarket, BirUser, BirSettingsReferals, BirSettings, BirUserBalance } from "../models/models.js"
import { createTransport } from 'nodemailer'
import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()

export const getCourceCurrencyFunction = async () => {
    let cource_currency = {}
    let market = await BirMarket.findAll()
    
    for (const item of market) {

        let id = item.id
        let currency_id = item.currency_id

        let market_course = await BirMarketCourse.findOne({
            where: { market_id: id },
            order: [ ['created_on', 'DESC'], ],
            limit: 1
        })

        if (market_course == null) continue
        if(market_course.buy_value ==0 || market_course.sell_value == 0) continue
        cource_currency[currency_id] = cource_currency[currency_id] ?? {}

        cource_currency[currency_id][id] = {
            buy: market_course.buy_value,
            sell: market_course.sell_value,
        }
    }

    return cource_currency
}


export const writeHistory = async (user_id,value,currency_id,operation_id) => {

    let user_balance = await BirUserBalance.findOne({
        where: { user_id: user_id, currency_id: currency_id }
    })
    let balance = 0
    if (user_balance) {
        balance = user_balance.value
    }

    let bh = await BirBalanceHistory.create({
        user_id: user_id,
        value: value,
        currency_id: currency_id,
        operation_id: operation_id,
        balance_info: balance,
    })

    return bh.dataValues.id
    
}

export const calculation = async (buy_market_id, ask_market_id, amount, currency_id, user_id, agent_buy_id = 0, agent_sell_id = 0) => {

    let currency = await BirCurrency.findOne({
        where: {id: currency_id}
    })

    let market_buy_course = await BirMarketCourse.findOne({
        where: {market_id: buy_market_id}
    })

    let market_sell_course = await BirMarketCourse.findOne({
        where: {market_id: ask_market_id}
    })

    let market_buy = await BirMarket.findOne({
        where: {id: buy_market_id}
    })

    let market_sell = await BirMarket.findOne({
        where: {id: ask_market_id}
    })

    let setting_list = {}
    let settings = await BirSettings.findAll()
    settings.map((item) => {
        setting_list[item.id] = item.opt_value
    })



    /**
     * ИСПОЛЬЗУЕМ СТАРЫЙ КОД СО СТРАНИЦЫ 
     * trade_component_course.php
     * ajax_getagent.php
     */
    let value = parseFloat(amount) || 0
    let currency_symbol = currency.symbol
    let comission_currency = currency.commission
    let market_buy_id = buy_market_id
    let market_sell_id = ask_market_id
    let market_buy_price = market_buy_course?.buy_value ?? 0
    let market_sell_price = market_sell_course?.sell_value ?? 0
    let market_buy_name = market_buy?.name ?? ''
    let market_sell_name = market_sell?.name ?? ''

    let agent = {}

    let where = {}

    where = agent_buy_id === 0 ? { status_id: 0, is_deleted: 0 } : { id: agent_buy_id }
    let agent_buy = await BirTradeagent.findOne({
        where: where,
        limit: 1,
        order: Sequelize.literal('rand()'), 
        include: [{
            model: BirTradeagentMarket,
            where: {
                market_id:market_buy_id
            }
        }]
    })
    
    agent['buy'] = {
        id: agent_buy?.id,
        name: agent_buy?.name,
        commission: agent_buy?.trade_comission
    }

    where = agent_sell_id === 0 ? { status_id: 0, is_deleted: 0 } : { id: agent_sell_id }
    let agent_sell = await BirTradeagent.findOne({
        where: where,
        limit: 1,
        order: Sequelize.literal('rand()'), 
        include: [{
            model: BirTradeagentMarket,
            where: {
                market_id:market_sell_id
            }
        }]
    })

    agent['sell'] = {
        id: agent_sell?.id,
        name: agent_sell?.name,
        commission: agent_sell?.trade_comission
    }

    let user = await BirUser.findOne({
        where: {id: user_id}
    })


    let referral_comission_all = 0;
    if(user.referral_id > 0) {

        let referrals_settings = {}
        let settings_ref = BirSettingsReferals.findAll()
        if (settings_ref.length > 0) {
            for (item of settings_ref) {
                referrals_settings[item.key_value] = item.value
            }
        }

        /** TODO */

        /** ajax_getagent.php */

    }

    let general_comission = referral_comission_all == 0 ? Number(setting_list[7]) : 0
    let operation = {
        operation_time: 0,
        comission_general: general_comission
    }

    operation['comission_sell'] = Number(currency.commission)
    operation['comission_buy'] = Number(currency.commission)
    operation['cource_buy'] = Number(market_buy_course.buy_value)
    operation['cource_sell'] = Number(market_sell_course.sell_value)

    operation['comission_agent_1'] = agent['buy']['commission'];
    operation['comission_agent_2'] = agent['sell']['commission'];

    operation['operation_time'] = operation['operation_time'] + Number(setting_list[6]) / 60;
    
    let is_fail = 0;

    let ITOG_1 = value * operation['cource_buy'];
    let ITOG_2 = ITOG_1 - (ITOG_1 * (operation['comission_buy']/100)); /* Комиссия покупки */
    let ITOG_3 = ITOG_2 - (ITOG_2 * (Number(setting_list[28])/100)); /* Комиссия Transit Adyen*/
    let ITOG_4 = ITOG_3 - (ITOG_3 * (operation['comission_sell']/100)); /* Комиссия продажи */
    let ITOG_5 = ITOG_4 / operation['cource_sell'];
    let ITOG_6 = ITOG_5 - value; /* Общая дельта */
    let ITOG_7 = ITOG_6 - (ITOG_6 * ((Number(setting_list[16]) + Number(setting_list[2]) + Number(operation['comission_agent_1']) + Number(operation['comission_agent_2']))/100));
    let ITOG_8 = ITOG_7 - (ITOG_7 * (operation['comission_general']/100));
    let REFERAL_FEE = ITOG_8 * (referral_comission_all / 100);
    let PROFIT_CLIENTA = ITOG_8 - REFERAL_FEE;
    let TO_PAY = value + PROFIT_CLIENTA;

    let comission_adyen_summ = ITOG_2 * (Number(setting_list[28]) / 100)
    let comission_merch_summ = ITOG_6 * (Number(setting_list[16]) / 100)

    let comission_agent_1 = ITOG_6 * Number(agent.buy.commission)/100
    let comission_agent_2 = ITOG_6 * Number(agent.sell.commission)/100
    let total_com_AGENTbid = ITOG_6 - (ITOG_6 * (Number(agent.buy.commission)/100))
    let total_com_AGENTask = ITOG_6 - (ITOG_6 * (Number(agent.sell.commission)/100))
    let total_com_platform = ITOG_6 * (Number(setting_list[2]) / 100)

    let o_total_com_agent_1 = agent.buy.commission + "%"
    let o_total_com_agent_2 = agent.sell.commission + "%"

    let o_value_usd_sell = ITOG_5.toFixed(8)  + " " +  currency_symbol
    let o_total_com_merchant = setting_list[16] + "%" + "(" + comission_merch_summ.toFixed(8)  + " " +  currency_symbol + ")"
    let o_total_com_company = setting_list[2] + "%" + "(" + total_com_platform.toFixed(8)  + " " +  currency_symbol + ")"
    let o_total_com_adyen = setting_list[28] + "%" + "(" + comission_adyen_summ.toFixed(2)  + " " +  "USD)"
    let total_delta_client = PROFIT_CLIENTA.toFixed(8) + " " + currency_symbol
    let total_all = TO_PAY.toFixed(8)  + " " +  currency_symbol

    let o_agent_buy = agent.buy.name
    let o_agent_sell = agent.sell.name

    let delta = PROFIT_CLIENTA.toFixed(8) + " " + currency_symbol

    return {
        operation_time: operation['operation_time'],
        buy_market_id: buy_market_id,
        ask_market_id: ask_market_id,
        market_buy_price: market_buy_price,
        market_sell_price: market_sell_price,
        value: value,
        o_value: value + " " + currency_symbol,
        o_price_buy: market_buy_price + " " + "USD",
        o_price_sell: market_sell_price + " " + "USD",
        o_market_buy: market_buy_name,
        o_market_sell: market_sell_name,
        delta: delta,
        profit_clienta: PROFIT_CLIENTA,
        adyen_comission: setting_list[28],
        comission_adyen_summ: comission_adyen_summ,
        comission_platform: setting_list[2],
        general_comission: general_comission,
        referral_comission_all: referral_comission_all,
        comission_merch_number: setting_list[16],
        comission_merch: setting_list[16] + "%",
        to_pay: TO_PAY,
        comission_merch_summ: comission_merch_summ + " " + currency_symbol,
        result: 1,
        comission_agent_1: agent['buy']['commission'],
        comission_agent_2: agent['sell']['commission'],
        total_com_AGENTbid: total_com_AGENTbid,
        total_com_AGENTask: total_com_AGENTask,
        o_total_com_agent_1: o_total_com_agent_1,
        o_total_com_agent_2: o_total_com_agent_2,
        o_value_usd_sell: o_value_usd_sell,
        o_total_com_merchant: o_total_com_merchant,
        o_total_com_company: o_total_com_company,
        o_total_com_adyen: o_total_com_adyen,
        o_agent_sell: o_agent_sell,
        o_agent_buy: o_agent_buy,
        total_delta_client: total_delta_client,
        total_all: total_all,
        agent_buy_id: agent.buy.id,
        agent_sell_id: agent.sell.id,
        referal_fee: REFERAL_FEE,
        trade_data: {
            buy_market_id: buy_market_id, 
            ask_market_id: ask_market_id, 
            amount: amount, 
            currency_id: currency_id,
            agent_buy_id: agent.buy.id,
            agent_sell_id: agent.sell.id,
        }
    }
    
}

export const getLang = (lang) => {
    let array_lang = {}
    let fileContent = fs.readFileSync("lang/" + lang + ".txt", "utf8");
    fileContent = fileContent.split(/\r\n|\r|\n/g)
    fileContent.map((item) => {
        let t = item.split('|')
        if (!t[0]) return
        array_lang[t[0].trim()] = t[2].trim()
    })

    return array_lang
}

export const sendEmail = async (email, subject, body, language_id = 1) => {

    let transporter = createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {rejectUnauthorized: false},
    })

    let result
    
    try {
        result = await transporter.sendMail({
            from: '"' + process.env.EMAIL_FROM_NAME + '" <' + process.env.EMAIL_USERNAME + '>',
            to: email,
            subject: subject,
            html: body,
        })
    } catch (e) {
        console.log(e)
    }
    
    console.log(result)

}