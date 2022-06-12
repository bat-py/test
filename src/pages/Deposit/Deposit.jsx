import { useEffect, useMemo, useState } from 'react';
import { ActionButton, Select, Input } from '../../ui-kit/components';
import { SelectOption } from '../../components/Deposit';
import { BTC, BCH, DASH, ETC, ETH, XRP } from '../../ui-kit/assets';
import styles from './Deposit.module.scss';
import { getCurrency, getCurrencyExchange } from '../../http/tradeAPI';
import { actionSetCurrencyExchange } from '../../store/actionCreators/tradeActionCreator';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getCourseBinance, refill } from '../../http/siteAPI';

export const Deposit = () => {

  const navigate = useNavigate()

  const language_id = useSelector((state) => state.site.language_id)

  const { symbol, uid } = useParams()
  const dispatch = useDispatch()
  const [seletedSymbol, setSelectedSymbol] = useState(symbol)
  const [selected_option, setSelectedOption] = useState({})
  const [course_binance, setCourseBinance] = useState({})
  const [currency, setCurrency] = useState([])
  const lang = useSelector((state) => state.site.lang)

  const components = {
    BTC: BTC,
    BCH: BCH,
    DASH: DASH,
    ETC: ETC,
    ETH: ETH,
    XRP: XRP,
  }

  const [options, setOption] = useState([])
  const [valueCrypto, setValueCrypto] = useState('')
  const [valueUsd, setValueUsd] = useState('')

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



  const load_data = async () => {

    let currency_list = await getCurrency()
    let course_binance_api = await getCourseBinance()
    setCourseBinance(course_binance_api)

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
    console.log(data.value)
    setSelectedSymbol(data.value)
    setValueUsd('')
    setValueCrypto('')
  }

  useEffect(() => {
    load_data()
  },[])

  const handlerBtn = async () => {
    let currency_id = currency.filter(i => i.symbol == seletedSymbol)[0].currency_id ?? 0
    try {
      let data = await refill(currency_id,valueCrypto,uid,language_id)
      navigate('/balance/deposit-refill/' + data.address)
    } catch (e) {
      alert(e.response.data.message)
    }
  }

  return (
    <div className={styles.body}>
      <h1 className={styles.title}>{ lang['deposit_title'] }</h1>
      <div className={styles.form}>
        <div className={styles.input}>
          <div className={styles.input__label}>{ lang['deposit_choose_crypto'] }</div>
          <Select selected_option={selected_option} options={options} onChange={onChangeSymbol} placeholder={ lang['deposit_choose_crypto'] } />
        </div>
        <div className={styles.input}>
          <div className={styles.input__label}>{ lang['deposit_choose_amount'] }</div>
          <Input type="number" step="any" className={styles.input__wrapper} defvalue={valueCrypto} setInputValue={setValueCryptoHandler}/>
        </div>
        <div className={styles.input}>
          <div className={styles.input__label}>{ lang['deposit_choose_amount_usd'] }</div>
          <Input type="number" step="any" className={styles.input__wrapper} defvalue={valueUsd} setInputValue={setValueUsdHandler} />
        </div>
        <ActionButton onClick={handlerBtn} className={styles.button}>{ lang['deposit_btn'] }</ActionButton>
      </div>
    </div>
  );
};
