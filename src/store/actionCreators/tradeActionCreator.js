import { 
    ACTION_CHANGE_CURRENCY,
    ACTION_SET_BEST_PAIR,
    ACTION_SET_MARKET_LIST,
    ACTION_SET_COURCE_CURRENCY,
    ACTION_SET_AUTO_LIST,
    ACTION_SET_TRADEAGENT_LIST,
    ACTION_SET_CURRENCY_LIST,
    ACTION_SET_CURRENCY_EXCHANGE,
    ACTION_SET_BALANCE_LIST,
    ACTION_SET_TRADE_RESULT,
    ACTION_SET_TRADE_RESULT_ONLINE,
    ACTION_SET_GRAPH,
    ACTION_SET_BID_MID,
    ACTION_SET_ASK_MID,
    ACTION_SET_ORDER_AMOUNT,
    ACTION_SET_CALCULATION,
    ACTION_SET_SERVER_TIME,
    ACTION_SET_AGENT_BUY_ID,
    ACTION_SET_AGENT_SELL_ID,
    ACTION_SET_GRAPH_ASK,
    ACTION_SET_GRAPH_BID,
} from '../actions/TradeAction'

export const actionSetGraphAsk = (payload) => {
    return {
        type: ACTION_SET_GRAPH_ASK,
        payload: payload
    }
}
export const actionSetGraphBid = (payload) => {
    return {
        type: ACTION_SET_GRAPH_BID,
        payload: payload
    }
}

export const actionSetAgentBuyId = (payload) => {
    return {
        type: ACTION_SET_AGENT_BUY_ID,
        payload: payload
    }
}

export const actionSetAgentSellId = (payload) => {
    return {
        type: ACTION_SET_AGENT_SELL_ID,
        payload: payload
    }
}

export const actionSetServerTime = (payload) => {
    return {
        type: ACTION_SET_SERVER_TIME,
        payload: payload
    }
}

export const actionSetOrderAmount = (payload) => {
    return {
        type: ACTION_SET_ORDER_AMOUNT,
        payload: payload
    }
}

export const actionSetCalculation = (payload) => {
    return {
        type: ACTION_SET_CALCULATION,
        payload: payload
    }
}

export const actionSetBidMid = (payload) => {
    return {
        type: ACTION_SET_BID_MID,
        payload: payload
    }
}

export const actionSetAskMid = (payload) => {
    return {
        type: ACTION_SET_ASK_MID,
        payload: payload
    }
}

export const actionChangeCurrency = (payload) => {
    return {
        type: ACTION_CHANGE_CURRENCY,
        payload: payload
    }
}

export const actionSetBestPair = (payload) => {
    return {
        type: ACTION_SET_BEST_PAIR,
        payload: payload
    }
}

export const actionSetMarketList = (payload) => {
    return {
        type: ACTION_SET_MARKET_LIST,
        payload: payload
    }
}


export const actionSetCourceCurrency = (payload) => {
    return {
        type: ACTION_SET_COURCE_CURRENCY,
        payload: payload
    }
}


export const actionSetAutoList = (payload) => {
    return {
        type: ACTION_SET_AUTO_LIST,
        payload: payload
    }
}

export const actionSetTradeagentList = (payload) => {
    return {
        type: ACTION_SET_TRADEAGENT_LIST,
        payload: payload
    }
}

export const actionSetCurrencyList = (payload) => {
    return {
        type: ACTION_SET_CURRENCY_LIST,
        payload: payload
    }
}


export const actionSetCurrencyExchange = (payload) => {
    return {
        type: ACTION_SET_CURRENCY_EXCHANGE,
        payload: payload
    }
}


export const actionSetBalanceList = (payload) => {
    return {
        type: ACTION_SET_BALANCE_LIST,
        payload: payload
    }
}

export const actionSetTradeResult = (payload) => {
    return {
        type: ACTION_SET_TRADE_RESULT,
        payload: payload
    }
}

export const actionSetTradeResultOnline = (payload) => {
    return {
        type: ACTION_SET_TRADE_RESULT_ONLINE,
        payload: payload
    }
}

export const actionSetGraph = (payload) => {
    return {
        type: ACTION_SET_GRAPH,
        payload: payload
    }
}

