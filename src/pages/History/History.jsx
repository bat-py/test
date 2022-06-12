import { useEffect, useMemo, useState } from 'react';
import { Arrow, ColoredText, Table, Card } from '../../ui-kit/components';
import styles from './History.module.scss';
import classNames from 'classnames';
import { getHistoryPayment } from '../../http/siteAPI';
import { useSelector } from 'react-redux';
import { BTC, BCH, DASH, ETC, ETH, XRP, AVAX } from '../../ui-kit/assets';
import moment from 'moment'
export const History = () => {

  const lang  = useSelector((state) => state.site.lang)
  const lang_selected = useSelector((state) => state.site.lang_selected)
  const [hist,setHist] = useState([])

  const components = {
    BTC: BTC,
    BCH: BCH,
    DASH: DASH,
    ETC: ETC,
    ETH: ETH,
    XRP: XRP,
  }

  const load_data = async () => {
    let data = await getHistoryPayment(lang_selected)
    console.log(data.array_history)
    let temp = []
    data.array_history.map((item) => {

      let status
      if ([24,30,31,40,222].includes(item.operation_id)) {
        status = false
      } else {
        status = true
      }

      temp.push({ 
        date: moment(new Date(item.created_on)).format('DD/MM/YYYY HH:mm'),
        operation: {
          value: item.value,
          icon: components[item.symbol],
          text: item.op_text,
          profit: true,
        },
        status: status,
      })
    })
    setHist(temp)
  }

  useEffect(() => {

    load_data()

  }, [lang_selected])

  const columns = useMemo(
    () => [
      {
        Header: lang['history_date'] ?? ' ',
        accessor: 'date',
        Cell: ({ value }) => <p className={styles.date}>{value}</p>,
      },
      {
        Header: lang['history_operation'] ?? ' ',
        accessor: 'operation',
        Cell: ({ value }) => (
          <div>
            <div className={styles.operation__info}>
              <img className={styles.operation__icon} src={value.icon} alt='' />
              <ColoredText color={value.value > 0 ? 'green' : 'red'}>{value.value > 0 ? '+' : ''}{value.value} </ColoredText>
              <Arrow
                className={styles.operation__arrow}
                color={value.value > 0 ? 'green' : 'red'}
                active={value.value > 0 ? 'green' : 'red'}
              />
            </div>
            <p className={styles.operation__text}>{ value.text }</p>
          </div>
        ),
      },
      {
        Header: lang['history_status'] ?? ' ',
        accessor: 'status',
        Cell: ({ value }) => (
          <ColoredText color={value ? 'green' : 'red'}>{value ? lang['history_finished'] : lang['history_expecting']}</ColoredText>
        ),
        maxWidth: 60,
      },
    ],
    [lang]
  );

  return (
    <div className={styles.body}>
      <h1 className={styles.title}>{ lang['history_title'] }</h1>

      {/* Desktop only element */}
      <Table
        className={classNames(styles.table, styles['desktop-element--block'])}
        columns={columns}
        data={hist}
        rowClassName={styles.table__row}
      />
      {/* Desktop only element */}

      {/* Mobile only element */}
      <Card className={classNames(styles.history, styles['mobile-element--block'])}>
        {hist.map(({ date, operation, status }) => (
          <div className={styles['history-item']}>
            <div className={styles['history-item__date']}>{date}</div>
            <div className={styles['history-item__operation-and-status']}>
              <div>
                <div className={styles.operation__info}>
                  <img className={styles.operation__icon} src={operation.icon} alt='' />
                  <ColoredText color={operation.profit ? 'green' : 'red'}>
                    {operation.value}{' '}
                  </ColoredText>
                  <Arrow
                    className={styles.operation__arrow}
                    color={operation.profit ? 'green' : 'red'}
                    active={operation.profit}
                  />
                </div>
                <p className={styles.operation__text}>Поступление после операции{ lang['history_income'] }</p>
              </div>
              <ColoredText
                className={styles['history-item__status']}
                color={status ? 'green' : 'red'}
              >
                {status ? lang['history_finished'] : lang['history_expecting']}
              </ColoredText>
            </div>
          </div>
        ))}
      </Card>
      {/* Mobile only element */}
    </div>
  );
};
