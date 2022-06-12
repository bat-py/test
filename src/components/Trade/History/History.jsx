import classNames from 'classnames';
import { Accordeon, Card, ColoredText, HollowButton } from '../../../ui-kit/components';

import { currencies } from '../../../utils/currencies';
import styles from './History.module.scss';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import moment from 'moment'



export const History = () => {

  const trade_result = useSelector((state) => state.trade.trade_result)
  const lang = useSelector((state) => state.site.lang)
  const [ accordeonItems , setAccordeonItems ] = useState([])
  const [ show_detail, setShowDetail ] = useState(false)
  const [ calculation, setCalculation ] = useState({})

  // currencies

  useEffect(() => {

    let arr = []

    trade_result.map((item) => {
      arr.push({
        icon: currencies[item.currency.symbol],
        token: item.currency.symbol,
        code: '#' + item.key,
        date: moment(item.created_on).format('DD/MM/YYYY'),
        time: moment(item.created_on).format('HH:mm:ss'),
        isAuto: item.auto_id == 0 ? false : true,
        profit: item.detail.profit + ' ' + item.currency.symbol,
        to_pay: item.detail.to_pay + ' ' + item.currency.symbol,
        is_success: item.detail.profit > 0 ? true : false,
        full: item
      })
    })

    setAccordeonItems(arr)

  },[trade_result])

  const detail_handler = (item) => {
    setCalculation(item.full.detail)
    setShowDetail(true)
  }

  return (
    <Accordeon title='История'>
      { show_detail ? 
      
        <Card className={styles.wrapper}> 

          <div className={styles.header}>
            <p className={styles.header__title}>{ lang['calculation_detail'] }</p>
            <p className={styles.header__time} onClick={() => setShowDetail(false)}>
              Закрыть
            </p>
          </div>
          
          <div className={styles.calculation}>
            <div className={styles['sale-purchase']}>
              <div className={styles['calculation-section']}>
                <p className={styles['calculation-section__title']}>{ lang['sale'] }</p>
                <p className={styles['calculation-section__item']}>
                  { lang['volume'] }: <ColoredText color='gold'>{ calculation.value } { calculation.currency }</ColoredText>
                </p>
                <p className={styles['calculation-section__item']}>
                  { lang['price'] }: <ColoredText color='gold'>{ calculation.cource_buy } USD</ColoredText>
                </p>
                <p className={styles['calculation-section__item']}>
                  { lang['market_exchange'] }: <ColoredText color='gold'>{ calculation.market_buy }</ColoredText>
                </p>
                <p className={styles['calculation-section__item']}>
                  { lang['beneficiary'] }: <ColoredText color='gold'>{ calculation.agent_buy }</ColoredText>
                </p>
                <p className={styles['calculation-section__item']}>
                  { lang['transit_paysafe'] }: <ColoredText color='gold'>{ calculation.comission_agent_1 }%</ColoredText>
                </p>
              </div>
              <div className={styles['calculation-section']}>
                <p className={styles['calculation-section__title']}>{ lang['purchase'] }</p>
                <p className={styles['calculation-section__item']}>
                  { lang['beneficiary'] }: <ColoredText color='gold'>{ calculation.agent_sell }</ColoredText>
                </p>
                <p className={styles['calculation-section__item']}>
                  { lang['amount'] }: <ColoredText color='gold'>{ calculation.step_2 } { calculation.currency }</ColoredText>
                </p>
                <p className={styles['calculation-section__item']}>
                  { lang['market_exchange'] }: <ColoredText color='gold'>{ calculation.market_sell }</ColoredText>
                </p>
                <p className={styles['calculation-section__item']}>
                  { lang['price'] }: <ColoredText color='gold'>{ calculation.cource_sell } { calculation.currency }</ColoredText>
                </p>
                <p className={styles['calculation-section__item']}>
                  { lang['delta'] } <ColoredText color={ calculation.ITOG_6 && calculation.ITOG_6 > 0 ? 'green' : 'red' }>{ calculation.ITOG_6 } { calculation.currency }</ColoredText>
                </p>
              </div>
            </div>
            <div className={styles['calculation-section']}>
              <p className={styles['calculation-section__title']}>{ lang['distribution'] }</p>
              <p className={styles['calculation-section__item']}>
                { lang['merchant'] }: <ColoredText color='gold'>{ calculation.comission_merch_summ } { calculation.currency }</ColoredText>
              </p>
              <p className={styles['calculation-section__item']}>
                { lang['trade_comission_agent_sale'] }: <ColoredText color='gold'>{ calculation.comission_agent_1_summ } { calculation.currency }</ColoredText>
              </p>
              <p className={styles['calculation-section__item']}>
                { lang['trade_comission_agent_purchase'] }: <ColoredText color='gold'>{ calculation.comission_agent_2_summ } { calculation.currency }</ColoredText>
              </p>
              <p className={styles['calculation-section__item']}>
                { lang['COMPANY'] }: <ColoredText color='gold'>{ calculation.comission_summ } { calculation.currency }</ColoredText>
              </p>
              <p className={styles['calculation-section__item']}>
                { lang['delta_client'] }: <ColoredText color='gold'>{ calculation.profit } { calculation.currency }</ColoredText>
              </p>
              <p className={styles['calculation-section__item']}>
                { lang['transaction_result'] }:{' '}
                <ColoredText color={ calculation.profit > 0 ? 'green' : 'red' }>{ calculation.to_pay } { calculation.currency }</ColoredText>
              </p>
            </div>
          </div>

          
        </Card>
      
        :
      <>
        {accordeonItems.map(item => {
          return (
            <div className={styles['accordeon-item']} key={ item.key }>
              <div className={styles['accordeon-item__date-and-time']}>
                { item.date } { item.time }
              </div>
              <div className={styles['accordeon-item__token']}>
                <div className={styles['accordeon-item__token-info']}>
                  <div>
                    <div className={styles['accordeon-item__token-icon-and-name']}>
                      <img className={styles['accordeon-item__token-icon']} src={item.icon} alt='' />
                      <p className={styles['accordeon-item__token-name']}>{item.token}</p>
                    </div>
                    <p className={styles['accordeon-item__token-code']}>{item.code}</p>
                  </div>
                  <div
                    className={classNames(styles['accordeon-item__token-auto-status'], {
                      [styles['accordeon-item__token-auto-status--true']]: !item.isAuto,
                    })}
                  >
                    AUTO
                  </div>
                </div>
                <div className={styles['accordeon-item__token-summary']}>
                  <ColoredText color={item.is_success ? 'green' : 'red'}>{ item.to_pay }</ColoredText>
                  <p className={styles['accordeon-item__token-profit']}>
                    <ColoredText color='dark-gray'>Profit: </ColoredText> {item.profit}
                  </p>
                </div>
                <HollowButton onClick={() => detail_handler(item)}className={styles['accordeon-item__button']}>Детали</HollowButton>
              </div>
            </div>
          );
        })}
      </> }
    </Accordeon>
  );
};
