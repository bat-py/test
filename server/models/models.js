import sequelize from '../db.js'
import DataTypes, { DATE } from 'sequelize'


export const BirTicket = sequelize.define(
    'bir_ticket',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        user_id: {type: DataTypes.INTEGER},
        created_on: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
        subject: {type: DataTypes.STRING},
        text: {type: DataTypes.TEXT},
        status_id: {type: DataTypes.TINYINT},
        type: {type: DataTypes.INTEGER},
        readed_admin: {type: DataTypes.INTEGER(1)},
    }, {
        freezeTableName: true
    }
)

export const BirTicketComment = sequelize.define(
    'bir_ticket_comment',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        ticket_id: {type: DataTypes.INTEGER, defaultValue: 0},
        user_id: {type: DataTypes.INTEGER, defaultValue: 0},
        support_id: {type: DataTypes.INTEGER, defaultValue: 0},
        created_on: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
        comment: {type: DataTypes.TEXT},
        readed: {type: DataTypes.INTEGER(1)},
        readed_admin: {type: DataTypes.INTEGER(1)},
    }, {
        freezeTableName: true
    }
)

export const BirRefill = sequelize.define(
    'bir_refill',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        user_id: {type: DataTypes.INTEGER},
        created_on: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
        currency_id: {type: DataTypes.INTEGER},
        value: {type: DataTypes.FLOAT},
        status_id: {type: DataTypes.INTEGER},
        status_payment: {type: DataTypes.INTEGER, defaultValue: null},
        billing_id: {type: DataTypes.STRING, defaultValue: null},
        billing_wallet: {type: DataTypes.STRING, defaultValue: null},
        billing_tag: {type: DataTypes.STRING, defaultValue: null},
        balance_history_id: {type: DataTypes.INTEGER, defaultValue: null},
        confirmations: {type: DataTypes.INTEGER, defaultValue: null},
        required_confirmations: {type: DataTypes.INTEGER, defaultValue: null},
        uid: {type: DataTypes.STRING},
    }, {
        freezeTableName: true
    }
)

export const BirPayment = sequelize.define(
    'bir_payment',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        user_id: {type: DataTypes.INTEGER},
        currency_id: {type: DataTypes.INTEGER},
        created_on: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
        value: {type: DataTypes.FLOAT},
        wallet: {type: DataTypes.STRING},
        optional_id: {type: DataTypes.STRING},
        commission: {type: DataTypes.FLOAT},
        status_id: {type: DataTypes.TINYINT, defaultValue: 0},
        code_gen: {type: DataTypes.SMALLINT, defaultValue: null},
        code_ent: {type: DataTypes.SMALLINT, defaultValue: null},
        link: {type: DataTypes.TEXT, defaultValue: null},
        answer: {type: DataTypes.TEXT, defaultValue: null},
        balance_info: {type: DataTypes.FLOAT, defaultValue: null},
        balance_history_id: {type: DataTypes.INTEGER, defaultValue: null},
    }, {
        freezeTableName: true
    }
)

export const BirSettingsReferals = sequelize.define(
    'bir_settings_referals',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING, defaultValue: null},
        key_value: {type: DataTypes.STRING, defaultValue: null},
        value: {type: DataTypes.STRING, defaultValue: null},
    }, {
        freezeTableName: true
    }
)

export const BirNews = sequelize.define(
    'bir_news',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        title: {type: DataTypes.STRING},
        text: {type: DataTypes.TEXT},
        created_on: {type: DataTypes.DATEONLY},
        language_id: {type: DataTypes.INTEGER},
    }, {
        freezeTableName: true
    }
)

export const BirPage = sequelize.define(
    'bir_page',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING},
        slug: {type: DataTypes.STRING},
        menu: {type: DataTypes.INTEGER}
    }, {
        freezeTableName: true
    }
)

export const BirPageTranslate = sequelize.define(
    'bir_page_translate',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        page_id: {type: DataTypes.INTEGER},
        language_id: {type: DataTypes.INTEGER},
        name: {type: DataTypes.STRING},
        content: {type: DataTypes.TEXT},
        keywords: {type: DataTypes.STRING},
        description: {type: DataTypes.STRING(1024)},
    }, {
        freezeTableName: true
    }
)


export const BirVipRequest = sequelize.define(
    'bir_vip_request',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        user_id: {type: DataTypes.INTEGER},
        status_id: {type: DataTypes.INTEGER},
        created_on: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    }, {
        freezeTableName: true
    }
)

