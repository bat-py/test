import { combineReducers } from 'redux'
import userReducer from './userReducer'
import tradeReducer from './tradeReducer'
import siteReducer from './siteReducer'

export default combineReducers({
    user: userReducer,
    trade: tradeReducer,
    site: siteReducer,
})