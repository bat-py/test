import {
    ACTION_SET_LANGUAGE_ID,
    ACTION_SET_LANG,
    ACTION_SET_LANG_SELECTED,
    ACTION_SET_ALERT_SUCCESS,
    ACTION_SET_ALERT_SUCCESS_TEXT,
    ACTION_SET_ALERT_DANGER,
    ACTION_SET_ALERT_DANGER_TEXT,
} from '../actions/SiteAction'


const initialState = {
    language_id: 1,
    lang: {},
    lang_selected: 'ru',
    alert_success: false,
    alert_success_text: '',
    alert_danger: false,
    alert_danger_text: '',
};


const siteReducer = (state = initialState, action) => {
    switch(action.type) {
        case ACTION_SET_LANGUAGE_ID: return { ...state, language_id: action.payload }
        case ACTION_SET_LANG: return { ...state, lang: action.payload }
        case ACTION_SET_LANG_SELECTED: return { ...state, lang_selected: action.payload }
        case ACTION_SET_ALERT_SUCCESS: return { ...state, alert_success: action.payload }
        case ACTION_SET_ALERT_SUCCESS_TEXT: return { ...state, alert_success_text: action.payload }
        case ACTION_SET_ALERT_DANGER: return { ...state, alert_danger: action.payload }
        case ACTION_SET_ALERT_DANGER_TEXT: return { ...state, alert_danger_text: action.payload }
        default: return state
    }
}

export default siteReducer