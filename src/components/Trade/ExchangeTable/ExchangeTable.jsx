import { useMemo, memo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionSetAskMid, actionSetBidMid, actionSetCalculation, actionSetOrderAmount } from '../../../store/actionCreators/tradeActionCreator';
import { actionGetCalculateion } from '../../../store/asyncActions/asyncTradeAction';
import {
  ActionButton,
  Card,
  Checkbox,
  ColoredText,
  Input,
  Table,
} from '../../../ui-kit/components';
import { scroller }  from 'react-scroll'
import styles from './ExchangeTable.module.scss';

export const ExchangeTable = () => {

  const dispatch = useDispatch()
  const balance_list = useSelector((state) => state.trade.balance_list)
  const currency_id_selected = useSelector((state) => state.trade.currency_id)
  const currency_list = useSelector((state) => state.trade.currency_list)
  const best_pair = useSelector((state) => state.trade.best_pair)
  const market_list = useSelector((state) => state.trade.market_list)
  const order_amount = useSelector((state) => state.trade.order_amount)
  const lang = useSelector((state) => state.site.lang)

  const bidMID = useSelector((state) => state.trade.bid_mid)
  const askMID = useSelector((state) => state.trade.ask_mid)

  useEffect(() => {

    let bid_mid = best_pair[currency_id_selected] ? best_pair[currency_id_selected].best_buy : 0
    dispatch(actionSetBidMid(bid_mid))

    let ask_mid = best_pair[currency_id_selected] ? best_pair[currency_id_selected].best_sell : 0
    dispatch(actionSetAskMid(ask_mid))

  },[currency_id_selected, best_pair])

  const setInputValue = (val) => {
    dispatch(actionSetOrderAmount(val))
  }

  const clearArbitrageForm = () => {
    dispatch(actionSetCalculation({}))
  }


  const columns = useMemo(
    () => [
      {
        minWidth: 40,
        maxWidth: 60,
        Header: 'Bid USD',
        accessor: 'bid',
        Cell: memo(({ row, value }) => {
          const checkboxValue = row.state.selectedCheckbox;
          const market_id = row.original.market_id
          return (
            <div className={styles['checkbox-col']}>
              <Checkbox
                className={styles['checkbox-col__checkbox']}
                active={bidMID === market_id}
                color='green'
                onClick={() => {
                  dispatch(actionSetBidMid(market_id))
                  clearArbitrageForm()
                }}
              />
              <ColoredText
                className={styles['table__text']}
                color={bidMID === market_id ? 'green' : ''}
              >
                {value}
              </ColoredText>
            </div>
          );
        }),
      },
      {
        Header: lang.trade_exchange ?? '',
        accessor: 'exchange',
        justifyContent: 'center',
        Cell: memo(({ row, value }) => {
          const market_id = row.original.market_id
          return (
            <ColoredText
              className={styles['table__text']}
              color={ market_id === bidMID ? 'green' : (market_id === askMID ? 'red' : '') }
            >
              {value}
            </ColoredText>
          );
        }),
      },
      {
        minWidth: 40,
        maxWidth: 60,
        Header: 'Ask USD',
        accessor: 'ask',
        Cell: memo(({ row, value }) => {
          const checkboxValue = row.state.selectedCheckbox;
          const market_id = row.original.market_id
          return (
            <div className={styles['checkbox-col']}>
              <Checkbox
                className={styles['checkbox-col__checkbox']}
                active={ askMID === market_id }
                color='red'
                onClick={() => {
                  dispatch(actionSetAskMid(market_id))
                  clearArbitrageForm()
                }}
              />
              <ColoredText
                className={styles['table__text']}
                color={askMID === market_id ? 'red' : ''}
              >
                {value}
              </ColoredText>
            </div>
          );
        }),
      },
    ],
    [bidMID,askMID]
  );


  const data = []
  for (let market_id in market_list) {
    let item = market_list[market_id]
    if (item.currency_id != currency_id_selected || item.buy == 0 || item.sell == 0) continue
    data.push({
      bid: item.buy,
      exchange: item.name,
      ask: item.sell,
      market_id: market_id,
    })
  }

  const calculate = () => {
    let errors = []
    if (bidMID == 0) errors.push(lang['trade_error_bid'])
    if (askMID == 0) errors.push(lang['trade_error_ask'])
    if (currency_id_selected == 0) errors.push(lang['trade_error_currency'])
    if (order_amount === null || order_amount === '' || order_amount <= 0) errors.push(lang['trade_error_amount'])

    if ( errors.length === 0 ) {
      dispatch(actionGetCalculateion(bidMID, askMID, order_amount, currency_id_selected))
      scroller.scrollTo('ArbitrageArea', {
        duration: 1500,
        delay: 100,
        smooth: true,
        offset: 50, // Scrolls to element + 50 pixels down the page
      })
    } else {
      console.log(errors)
    }

  }
  

  let symbol = currency_list.filter((item) => {if (item.currency_id === currency_id_selected) return item})[0]?.symbol ?? ''
  let min_summ_trade = currency_list.filter((item) => {if (item.currency_id === currency_id_selected) return item})[0]?.min_summ_trade ?? 0
  let best_buy_val = best_pair[currency_id_selected]?.best_buy_val ?? ''
  let best_sell_val = best_pair[currency_id_selected]?.best_sell_val ?? ''


  return (
    <Card className={styles.wrapper}>
      <h4 className={styles.title}>{ lang['trade_balance'] }: { balance_list[currency_id_selected] ?? "0.00000000" } { symbol }</h4>
      <p className={styles.text}>
      { symbol }/USD { lang['trade_top_bid'] }: <ColoredText color='gold'>{ best_buy_val }</ColoredText>
      </p>
      <p className={styles.text}>
        { lang['trade_lowest_ask'] } <ColoredText color='gold'>{ best_sell_val }</ColoredText>
      </p>
      <div className={styles['input-box']}>
        <Input
          type="number"
          step="any"
          setInputValue={setInputValue}
          valur={order_amount}
          className={styles['input-box__input-wrapper']}
          inputClassName={styles['input-box__input']}
          label={ lang['trade_enter_amount'] + ' ' + min_summ_trade + ' ' + symbol}
        />
        <ActionButton onClick={() => calculate()} className={styles['input-box__button']} type='button'>
          { lang['trade_accept'] }
        </ActionButton>
      </div>
      <Table
        className={styles.table}
        columns={columns}
        data={data}
        initialRowState={{ selectedCheckbox: null }}
        centerColumns={['exchange']}
        tableBodyClassName={styles.table__body}
      />
    </Card>
  );
};
