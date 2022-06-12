import dotenv from 'dotenv'
import ApiError from '../error/ApiError.js'
import bcrypt from 'bcryptjs'
import { BirAutotrade, BirBalanceHistory, BirCurrency, BirCurrencyExchange, BirLanguage, BirMarket, BirMarketCourse, BirPayment, BirRefill, BirSettings, BirTrade, BirTradeagent, BirUser, BirUserBalance } from '../models/models.js'
import jwt from 'jsonwebtoken'
import md5 from 'md5'
import moment from 'moment'
import { Op } from 'sequelize'
import { calculation, getCourceCurrencyFunction, getLang, sendEmail, writeHistory } from '../helpers/tradeFunction.js'
import request from 'request'
import rp from 'request-promise'

dotenv.config()

class tradeController {

    async getDataLandingPage(req,res,next) {

        let option_1 = {
            url: "https://crossceed.com/rates.txt",
            rejectUnauthorized: false,
        }
        let rate_api = await rp(option_1)
        let rate_json = JSON.parse(rate_api)

        let option_2 = {
            url: "https://crossceed.com/charts.txt",
            rejectUnauthorized: false,
        }
        let charts_api = await rp(option_2)
        let charts_json = JSON.parse(charts_api)

        return res.json({
            rate: rate_json,
            charts: charts_json,
        })

    }

    async stopAutoTrade(req,res,next) {
        let currency_id = req.body.currency_id
        let user_id = req.user.id
        let autotrade = await BirAutotrade.findOne({
            where: {
                user_id: user_id,
                currency_id: currency_id,
                status_id: 0,
            }
        })
        if (!autotrade) {
            return next(ApiError.badRequest('Нет запущенных процессов'))
        }

        autotrade.status_id = 1
        await autotrade.save()

        let auto_id = autotrade.id

        let value_autotrade = autotrade.value

        let user_balance = await BirUserBalance.findOne({
            where: {
                user_id: user_id,
                currency_id: currency_id
            }
        })

        if (!user_balance) {
            return next(ApiError.badRequest('Ошибка баланса'))
        }

        let trade = await BirTrade.findAll({
            where: {
                auto_id: auto_id
            }
        })

        if (trade.length > 0) {
            let new_val = user_balance.value + value_autotrade
            user_balance.value = new_val
            await user_balance.save()
            await BirTrade.destroy({
                where: {
                    auto_id: auto_id
                }
            })
            writeHistory(user_id,value_autotrade,currency_id,22)
        }

        return res.json({
            result: 1,
            data: 'Остановлено'
        })
        
    }
    
    async startAutoTrade(req,res,next) {
        
        let currency_id = req.body.currency_id
        let user_id = req.user.id
        let value = req.body.defvalue_amount
        let qty = req.body.defvalue_qty
        let language_id = req.body.language_id

        let language = await BirLanguage.findOne({
            where: {id: language_id}
        })
        let array_lang = getLang(language.file)

        if (qty <= 0) {
            return next(ApiError.badRequest(array_lang['autotrade_problem_qwt']))
        } else {
            if (value <= 0) {
                return next(ApiError.badRequest(array_lang['autotrade_problem_summ']))
            } else {

                let user_balance = await BirUserBalance.findOne({
                    where: {
                        user_id: user_id,
                        currency_id: currency_id
                    }
                })

                if (!user_balance || user_balance.value < value) {
                    return next(ApiError.badRequest(array_lang['autotrade_problem_balance']))
                } else {

                    let autotrade = await BirAutotrade.findOne({
                        where: {
                            user_id: user_id,
                            currency_id: currency_id,
                            status_id: 0,
                        }
                    })


                    if (autotrade) {

                        return next(ApiError.badRequest(array_lang['autotrade_already']))

                    } else {

                        let autotrade_new = await BirAutotrade.create({
                            user_id: user_id,
                            currency_id: currency_id,
                            status_id: 0,
                            value: value,
                            qty: qty,
                            created_on: moment().format('YYYY-MM-DD')
                        })

                        let auto_id = autotrade_new.id

                        let user = await BirUser.findOne({
                            where: {id: user_id}
                        })

                        let currency = await BirCurrency.findOne({
                            where: {id: currency_id}
                        })


                        let autotrade_start = array_lang['autotrade_start']
                        let sum = array_lang['sum']
                        let qtyorder = array_lang['qtyorder']
                        let detailed_history = array_lang['autotrade_email_footer']


                        let email = user.email
                        let subject = array_lang['dear'] + " " + user.first_name ?? '' + ' ' + user.last_name ?? ''
                        let body = '<p style="margin:0;">' + autotrade_start + '<br/>'
                        body += sum + ': ' + value + ' ' + currency.symbol + '<br/>'
                        body += qtyorder + ': ' + qty + "</p>"
                        body += '<br/><br/>'
                        body += '<p style="color: gray; font-size:14px; margin:0;">' + detailed_history + '</p>'
                        sendEmail(email, subject, body)

                        return res.json({
                            result: 1,
                            data: array_lang['autotrade_start']
                        })

                    }
                }
            }
        }
    }