export const BirLanguage = sequelize.define(
    'bir_language',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING},
        file: {type: DataTypes.STRING},
        status_id: {type: DataTypes.TINYINT},
    }, {
        freezeTableName: true
    }
)

export const BirTradeagentMarket = sequelize.define(
    'bir_tradeagent_market',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        tradeagent_id: {type: DataTypes.INTEGER},
        market_id: {type: DataTypes.INTEGER},
    }, {
        freezeTableName: true
    }
)

export const BirMarket = sequelize.define(
    'bir_market',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING},
        currency_id: {type: DataTypes.INTEGER},
    }, {
        freezeTableName: true
    }
)

export const BirSettings = sequelize.define(
    'bir_settings',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        opt_name: {type: DataTypes.STRING},
        opt_value: {type: DataTypes.TEXT, defaultValue: ''},
    }, {
        freezeTableName: true
    }
)

export const BirBalanceHistory = sequelize.define(
    'bir_balance_history',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        user_id: {type: DataTypes.INTEGER},
        currency_id: {type: DataTypes.INTEGER},
        value: {type: DataTypes.DECIMAL(16,8)},
        operation_id: {type: DataTypes.INTEGER},
        balance_info: {type: DataTypes.DECIMAL(16,8)},
        created_on: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    }, {
        freezeTableName: true
    }
)

export const BirTrade = sequelize.define(
    'bir_trade',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        user_id: {type: DataTypes.INTEGER},
        created_on: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
        market_buy: {type: DataTypes.INTEGER},
        market_sell: {type: DataTypes.INTEGER},
        agent_buy: {type: DataTypes.INTEGER},
        agent_sell: {type: DataTypes.INTEGER},
        currency_id: {type: DataTypes.INTEGER},
        cource_buy: {type: DataTypes.FLOAT},
        cource_sell: {type: DataTypes.FLOAT},
        comission_buy: {type: DataTypes.FLOAT},
        comission_sell: {type: DataTypes.FLOAT},
        comission_agent_1: {type: DataTypes.FLOAT},
        comission_agent_2: {type: DataTypes.FLOAT},
        comission_general: {type: DataTypes.FLOAT},
        comission_refferal: {type: DataTypes.FLOAT},
        comission_operator: {type: DataTypes.FLOAT},
        comission: {type: DataTypes.FLOAT},
        comission_merch: {type: DataTypes.FLOAT},
        comission_adyen: {type: DataTypes.FLOAT},
        value: {type: DataTypes.FLOAT},
        status_id: {type: DataTypes.TINYINT(4)},
        operation_time: {type: DataTypes.DECIMAL(10,4)},
        is_fail: {type: DataTypes.TINYINT(4)},
        auto_id: {type: DataTypes.INTEGER},
        balance_info: {type: DataTypes.FLOAT},
        referal_fee: {type: DataTypes.FLOAT},
        profit: {type: DataTypes.FLOAT},
        summ_start: {type: DataTypes.DOUBLE},
        balance_history_id: {type: DataTypes.INTEGER},
    }, {
        freezeTableName: true
    }
)

export const BirUserBalance = sequelize.define(
    'bir_user_balance',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        user_id: {type: DataTypes.INTEGER},
        currency_id: {type: DataTypes.INTEGER},
        value: {type: DataTypes.DECIMAL(16,8)},
    }, {
        freezeTableName: true
    }
)

export const BirUserFile = sequelize.define(
    'bir_user_file',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        user_id: {type: DataTypes.INTEGER},
        status_id: {type: DataTypes.INTEGER},
        file_1: {type: DataTypes.STRING},
        name_1: {type: DataTypes.STRING},
        file_2: {type: DataTypes.STRING},
        name_2: {type: DataTypes.STRING},
    }, {
        freezeTableName: true
    }
)


export const BirCurrencyExchange = sequelize.define(
    'bir_currency_exchange',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        currency_1: {type: DataTypes.INTEGER},
        currency_2: {type: DataTypes.INTEGER},
        cource: {type: DataTypes.FLOAT},
    }, {
        freezeTableName: true
    }
)

