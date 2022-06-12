import { 
    ACTION_SET_IS_AUTH,
    ACTION_SET_USER_DATA
} from '../actions/UserAction'

export const actionSetIsAuth = (payload) => {
    return {
        type: ACTION_SET_IS_AUTH,
        payload: payload
    }
}

export const actionSetUserData = (payload) => {
    return {
        type: ACTION_SET_USER_DATA,
        payload: payload
    }
}