    async createTrade(req,res,next) {

        let buy_market_id = req.body.buy_market_id
        let ask_market_id = req.body.ask_market_id
        let amount = req.body.amount
        let agent_buy_id = req.body.agent_buy_id
        let agent_sell_id = req.body.agent_sell_id
        let currency_id = req.body.currency_id
        let language_id = req.body.language_id
        let user_id = req.user.id

        let language = await BirLanguage.findOne({
            where: {id: language_id}
        })
        let array_lang = getLang(language.file)

        let date = moment().format('YYYY-MM-DD')
        let startDt = date + " 00:00:00"
        let endDt = date + " 23:59:59"

        let setting_list = {}
        let data_setting = await BirSettings.findAll()
        data_setting.map( item => {
            let id = item.id
            setting_list[id] = item.opt_value
        })

        // 1. Простые проверки
        amount = Number(amount)

        if (amount < 0) return next(ApiError.badRequest(array_lang['wrong_balance']))

        // 2. Проверка баланса
        let user_balance = await BirUserBalance.findOne({
            where: { user_id: user_id, currency_id: currency_id }
        })
        let balance = 0
        if (user_balance) {
            balance = user_balance.value
        }


        // wrong_balance
        if (balance < amount)  return next(ApiError.badRequest(array_lang['autorobot_not_enougth']))
        
        // 3. Проверрка лимитов
        let user = await BirUser.findOne({where: {id: user_id}})
        const is_vip = user.is_vip
        let trade = await BirTrade.findAll({
            where: {
                user_id: user_id,
                created_on: {
                    [Op.gte]: startDt,
                    [Op.lte]: endDt,
                }
            }
        })

        if (is_vip == 0 && trade.length >= setting_list[9] || is_vip == 1 && trade.length >= setting_list[15]) {
            // trade_limit
            return next(ApiError.badRequest(array_lang['trade_limit_qwt']))
        }


        // Проверка на наличие уже запущенных сделок
        let trade_online = await BirTrade.findAll({
            where: {
                user_id: user_id,
                status_id: 0,
                currency_id: currency_id
            }
        })

        let autotrade_online = await BirAutotrade.findAll({
            where: {
                user_id: user_id,
                status_id: 0,
                currency_id: currency_id
            }
        })

        if (trade_online.length > 0 || autotrade_online > 0) {
            return next(ApiError.badRequest(array_lang['trade_active']))
        }

        let data = await calculation(buy_market_id, ask_market_id, amount, currency_id, user_id, agent_buy_id, agent_sell_id)
        
        // Проверка если сделка не выгодна (в минус)
        if (data.profit_clienta <= 0) {
            return next(ApiError.badRequest(array_lang['trade_wrong_profit']))
        }

        let TRADE = {
            user_id: user_id,
            market_buy: data.buy_market_id,
            market_sell: data.ask_market_id,
            agent_buy: data.agent_buy_id,
            agent_sell: data.agent_sell_id,
            currency_id: currency_id,
            cource_buy: data.market_buy_price,
            cource_sell: data.market_sell_price,
            comission_buy: data.comission_buy,
            comission_sell: data.comission_sell,
            comission_agent_1: data.comission_agent_1,
            comission_agent_2: data.comission_agent_2,
            comission_general: data.general_comission,
            comission_refferal: data.referral_comission_all,
            comission_adyen: data.adyen_comission,
            comission_operator: 0,
            comission: data.comission_platform,
            comission_merch: data.comission_merch_number,
            value: data.value,
            status_id: 0,
            operation_time: data.operation_time,
            is_fail: 0,
            referal_fee: data.referal_fee,
            profit: data.profit_clienta,
            delta: data.delta,
        }

        await BirTrade.create(TRADE)

        // Изменяем баланс
        user_balance.value = balance - amount
        user_balance.save()

        // Записываем в историю
        writeHistory(user_id, (-1 * amount), currency_id, 5)



        // trade_sended
        return res.json({
            result: 1,
            data: TRADE
        })

    }

