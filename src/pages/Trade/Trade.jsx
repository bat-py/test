import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ExchangeTable, Graphs, Arbitrage, History, Autorobot } from '../../components/Trade';
import { useWindowSize } from '../../hooks';
import { getAutoList, getBestPair, getCourceCurrency, getCurrency, getCurrencyExchange, getGraph, getMarketList, getTrade, getTradeagentList, getServerTime } from '../../http/tradeAPI';
import { getBalanceList } from '../../http/userAPI';
import { actionSetAutoList, actionSetBalanceList, actionSetBestPair, actionSetCourceCurrency, actionSetCurrencyExchange, actionSetCurrencyList, actionSetGraph, actionSetMarketList, actionSetTradeagentList, actionSetTradeResult, actionSetTradeResultOnline, actionSetServerTime } from '../../store/actionCreators/tradeActionCreator';
import { HollowButton } from '../../ui-kit/components';


import styles from './Trade.module.scss';

export const Trade = () => {

  const dispatch = useDispatch()
  
  const [showAutorobot, setShowAutorobot] = useState(false)
  const { isMobile } = useWindowSize();

  /** DATA FROM API */
  const tradeagent_list = useSelector((state) => state.trade.tradeagent_list)
  const auto_list = useSelector((state) => state.trade.auto_list)
  const currency_list = useSelector((state) => state.trade.currency_list)
  const currency_exchange = useSelector((state) => state.trade.currency_exchange)
  const balance_list = useSelector((state) => state.trade.balance_list)
  const trade_result = useSelector((state) => state.trade.trade_result)
  const trade_result_online = useSelector((state) => state.trade.trade_result_online)
  const cource_currency = useSelector((state) => state.trade.cource_currency)
  const market_list = useSelector((state) => state.trade.market_list)
  const best_pair = useSelector((state) => state.trade.best_pair)
  const graph = useSelector((state) => state.trade.graph)
  const lang = useSelector((state) => state.site.lang)

  /** END DATA FROM API */

  const load_data = async () => {

    let data

    data = await getGraph()
    dispatch(actionSetGraph(data))
    
    data = await getBestPair()
    dispatch(actionSetBestPair(data))
    
    data = await getMarketList()
    dispatch(actionSetMarketList(data))
    
    data = await getCourceCurrency()
    dispatch(actionSetCourceCurrency(data))
    
    data = await getAutoList()
    dispatch(actionSetAutoList(data))
    
    data = await getTradeagentList()
    dispatch(actionSetTradeagentList(data))

    data = await getCurrency()
    dispatch(actionSetCurrencyList(data))

    data = await getCurrencyExchange()
    dispatch(actionSetCurrencyExchange(data))

    data = await getBalanceList()
    dispatch(actionSetBalanceList(data))

    data = await getServerTime()
    dispatch(actionSetServerTime(data))
    setInterval(async () => {
      data = await getServerTime()
      dispatch(actionSetServerTime(data))
    }, 10000)

    data = await getTrade()
    dispatch(actionSetTradeResult(data.trade_result))
    dispatch(actionSetTradeResultOnline(data.trade_result_online))

    console.log('trade_result')
    console.log(data.trade_result)

  }

  useEffect(() => {
    
    load_data()

  },[])

  const handleAutorobotClick = () => setShowAutorobot(state => !state);

  return (
    <>
      {showAutorobot && <Autorobot />}
      <div className={styles.body}>
        {!isMobile ? (
          <>
            <div className={styles['left-column']}>
              <Graphs />
              <Arbitrage />
            </div>
            <div className={styles['right-column']}>
              <HollowButton
                className={styles.button}
                active={showAutorobot}
                onClick={handleAutorobotClick}
              >
                { lang['autorobot'] }
              </HollowButton>
              <ExchangeTable />
              <History />
            </div>
          </>
        ) : (
          <>
            <HollowButton
              className={styles.button}
              active={showAutorobot}
              onClick={handleAutorobotClick}
            >
              { lang['autorobot'] }
            </HollowButton>
            <Graphs />
            <ExchangeTable />
            <Arbitrage />
            <History />
          </>
        )}
      </div>
    </>
  );
};
