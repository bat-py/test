import { useDispatch } from "react-redux"
import { actionSetAlertDanger, actionSetAlertDangerText, actionSetAlertSuccess, actionSetAlertSuccessText } from "../store/actionCreators/siteActionCreator"

export const alertSuccess = (dispatch,text) => {
    dispatch(actionSetAlertSuccessText(text))
    dispatch(actionSetAlertSuccess(true))
    setTimeout(() => {
        dispatch(actionSetAlertSuccessText(''))
        dispatch(actionSetAlertSuccess(false))
    }, 3000)
}

export const alertDanger = (dispatch,text) => {
    dispatch(actionSetAlertDangerText(text))
    dispatch(actionSetAlertDanger(true))
    setTimeout(() => {
        dispatch(actionSetAlertDangerText(''))
        dispatch(actionSetAlertDanger(false))
    }, 3000)
}