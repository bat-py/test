import classNames from 'classnames';
import { useEffect, useMemo } from 'react';
import { ActionButton, Select, Input, ColoredText } from '../../ui-kit/components';
import { SelectOption } from '../../components/Deposit';

import { ReactComponent as ExchangeIcon } from './assets/Exchange.svg';

import { AVAX } from '../../ui-kit/assets';
import styles from './Exchange.module.scss';
import { useDispatch } from 'react-redux';
import { getCourceCurrency, getCurrency, getCurrencyExchange } from '../../http/tradeAPI';
import { actionSetCourceCurrency, actionSetCurrencyExchange, actionSetCurrencyList } from '../../store/actionCreators/tradeActionCreator';

export const Exchange = () => {

  const dispatch = useDispatch()
  
  const load_data = async () => {

    let data

    data = await getCurrency()
    dispatch(actionSetCurrencyList(data))
    console.log(data)

    data = await getCurrencyExchange()
    dispatch(actionSetCurrencyExchange(data))
    console.log(data)

  }

  useEffect(() => {
    
    load_data()

  },[])


  const options = useMemo(
    () => [
      {
        value: 'avax',
        Component: () => <SelectOption icon={AVAX} text='AVAX' />,
      },
      {
        value: 'avax3',
        Component: () => <SelectOption icon={AVAX} text='AVAX' />,
      },
      {
        value: 'avax2',
        Component: () => <SelectOption icon={AVAX} text='AVAX' />,
      },
    ],
    []
  );

  return (
    <div className={styles.body}>
      <h1 className={styles.title}>Обмен</h1>
      <form className={styles.form}>
        <div className={styles.input}>
          <div className={styles['label-and-avaliable']}>
            <div className={styles.input__label}>Из</div>
            <div className={styles['balance-info__text']}>
              Доступно: <ColoredText color='gold'>12.12121212 AVAX</ColoredText>
            </div>
          </div>
          <Select options={options} placeholder='Выберите криптовалюту' />
        </div>
        <div className={classNames(styles.input, styles['all-amount-input'])}>
          <div className={styles.input__label}>Количество</div>
          <Input className={styles.input__wrapper} />
          <ColoredText className={styles['all-amount']} color='gold'>
            ВСЕ
          </ColoredText>
        </div>
        <div className={styles.icon}>
          <ExchangeIcon />
        </div>
        <div className={styles.input}>
          <div className={styles['label-and-avaliable']}>
            <div className={styles.input__label}>В</div>
          </div>
          <Select options={options} placeholder='Выберите криптовалюту' />
        </div>
        <div className={styles.input}>
          <div className={styles.input__label}>Количество</div>
          <Input className={styles.input__wrapper} />
        </div>
        <ActionButton className={styles.button}>Подтвердить обмен</ActionButton>
      </form>
    </div>
  );
};
