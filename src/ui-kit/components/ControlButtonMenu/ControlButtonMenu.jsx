import classNames from 'classnames';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ControlButton } from '..';
import { actionChangeCurrency } from '../../../store/actionCreators/tradeActionCreator';
import styles from './ControlButtonMenu.module.scss';
import { actionSetCalculation, actionSetOrderAmount } from '../../../store/actionCreators/tradeActionCreator';

export const ControlButtonMenu = ({ buttons, className }) => {
  const dispatch = useDispatch()
  const currency_id_selected = useSelector((state) => state.trade.currency_id)

  const clearArbitrageForm = () => {
    dispatch(actionSetCalculation({}))
  }
  
  return (
    <div className={classNames(styles.menu, className)}>
      {buttons?.map(({ currency_id, symbol }) => (
        <ControlButton
          className={styles.button}
          onClick={() => {
            if (currency_id) {
              dispatch(actionChangeCurrency(currency_id))
              clearArbitrageForm()
            }
          }}
          name={symbol}
          active={currency_id_selected == currency_id}
        />
      ))}
    </div>
  );
};
