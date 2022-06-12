import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { ColoredText, HollowButton, Table, Card } from '../../ui-kit/components';
import { BTC, BCH, DASH, ETC, ETH, XRP, AVAX } from '../../ui-kit/assets';

import { BalanceActionsMenu } from '../../components/Balance';

import styles from './Balance.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrency } from '../../http/tradeAPI';
import { getBalanceList } from '../../http/userAPI';
import { actionSetBalanceList, actionSetCurrencyList } from '../../store/actionCreators/tradeActionCreator';
import uniqid from 'uniqid';

export const Balance = () => {

  const dispatch = useDispatch()


  const currency_list = useSelector((state) => state.trade.currency_list)
  const balance_list = useSelector((state) => state.trade.balance_list)
  const lang = useSelector((state) => state.site.lang)

  const [robotForms, setRobotForms] = useState([])
  const [columns, setColumns] = useState([])
  const [load, setLoad] = useState(false)
  const components = {
    BTC: BTC,
    BCH: BCH,
    DASH: DASH,
    ETC: ETC,
    ETH: ETH,
    XRP: XRP,
  }
  

  const refreshBalance = async () => {
    await load_data()
    alert(lang['balance_refreshed'])
  }

  const load_data = async() => {
        
    let data

    data = await getCurrency()
    dispatch(actionSetCurrencyList(data))

    data = await getBalanceList()
    dispatch(actionSetBalanceList(data))

  }

  useEffect(() => {
    load_data()
  },[load])

  useEffect(() => {

    let rf = []
    currency_list.map((currency) => {
      let currency_id = currency.currency_id
      let name = currency.name
      let symbol = currency.symbol
      let balance = balance_list[currency_id] ?? 0
      rf.push({
        token: {
          icon: components[symbol],
          name: symbol,
          fullName: name,
        },
        total: balance,
      })
    })

    setRobotForms(rf)

    let columns_temp = [
      {
        Header: lang.balance_crypto ?? ' ',
        accessor: 'token',
        Cell: ({ value }) => {
          return (
            <div className={styles['table__token-cell']}>
              <img className={styles['table__token-icon']} src={value.icon} alt='' />
              <div>
                <p className={styles['table__token-name']}>{value.name}</p>
                <p className={styles['table__token-fullname']}>{value.fullName}</p>
              </div>
            </div>
          );
        },
      },
      {
        Header: lang.balance_total ?? ' ',
        accessor: 'total',
        Cell: ({ row, value }) => (
          <div>
            {value} {row.original.token.name}
          </div>
        ),
      },
      {
        Header: lang.balance_action ?? ' ',
        Cell: ({ row} ) => (
          <div>
            <ColoredText className={styles['table__action-link']} color='gold'>
              <Link to={'/balance/deposit/'+ row.original.token.name + '/' + uniqid()}>{ lang.deposit ?? ' ' }</Link>
            </ColoredText>{' '}
            <ColoredText className={styles['table__action-link']} color='gold'>
              <Link to={'/balance/withdrawal/' + row.original.token.name}>{ lang.withdrawal ?? ' ' }</Link>
            </ColoredText>
          </div>
        ),
      },
    ]
    
    setColumns(columns_temp)

  }, [currency_list, balance_list, lang])

  

  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <h1 className={styles.title}>{ lang['balance_crypto_wallet'] }</h1>
        <HollowButton className={styles.button} onClick={() => refreshBalance()}>{ lang['balance_refresh'] }</HollowButton>
      </div>

      {/* Desktop only element */}
      <Table
        className={classNames(styles.table, styles['desktop-element--block'])}
        rowClassName={styles.table__row}
        columns={columns}
        data={robotForms} 
      />
      {/* Desktop only element */}

      {/* Mobile only element */}
      <Card className={classNames(styles.table, styles['mobile-element--block'])}>
        {robotForms.map(({ token, total }) => (
          <div className={styles.table__row}>
            <div className={styles['table__token-cell']}>
              <img className={styles['table__token-icon']} src={token.icon} alt='' />
              <div>
                <p className={styles['table__token-name']}>{token.name}</p>
                <p className={styles['table__token-fullname']}>{token.fullName}</p>
              </div>
            </div>
            <div className={styles['table__token-total']}>
              {total} {token.name}
            </div>
            <BalanceActionsMenu uid={uniqid()} symbol={token.name}/>
          </div>
        ))}
      </Card>
      {/* Mobile only element */}
    </div>
  );
};
