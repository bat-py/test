import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAutoList, startAutoTrade, stopAutoTrade } from '../../../http/tradeAPI';
import { actionSetAutoList } from '../../../store/actionCreators/tradeActionCreator';
import { ActionButton, Card, ColoredText, Input } from '../../../ui-kit/components';
import { alertSuccess, alertDanger } from '../../../utils/function';

import styles from './AutorobotForm.module.scss';

export const AutorobotForm = ({ icon, token, balance, muted, min_summ_trade, currency_id }) => {

  const auto_lsit = useSelector((state) => state.trade.auto_list)
  const language_id = useSelector((state) => state.site.language_id)

  const dispatch = useDispatch()

  const [defvalue_qty, setQty] = useState('')
  const [defvalue_amount, setAmount] = useState('')
  const [text_qty, setTextQty] = useState('')
  const [text_action, setTextAction] = useState('')
  const [text_amount, setTextAmount] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [muted_btn, setMuted] = useState(muted)
  const lang = useSelector((state) => state.site.lang)

  useEffect(() => {

    let qty = auto_lsit[currency_id] ? auto_lsit[currency_id].qty : defvalue_qty
    let amount = auto_lsit[currency_id] ? auto_lsit[currency_id].value : defvalue_amount
    let text_qty_def = auto_lsit[currency_id] ? lang['operation_qty_left'] : lang['operation_qty']
    let text_action_def = auto_lsit[currency_id] ? lang['stop'] : lang['start']
    let text_amount_def = auto_lsit[currency_id] ? lang['autorobot_summ_at_work'] : lang['autorobot_enter_summ']
    let disabled_def = auto_lsit[currency_id] ? true : false
    setMuted(muted)

    setQty(qty)
    setAmount(amount)
    setTextQty(text_qty_def)
    setTextAction(text_action_def)
    setTextAmount(text_amount_def)
    setDisabled(disabled_def)

  }, [auto_lsit, muted, lang])

  const actionButton = async () => {
    if (defvalue_amount !== '' && defvalue_amount !== null && defvalue_amount >= min_summ_trade) {
      if (defvalue_amount <= balance) {
        let data
        if (disabled) {
          try {
            data = await stopAutoTrade(currency_id)
            alertSuccess(dispatch, data.data)
          } catch(e) {
            alertDanger(dispatch, e.response.data.message)
          }
        } else {
          if (defvalue_qty === '') setQty(1)
          try {
            data = await startAutoTrade(currency_id,defvalue_qty,defvalue_amount,language_id)
            alertSuccess(dispatch, data.data)
          } catch(e) {
            alertDanger(dispatch, e.response.data.message)
          }
        }
        let auto_list = await getAutoList()
        dispatch(actionSetAutoList(auto_list))
      } else alertDanger(dispatch, lang['autorobot_not_enougth'])
    } else alertDanger(dispatch, lang['autorobot_not_right_summ'])
  }

  const setInputValueAmount = (val) => {
    setAmount(val)
  }

  const setInputValueQty = (val) => {
    setQty(val)
  }


  return (
    <Card className={styles.wrapper}>
      <div className={styles.header}>
        <img src={icon} alt='' /> &nbsp; &nbsp;
        {token}
      </div>
      <div className={styles.balance}>
        <p>{ lang['your_balance'] }:</p>
        <p>
          <ColoredText color='gold'>{balance} {token}</ColoredText>
        </p>
      </div>
      <div>
        <div className={styles.form__item}>
          <p className={styles['form__input-label']}>{ text_amount }</p>
          <Input
            className={styles['form__input-wrapper']}
            inputClassName={styles.form__input}
            label={'Min ' + min_summ_trade + ' ' + token}
            defvalue={defvalue_amount}
            disabled={disabled}
            setInputValue={setInputValueAmount}
            type="number"
            step="any"
          />
        </div>
        <div className={styles.form__item}>
          <p className={styles['form__input-label']}>{ text_qty }</p>
          <Input
            className={styles['form__input-wrapper']}
            inputClassName={styles.form__input}
            label='1'
            defvalue={defvalue_qty}
            disabled={disabled}
            setInputValue={setInputValueQty}
            type="number"
            step="1"
          />
        </div>
        <ActionButton className={styles.form__button} muted={muted_btn} onClick={actionButton}>
          { text_action }
        </ActionButton>
      </div>
    </Card>
  );
};