    getServerTime(req,res,next) {
        let server_time = moment().format('HH:mm:ss')
        res.json(server_time)
    }

    async getCalculation(req,res,next) {

        let buy_market_id = req.body.buy_market_id;
        let ask_market_id = req.body.ask_market_id;
        let amount = req.body.amount;
        let currency_id = req.body.currency_id;

        let user_id = req.user.id
        let data = await calculation(buy_market_id, ask_market_id, amount, currency_id, user_id)
        
        return res.json(data)
    }

    async getBestPair(req,res,nex) {

        let best_pair = {}

        let cource_currency = await getCourceCurrencyFunction()


        for (let currency in cource_currency) {
            let cource = cource_currency[currency]

            best_pair[currency] = {
                best_buy: 0,
                best_buy_val: 0,
                best_sell: 0,
                best_sell_val: 0,
            }
 
            let delta_max = 0

            
            for (let kb in cource) {
                let vb = cource[kb]
                for (let ks in cource) {
                    let vs = cource[ks]
                    
                    if(kb == ks) continue

                    let delta = vb.buy - vs.sell

    
                    if(delta > delta_max) {
                        delta_max = delta;
                        best_pair[currency] = {
                            best_buy: kb,
                            best_buy_val: vb.buy,
                            best_sell: ks,
                            best_sell_val: vs.sell,
                        }
                    }

                }
            }
        }

        return res.json(best_pair)

    }

    async getMarketList(req,res,nex) {
        
        let market_list = {}

        let market = await BirMarket.findAll()
        for (const item of market) {

            let id = item.id
            
            let market_course = await BirMarketCourse.findOne({
                where: {
                    market_id: id
                },
                order: [
                    ['created_on', 'DESC'],
                ],
                limit: 1
            })

            if (market_course == null) continue

            market_list[id] = {
                name: item.name,
                currency_id: item.currency_id,
                buy: market_course.buy_value,
                sell: market_course.sell_value,
                ch24: market_course.ch24,
            }

        }

        return res.json(market_list)
    }
    
    async getGraph(req,res,nex) {
        
        let date = moment().format('YYYY-MM-DD')

        let graph_array = {}

        let market_list = {}

        let market = await BirMarket.findAll()
        for (const item of market) {

            let id = item.id
            
            let market_course = await BirMarketCourse.findOne({
                where: {
                    market_id: id
                },
                order: [
                    ['created_on', 'DESC'],
                ],
                limit: 1
            })

            if (market_course == null) continue

            market_list[id] = {
                name: item.name,
                currency_id: item.currency_id,
                buy: market_course.buy_value,
                sell: market_course.sell_value,
                ch24: market_course.ch24,
            }

        }

        for (let k in market_list) {

            let market_course = await BirMarketCourse.findOne({
                where: {
                    market_id: k
                },
                order: [
                    ['created_on', 'DESC']
                ],
                limit: 1
            })
            
            if (market_course == null) continue

            let item = market_course
            graph_array[k] = graph_array[k] ?? {}
            graph_array[k][item.created_on] = {
                buy: item.buy_value,
                sell: item.sell_value,
                low: item.low,
                high: item.high,
                close: item.close,
                open: item.open,
                volume: item.volume
            }

        }

        return res.json(graph_array)
    }

    async getGraphAskBid(req,res,nex) {
        let currency_id = req.body.currency_id
        let buy_market_id = req.body.buy_market_id
        let ask_market_id = req.body.ask_market_id


        let buy = buy_market_id ?? false
        let sell = ask_market_id ?? false

        // Определяем переменные
        let chart_buy = []
        let chart_sell = []

        let option = {
            url: "https://crossceed.com/charts_trade.txt",
            rejectUnauthorized: false,
        }
        let data_api = await rp(option)
        let json = JSON.parse(data_api)

        if (buy) {
            let datas_buy = json[buy]
            datas_buy.map((item) => {
                chart_buy.push({
                    hour: item.hour,
                    buy_value: item.buy_value,
                })
            })
        }

        if (sell) {
            let datas_sell = json[sell]
            datas_sell.map((item) => {
                chart_sell.push({
                    hour: item.hour,
                    sell_value: item.sell_value,
                })
            })
        }

        return res.json({
            bid: chart_buy,
            ask: chart_sell
        })

    }

    

