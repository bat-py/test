import { 
    getCalculation, 
    getGraphAskBid 
} from "../../http/tradeAPI"
import { 
    actionSetCalculation, 
    actionSetAgentBuyId, 
    actionSetAgentSellId,
    actionSetGraphAsk,
    actionSetGraphBid,
} from "../actionCreators/tradeActionCreator"

export const actionGetCalculateion = (buy_market_id, ask_market_id, amount, currency_id) => {
    return async (dispatch) => {
        let data = await getCalculation(buy_market_id, ask_market_id, amount, currency_id)
        let agent_buy_id = data.agent_buy_id ?? 0
        let agent_sell_id = data.agent_sell_id ?? 0
        dispatch(actionSetCalculation(data))
        dispatch(actionSetAgentBuyId(agent_buy_id))
        dispatch(actionSetAgentSellId(agent_sell_id))
    }
}

export const actionGetGraphAskBid = (buy_market_id, ask_market_id, currency_id) => {
    return async (dispatch) => {
        let data = await getGraphAskBid(buy_market_id, ask_market_id, currency_id)
        console.log(data)
        if (data) {
            if (data.ask && data.ask.length > 0) {
                dispatch(actionSetGraphAsk(data.ask))
            }
            if (data.bid && data.bid.length > 0) {
                dispatch(actionSetGraphBid(data.bid))
            }
        }
    }
}