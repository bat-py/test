import { $authHost, $host } from './index.js'
import jwt_decode from 'jwt-decode'

export const getGraphAskBid = async (buy_market_id, ask_market_id, currency_id) => {
    const {data} = await $host.post('api/trade/get_graph_ask_bid', {
        buy_market_id, 
        ask_market_id, 
        currency_id, 
    })
    return data
}

export const stopAutoTrade = async (currency_id) => {
    const {data} = await $authHost.post('api/trade/stop_auto_trade', {
        currency_id, 
    })
    return data
}

export const startAutoTrade = async (currency_id,defvalue_qty,defvalue_amount,language_id) => {
    const {data} = await $authHost.post('api/trade/start_auto_trade', {
        currency_id, 
        defvalue_qty,
        defvalue_amount,
        language_id,
    })
    return data
}


export const createTrade = async (buy_market_id, ask_market_id, amount, currency_id,  agent_buy_id, agent_sell_id, language_id) => {
    const {data} = await $authHost.post('api/trade/create_trade', {
        buy_market_id, 
        ask_market_id,
        amount,
        agent_buy_id,
        agent_sell_id,
        currency_id,
        language_id,
    })
    return data
}


export const getCalculation = async (buy_market_id, ask_market_id, amount, currency_id) => {
    const {data} = await $authHost.post('api/trade/get_calculation', {
        buy_market_id, 
        ask_market_id,
        amount,
        currency_id
    })
    return data
}


export const getDataLandingPage = async () => {
    const {data} = await $host.get('api/trade/get_data_landing_page');
    return data
}

export const getServerTime = async () => {
    const {data} = await $host.get('api/trade/get_server_time');
    return data
}

export const getAutoList = async () => {
    const {data} = await $authHost.get('api/trade/get_auto_list')
    return data
}

export const getTradeagentList = async () => {
    const {data} = await $host.get('api/trade/get_tradeagent_list')
    return data
}

export const getCurrency = async () => {
    const {data} = await $host.get('api/trade/get_currency')
    return data
}

export const getCurrencyExchange = async () => {
    const {data} = await $host.get('api/trade/get_currency_exchange')
    return data
}

export const getTrade = async () => {
    const {data} = await $authHost.get('api/trade/get_trade')
    return data
}

export const getBestPair = async () => {
    const {data} = await $host.get('api/trade/get_best_pair')
    return data
}

export const getMarketList = async () => {
    const {data} = await $host.get('api/trade/get_market_list')
    return data
}

export const getGraph = async () => {
    const {data} = await $host.get('api/trade/get_graph')
    return data
}

export const getCourceCurrency = async () => {
    const {data} = await $host.get('api/trade/get_cource_currency')
    return data
}