export const BirCurrency = sequelize.define(
    'bir_currency',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING},
        symbol: {type: DataTypes.STRING},
        min_payout: {type: DataTypes.FLOAT},
        max_payout: {type: DataTypes.FLOAT},
        min_refill: {type: DataTypes.FLOAT},
        commission: {type: DataTypes.FLOAT},
        commission_payout: {type: DataTypes.FLOAT},
        commission_payout_usd: {type: DataTypes.FLOAT, defaultValue: 0},
        non_commision_payout: {type: DataTypes.FLOAT, defaultValue: 0},
        vip_min_balance: {type: DataTypes.FLOAT},
        vip_min_payout: {type: DataTypes.FLOAT},
        trade_volume: {type: DataTypes.FLOAT},
        trade_volume_update: {type: DataTypes.DATE},
        api_id: {type: DataTypes.INTEGER},
        min_summ_exchange_balance: {type: DataTypes.DOUBLE},
        min_summ_trade: {type: DataTypes.DOUBLE},
    }, {
        freezeTableName: true
    }
)

export const BirMarketCourse = sequelize.define(
    'bir_market_course',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        market_id: {type: DataTypes.INTEGER},
        created_on: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
        buy_value: {type: DataTypes.FLOAT},
        sell_value: {type: DataTypes.FLOAT},
        low: {type: DataTypes.FLOAT},
        high: {type: DataTypes.FLOAT},
        close: {type: DataTypes.FLOAT},
        open: {type: DataTypes.FLOAT},
        volume: {type: DataTypes.FLOAT},
        ch24: {type: DataTypes.FLOAT},
    }, {
        freezeTableName: true
    }
)

export const BirTradeagent = sequelize.define(
    'bir_tradeagent',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING},
        country: {type: DataTypes.STRING},
        city: {type: DataTypes.STRING},
        payment_system: {type: DataTypes.STRING},
        bank: {type: DataTypes.STRING},
        facebook: {type: DataTypes.STRING},
        trade_time: {type: DataTypes.INTEGER},
        trade_time_vip: {type: DataTypes.INTEGER},
        trade_comission: {type: DataTypes.FLOAT},
        currency_id: {type: DataTypes.INTEGER},
        market_id: {type: DataTypes.INTEGER},
        status_id: {type: DataTypes.TINYINT},
        is_deleted: {type: DataTypes.TINYINT, defaultValue: 0},
    }, {
        freezeTableName: true
    }
)

export const BirAutotrade = sequelize.define(
    'bir_autotrade',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        user_id: {type: DataTypes.INTEGER},
        currency_id: {type: DataTypes.INTEGER},
        status_id: {type: DataTypes.INTEGER},
        value: {type: DataTypes.FLOAT},
        day: {type: DataTypes.INTEGER, defaultValue: 0},
        created_on: {type: DataTypes.DATE},
        qty: {type: DataTypes.INTEGER},
        value_finish: {type: DataTypes.DOUBLE, defaultValue: 0},
        balance_history_id: {type: DataTypes.INTEGER, defaultValue: 0},
    }, {
        freezeTableName: true
    }
)

export const BirUser = sequelize.define(
    'bir_user',
    {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        email: {type: DataTypes.STRING},
        password: {type: DataTypes.STRING},
        created_on: {type: DataTypes.DATE},
        status_id: {type: DataTypes.INTEGER},
        is_confirmed: {type: DataTypes.INTEGER},
        is_vip: {type: DataTypes.INTEGER},
        is_deleted: {type: DataTypes.INTEGER},
        chief_referral: {type: DataTypes.INTEGER},
        referral_id: {type: DataTypes.INTEGER},
        referral_branch: {type: DataTypes.INTEGER},
        first_name: {type: DataTypes.STRING},
        middle_name: {type: DataTypes.STRING},
        last_name: {type: DataTypes.STRING},
        country_id: {type: DataTypes.INTEGER},
        address: {type: DataTypes.STRING},
        pass: {type: DataTypes.STRING},
        last_fail: {type: DataTypes.DATEONLY},
        count_fail: {type: DataTypes.INTEGER},
        login_code: {type: DataTypes.INTEGER},
        register_code: {type: DataTypes.INTEGER},
        newsletter: {type: DataTypes.INTEGER},
        count_code: {type: DataTypes.STRING},
        token: {type: DataTypes.STRING},
        pass_restore: {type: DataTypes.STRING, defaultValue: null},
        pass_restore_date: {type: DataTypes.DATE, defaultValue: null},
        register_uid: {type: DataTypes.STRING, defaultValue: ''},
    }, {
        freezeTableName: true
    }
)



BirTradeagent.hasMany(BirTradeagentMarket, {foreignKey: 'tradeagent_id'})
// BirTradeagentMarket.belongsTo(BirTradeagent, {foreignKey: 'id'})