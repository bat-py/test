import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { ActionButton, Select, Input, ColoredText } from '../../ui-kit/components';
import { BTC, BCH, DASH, ETC, ETH, XRP } from '../../ui-kit/assets';

import { SelectOption } from '../../components/Deposit';

import { AVAX } from '../../ui-kit/assets';
import styles from './Withdrawal.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrency } from '../../http/tradeAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { getCourseBinance, setWithdrawal } from '../../http/siteAPI';
import { getBalanceList } from '../../http/userAPI';

export const Withdrawal = () => {

  const language_id = useSelector((state) => state.site.language_id)
  const { symbol } = useParams()
  const dispatch = useDispatch()
  const [seletedSymbol, setSelectedSymbol] = useState(symbol)
  const [selected_option, setSelectedOption] = useState({})
  const [course_binance, setCourseBinance] = useState({})
  const [currency, setCurrency] = useState([])
  const [options, setOption] = useState([])
  const [valueCrypto, setValueCrypto] = useState('')
  const [valueUsd, setValueUsd] = useState('')
  const [min_payout, setMinPayout] = useState('')
  const [comission, setComission] = useState('')
  const [currency_balance, setCurrencyBalance] = useState({})
  const [balance, setBalance] = useState('')
  const [xml, setXml] = useState('')
  const lang = useSelector((state) => state.site.lang)

  const navigate = useNavigate()

  const setValueCryptoHandler = (val) => {
    let currency_id = currency.filter(i => i.symbol == seletedSymbol)[0].currency_id ?? 0
    setValueCrypto(val)
    let buy_value = course_binance[currency_id] ?? 0
    let res = Number(buy_value) * Number(val)
    setValueUsd(res)
  }

  const setValueUsdHandler = (val) => {
    let currency_id = currency.filter(i => i.symbol == seletedSymbol)[0].currency_id ?? 0
    setValueUsd(val)
    let buy_value = course_binance[currency_id] ?? 0
    let res = (Number(val) / Number(buy_value)).toFixed(8)
    setValueCrypto(res)
  }

  const components = {
    BTC: BTC,
    BCH: BCH,
    DASH: DASH,
    ETC: ETC,
    ETH: ETH,
    XRP: XRP,
  }

  

  const load_data = async () => {

    let currency_list = await getCurrency()
    let course_binance_api = await getCourseBinance()
    setCourseBinance(course_binance_api)

    let currency_balance_api = await getBalanceList()
    setCurrencyBalance(currency_balance_api)

    setCurrency(currency_list)

    let tmp = []
    currency_list.map((item) => {
      let op_data = {
        value: item.symbol,
        Component: () => <SelectOption icon={components[item.symbol]} text={item.symbol} />,
      }
      tmp.push(op_data)
      if (item.symbol == symbol) {
        setSelectedOption(op_data)
      }
    })
    setOption(tmp)

  }

  const onChangeSymbol = async (data) => {
    setSelectedSymbol(data.value)
    setValueUsd('')
    setValueCrypto('')
  }

  useEffect(() => {
    load_data(xml)
  },[])

  useEffect(() => {
    setMinPayout(currency.filter(i => i.symbol == seletedSymbol)[0]?.min_payout ?? '')
    setComission(currency.filter(i => i.symbol == seletedSymbol)[0]?.commission_payout ?? '')

    let currency_id = currency.filter(i => i.symbol == seletedSymbol)[0]?.currency_id ?? 0
    if (currency_id != 0) {
      setBalance(currency_balance[currency_id] ?? '0')
    }
  },[seletedSymbol, currency])

  const onWithdrawal = async() => {
    let currency_id = currency.filter(i => i.symbol == seletedSymbol)[0].currency_id ?? 0
    try {
      let data = await setWithdrawal(valueCrypto,xml,currency_id,language_id)
      alert(data.message)
      setTimeout(() => {
        navigate('/history')
      },500)
    } catch (e) {
      alert(e.response.data.message)
    }
  }
  
  return (
    <div className={styles.body}>
      <h1 className={styles.title}>{ lang['withdrawal_title'] }</h1>
      <div className={styles.form}>
        <div className={styles.input}>
          <div className={styles['label-and-avaliable']}>
            <div className={styles.input__label}>{ lang['withdrawal_choose_crypto'] }</div>
            {/* Desktop only element */}
            <div
              className={classNames(styles['balance-info__text'], styles['desktop-element--block'])}
            >
              { lang['withdrawal_avaliable'] }: <ColoredText color='gold'>{ balance } { seletedSymbol }</ColoredText>
            </div>
            {/* Desktop only element */}
          </div>
          <Select selected_option={selected_option} options={options} onChange={onChangeSymbol} placeholder={ lang['withdrawal_choose_crypto'] } />
        </div>
        <div className={styles.input}>
          <div className={styles.input__label}>{ lang['withdrawal_amount'] }</div>
          <Input type="number" step="any" className={styles.input__wrapper} defvalue={valueCrypto} setInputValue={setValueCryptoHandler} />
        </div>
        <div className={styles.input}>
          <div className={styles.input__label}>{ lang['withdrawal_amount_usd'] }</div>
          <Input type="number" step="any" className={styles.input__wrapper} defvalue={valueUsd} setInputValue={setValueUsdHandler}  />
        </div> 
        <div className={styles.input}>
          <div className={styles.input__label}>{ lang['withdrawal_xml_address'] }</div>
          <Input className={styles.input__wrapper} setInputValue={setXml} label='...' />
        </div>

        {/* Desktop only element */}
        <div className={classNames(styles['min-and-commision'], styles['desktop-element--flex'])}>
          <div className={styles['balance-info__text']}>
            { lang['withdrawal_min'] }: <ColoredText color='gold'>{ min_payout } { seletedSymbol }</ColoredText>
          </div>
          <div className={styles['balance-info__text']}>
            { lang['withdrawal_comission'] }: <ColoredText color='gold'>{ comission } { seletedSymbol }</ColoredText>
          </div>
        </div>
        {/* Desktop only element */}

        {/* Mobile only element */}
        <div className={classNames(styles['balance-info'], styles['mobile-element--block'])}>
          <div className={styles['balance-info__text']}>
            { lang['withdrawal_avaliable'] }: <ColoredText color='gold'>{ balance } { seletedSymbol }</ColoredText>
          </div>
          <div className={styles['balance-info__text']}>
            { lang['withdrawal_min'] }: <ColoredText color='gold'>{ min_payout } { seletedSymbol }</ColoredText>
          </div>
          <div className={styles['balance-info__text']}>
            { lang['withdrawal_comission'] }: <ColoredText color='gold'>{ comission } { seletedSymbol }</ColoredText>
          </div>
        </div>
        {/* Mobile only element */}

        <ActionButton onClick={onWithdrawal} className={styles.button}>{ lang['withdrawal_btn'] }</ActionButton>
      </div>
    </div>
  );
};