    async getCourceCurrency(req,res,nex) {
        let cource_currency = await getCourceCurrencyFunction()
        return res.json(cource_currency)
    }

    async getCalculateMerchant(req,res,next) {
        
    }

    async getTrade(req,res,next) {
       
        let trade_result = []
        let trade_result_online = {}

        let now = Date.now()

        let user_id = req.user.id

        let trade = await BirTrade.findAll({
            where: {
                user_id: user_id
            },
            order: [
                ['id', 'DESC'],
            ]
        })

        for (const item of trade) {

            let currency_id = item.currency_id

            let currency = await BirCurrency.findOne({
                where: {
                    id: currency_id
                }
            })

            let hourdiff = (now - Date.parse(item.created_on)) / 1000 / 3600
            let percent = hourdiff / item.operation_time * 100

            let step

            if (percent <= 20) step = 1
            if (percent <= 40 && percent >= 20) step = 2
            if (percent <= 60 && percent >= 40) step = 3
            if (percent <= 80 && percent >= 60) step = 4
            if (percent > 80 && percent <= 100) step = 5
            if (percent > 100) step = 6

            
            let ITOG_1 = item.value * item.cource_buy
            let ITOG_2 = ITOG_1 - (ITOG_1 * (item.comission_buy/100))
            let ITOG_3 = ITOG_2 - (ITOG_2 * (item.comission_adyen/100))
            let ITOG_4 = ITOG_3 - (ITOG_3 * (item.comission_sell/100))
            let ITOG_5 = ITOG_4 / item.cource_sell
            let ITOG_6 = ITOG_5 - item.value 
            let ITOG_7 = ITOG_6 - (ITOG_6 * ((item.comission_merch + item.comission_operator + item.comission + item.comission_agent_1 + item.comission_agent_2)/100))
            let ITOG_8 = ITOG_7 - (ITOG_7 * (item.comission_general/100))
            let REFERAL_FEE = ITOG_8 * (item.comission_refferal/100)
            let PROFIT_CLIENTA = ITOG_8 - REFERAL_FEE
            let TO_PAY = item.value + PROFIT_CLIENTA

            
            let step_1 = ITOG_1;
            let step_2 = ITOG_5;
            let step_2_5 = ITOG_5;
            let step_3 = 0; // TODO не было объявлено
            let profit = PROFIT_CLIENTA;
            let referal_fee = REFERAL_FEE;
            let to_pay = TO_PAY;
            
            let comission_adyen_summ = ITOG_2 * (item.comission_adyen / 100)
            let comission_merch_summ = ITOG_6 * (item.comission_merch / 100)
            let comission_agent_1_summ = ITOG_6 * (item.comission_agent_1 / 100)
            let comission_agent_2_summ = ITOG_6 * (item.comission_agent_2 / 100)
            let comission_summ = ITOG_6 * (item.comission / 100)
            
            
            let summ_comission = item.comission_adyen + item.comission_merch + item.comission_operator + item.comission + item.comission_agent_1 + item.comission_agent_2
            
            let tradeagent

            tradeagent = await BirTradeagent.findOne({
                where: {
                    id: item.agent_buy
                }
            })

            let agent_buy = tradeagent !== null ? tradeagent.name : 'Agent Buy'

            tradeagent = await BirTradeagent.findOne({
                where: {
                    id: item.agent_sell
                }
            })

            let agent_sell = tradeagent !== null ? tradeagent.name : 'Agent Sell'

            let market

            market = await BirMarket.findOne({
                where: {
                    id: item.market_buy
                }
            })

            let market_buy = market !== null ? market.name : 'Market Buy'

            market = await BirMarket.findOne({
                where: {
                    id: item.market_sell
                }
            })

            let market_sell = market !== null ? market.name : 'Market Buy'

            let detail = {
                currency: currency.symbol,
                comission_adyen_summ: comission_adyen_summ.toFixed(8),
                comission_merch_summ: comission_merch_summ.toFixed(8),
                comission_agent_1_summ: comission_agent_1_summ.toFixed(8),
                comission_agent_2_summ: comission_agent_2_summ.toFixed(8),
                comission_summ: comission_summ.toFixed(8),
                comission_refferal_summ: REFERAL_FEE,
                ITOG_6: ITOG_6.toFixed(8),
                step_1: step_1,
                step_2: step_2.toFixed(8),
                step_2_5: step_2_5,
                step_3: step_3,
                profit: profit.toFixed(8),
                fee: 0, // TODO
                referal_fee: referal_fee,
                to_pay: to_pay.toFixed(8),
                value: item.value,
                summ_comission: summ_comission,
                comission_adyen: item.comission_adyen,
                agent_buy: agent_buy,
                agent_sell: agent_sell,
                market_buy: market_buy,
                market_sell: market_sell,
                cource_buy: item.cource_buy,
                comission_buy: item.comission_buy,
                comission_sell: item.comission_sell,
                comission_merch: item.comission_merch,
                cource_sell: item.cource_sell,
                comission_operator:item.comission_operator,
                comission:item.comission,
                comission_refferal: item.comission_refferal,
                comission_agent_1: item.comission_agent_1,
                comission_agent_2: item.comission_agent_2,
            }


            let key = String(item.id).padStart(6,'0')

            trade_result.push({
                key: key,
                currency: currency,
                detail: detail,
                status_id: item.status_id,
                to_pay: to_pay,
                created_on: item.created_on,
                balance_info: item.balance_info,
                auto_id: item.auto_id,
                step: step,
            })
            
            
            if (item.status_id == 0) {
                key = String(item.id).padStart(6,'0')
                trade_result_online[key] = {
                    detail: detail,
                    status_id: item.status_id,
                    currency: item.currency,
                    to_pay: to_pay,
                    created_on: item.created_on,
                    balance_info: item.balance_info,
                    auto_id: item.auto_id,
                    step: step,
                }
            }

        }

        return res.json({
            trade_result: trade_result,
            trade_result_online: trade_result_online
        })

    }


