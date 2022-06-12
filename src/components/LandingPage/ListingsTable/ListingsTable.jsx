import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWindowSize } from '../../../hooks';
import { getCurrency, getMarketList } from '../../../http/tradeAPI';
import { actionSetCurrencyList, actionSetMarketList } from '../../../store/actionCreators/tradeActionCreator';
import { ColoredText, Table, Arrow, ControlButtonMenu } from '../../../ui-kit/components';

import { ReactComponent as ArrangeIcon } from './assets/ArrangeIcon.svg';
import styles from './ListingsTable.module.scss';

export const ListingsTable = () => {

  const { isMobile } = useWindowSize();

  const dispatch = useDispatch()

  const currency_id_selected = useSelector((state) => state.trade.currency_id)
  const currency_list = useSelector((state) => state.trade.currency_list)
  const market_list = useSelector((state) => state.trade.market_list)
  const lang = useSelector((state) => state.site.lang)

  

  const [buttons, setButtons] = useState([])
  const [dataTable, setDataTable] = useState([])
  const [show, setShow] = useState(true)

  const load_data = async () => {

    let data

    data = await getMarketList()
    dispatch(actionSetMarketList(data))
    
    data = await getCurrency()
    dispatch(actionSetCurrencyList(data))

  }
  
  useEffect(() => {
    load_data()
  },[currency_id_selected])

  useEffect(() => {
    const data_array = []
    let i = 1
    for (let market_id in market_list) {
      let item = market_list[market_id]
      if (item.currency_id != currency_id_selected || item.buy == 0 || item.sell == 0) continue

      if (i == 6 && show) break
      data_array.push({
          name: item.name,
          bid: item.buy,
          ask: item.sell,
          arrange: item.ch24 > 0 ? true : false,
      })
      i++
    }
    setDataTable(data_array)
  },[currency_id_selected,market_list,show])

  useEffect(() => {
    let data = []
    currency_list.map((item) => {
      data.push({
        symbol: item.symbol,
        name: item.symbol,
        value: item.symbol,
        currency_id: item.currency_id,
      })
    })

    setButtons(data)

  },[currency_list])

  const columns = useMemo(
    () => [
      {
        Header: 'Exchange',
        accessor: 'name',
        maxWidth: !isMobile ? 400 : 90,
      },
      {
        Header: 'Bid USD',
        accessor: 'bid',
        maxWidth: !isMobile ? 385 : 90,
        Cell: ({ value }) => <ColoredText color='dark-green'>{value}</ColoredText>,
      },
      {
        Header: 'Ask USD',
        accessor: 'ask',
        maxWidth: !isMobile ? 385 : 90,
        Cell: ({ value }) => <ColoredText color='red'>{value}</ColoredText>,
      },
      {
        Header: <ArrangeIcon />,
        accessor: 'arrange',
        maxWidth: 15,
        Cell: ({ value }) => <Arrow color={value ? 'dark-green' : 'red'} active={value} />,
      },
    ],
    [isMobile]
  );

  
  
  return (
    <div className={styles.table}>
      <ControlButtonMenu className={styles.head} buttons={buttons} />
      <Table className={styles.body} data={dataTable} columns={columns} />
      { show && <button className={styles.button} onClick={() => setShow(!show)}>{ lang['watch_more'] }</button> }
    </div>
  );
};
