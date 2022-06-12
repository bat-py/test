import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AutorobotForm } from '..';
import { BTC, BCH, DASH, ETC, ETH, XRP, AVAX } from '../../../ui-kit/assets';
import styles from './Autorobot.module.scss';

export const Autorobot = () => {

    
  const currency_list = useSelector((state) => state.trade.currency_list)
  const balance_list = useSelector((state) => state.trade.balance_list)
  const [robotForms, setRobotForms] = useState([])
  const auto_lsit = useSelector((state) => state.trade.auto_list)
  const lang = useSelector((state) => state.site.lang)

  
  const components = {
    BTC: BTC,
    BCH: BCH,
    DASH: DASH,
    ETC: ETC,
    ETH: ETH,
    XRP: XRP,
  }

  useEffect(() => {
    let rf = []
    currency_list.map((currency) => {
      let currency_id = currency.currency_id
      let symbol = currency.symbol
      let min_summ_trade = currency.min_summ_trade
      let balance = balance_list[currency_id] ?? 0
      let muted = auto_lsit[currency_id] ? true : false
      rf.push({
        icon: components[symbol],
        currency_id: currency_id,
        min_summ_trade: min_summ_trade,
        token: symbol,
        balance: balance,
        muted: muted,
      })
    })

    setRobotForms(rf)

  }, [currency_list, balance_list, auto_lsit])


  return (
    <div className={styles.wrapper}>
      {robotForms.map(form => (
        <AutorobotForm {...form} />
      ))}
    </div>
  );
};
