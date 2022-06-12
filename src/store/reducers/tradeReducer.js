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

const initialState = {
    language_id: 1,
    agent_buy_id: 0,
    agent_sell_id: 0,
    currency_id: 1,
    graph: {},
    best_pair: {},
    market_list: {},
    cource_currency: {},
    auto_list: {},
    tradeagent_list: [],
    currency_list: [],
    currency_exchange: {},
    balance_list: {},
    trade_result:[],
    trade_result_online: {},
    bid_mid: 0,
    ask_mid: 0,
    server_time: '',
    order_amount: '',
    calculation: {},
    graph_ask: [],
    graph_bid: [],
};


const tradeReducer = (state = initialState, action) => {
    switch(action.type) {
        case ACTION_CHANGE_CURRENCY: return { ...state, currency_id: action.payload };
        case ACTION_SET_GRAPH: return { ...state, graph: action.payload };
        case ACTION_SET_BEST_PAIR: return { ...state, best_pair: action.payload };
        case ACTION_SET_MARKET_LIST: return { ...state, market_list: action.payload };
        case ACTION_SET_COURCE_CURRENCY: return { ...state, cource_currency: action.payload };
        case ACTION_SET_AUTO_LIST: return { ...state, auto_list: action.payload };
        case ACTION_SET_TRADEAGENT_LIST: return { ...state, tradeagent_list: action.payload };
        case ACTION_SET_CURRENCY_LIST: return { ...state, currency_list: action.payload };
        case ACTION_SET_CURRENCY_EXCHANGE: return { ...state, currency_exchange: action.payload };
        case ACTION_SET_BALANCE_LIST: return { ...state, balance_list: action.payload };
        case ACTION_SET_TRADE_RESULT: return { ...state, trade_result: action.payload };
        case ACTION_SET_TRADE_RESULT_ONLINE: return { ...state, trade_result_online: action.payload };
        case ACTION_SET_BID_MID: return { ...state, bid_mid: action.payload };
        case ACTION_SET_ASK_MID: return { ...state, ask_mid: action.payload };
        case ACTION_SET_ORDER_AMOUNT: return { ...state, order_amount: action.payload };
        case ACTION_SET_CALCULATION: return { ...state, calculation: action.payload };
        case ACTION_SET_SERVER_TIME: return { ...state, server_time: action.payload };
        case ACTION_SET_AGENT_BUY_ID: return { ...state, agent_buy_id: action.payload };
        case ACTION_SET_AGENT_SELL_ID: return { ...state, agent_sell_id: action.payload };
        case ACTION_SET_GRAPH_ASK: return { ...state, graph_ask: action.payload };
        case ACTION_SET_GRAPH_BID: return { ...state, graph_bid: action.payload };
        default: return state;
    }
}

export default tradeReducer