    async getDataExchange(req,res,next) {

        // Обменный курс спаршенный
        let cource_exchange = {} 
        let data = await BirCurrencyExchange.findAll()
        data.map((item) => {
            let currency_1 = item.currency_1
            let currency_2 = item.currency_2
            if (!cource_exchange[currency_1]) cource_exchange[currency_1] = {}
            cource_exchange[currency_1][currency_2] = item.cource
        })

        // Проверяем баланс на PayKassa
        

    }


    async getCurrencyExchange(req,res,next) {

        let cource_exchange = {}

        let data = await BirCurrencyExchange.findAll({
            where: {
                'currency_2': 2
            }
        })

        data.map( item => {
            let currency_1 = item.currency_1
            let cource = item.cource
            cource_exchange[currency_1] = cource
        })

        return res.json(cource_exchange)

    }

    async getCurrency(req,res,next) {

        const today = moment().format('YYYY-MM-DD')

        let setting_list = {}
        let data_setting = await BirSettings.findAll()
        data_setting.map( item => {
            let id = item.id
            setting_list[id] = item.opt_value
        })

        let currency_list = []

        let data = await BirCurrency.findAll()

        data.map( item => {

            let trade_volume = item.trade_volume
            let id = item.id

            if (item.id == 2) return
            if (item.trade_volume_update != today) {
                trade_volume += (setting_list[17] * trade_volume)/100;

                BirCurrency.update(
                    { 
                        trade_volume: trade_volume,
                        trade_volume_update: today
                    }, {
                        where: {
                            id: id
                        }
                    }
                );
            }

            currency_list.push({
                currency_id: item.id,
                name: item.name,
                symbol: item.symbol,
                min_payout: item.min_payout,
                commission: item.commission,
                trade_volume: trade_volume,
                min_summ_trade: item.min_summ_trade,
                commission_payout: item.commission_payout
            })

        })

        return res.json(currency_list)

    }

    async getTradeagentList(req,res,next) {

        let tradeagent_list = []
        
        let data = await BirTradeagent.findAll({
            where: {
                is_deleted: 0
            }
        })

        data.map((item) => {
            tradeagent_list.push({
                name: item.name,
                status_id: item.status_id,
            })
        })

        return res.json(tradeagent_list)

    }

    async getAutoList(req,res,next) {

        let user_id = req.user.id

        let autotrade = await BirAutotrade.findAll({
            where: {
                user_id: user_id,
                status_id: 0
            }
        })

        if (autotrade === null) return res.json({})

        let auto_list = {}

        autotrade.map((item) => {
            let currency_id = item.currency_id
            let qty = item.qty
            let value = item.value
            let status_id = item.status_id

            auto_list[currency_id] = {
                qty: qty,
                value: value,
                status_id: status_id,
            }
            
        })

        return res.json(auto_list)

    }

}

export default new tradeController()