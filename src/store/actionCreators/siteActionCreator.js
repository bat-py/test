import {
    ACTION_SET_LANGUAGE_ID,
    ACTION_SET_LANG,
    ACTION_SET_LANG_SELECTED,
    ACTION_SET_ALERT_SUCCESS,
    ACTION_SET_ALERT_SUCCESS_TEXT,
    ACTION_SET_ALERT_DANGER,
    ACTION_SET_ALERT_DANGER_TEXT,
} from '../actions/SiteAction'

export const actionSetLanguageId = (payload) => {
    return {
        type: ACTION_SET_LANGUAGE_ID,
        payload: payload
    }
}

export const actionSetLang = (payload) => {
    return {
        type: ACTION_SET_LANG,
        payload: payload
    }
}

export const actionSetLangSelected = (payload) => {
    return {
        type: ACTION_SET_LANG_SELECTED,
        payload: payload
    }
}

export const actionSetAlertSuccess = (payload) => {
    return {
        type: ACTION_SET_ALERT_SUCCESS,
        payload: payload
    }
}

export const actionSetAlertSuccessText = (payload) => {
    return {
        type: ACTION_SET_ALERT_SUCCESS_TEXT,
        payload: payload
    }
}

export const actionSetAlertDanger = (payload) => {
    return {
        type: ACTION_SET_ALERT_DANGER,
        payload: payload
    }
}

export const actionSetAlertDangerText = (payload) => {
    return {
        type: ACTION_SET_ALERT_DANGER_TEXT,
        payload: payload
    }
}