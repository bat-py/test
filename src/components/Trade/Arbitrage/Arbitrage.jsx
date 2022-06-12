import { useDispatch, useSelector } from 'react-redux';
import { ActionButton, Card, ColoredText } from '../../../ui-kit/components';
import { Element } from 'react-scroll'
import styles from './Arbitrage.module.scss';
import { createTrade } from '../../../http/tradeAPI';
import { actionSetCalculation } from '../../../store/actionCreators/tradeActionCreator';

export const Arbitrage = () => {

  const dispatch = useDispatch()


  const order_amount = useSelector((state) => state.trade.order_amount)
  const currency_list = useSelector((state) => state.trade.currency_list)
  const currency_id_selected = useSelector((state) => state.trade.currency_id)
  const server_time = useSelector((state) => state.trade.server_time)
  const language_id = useSelector((state) => state.site.language_id)
  const lang = useSelector((state) => state.site.lang)

  let symbol = currency_list.filter((item) => {if (item.currency_id === currency_id_selected) return item})[0]?.symbol ?? ''

  const calculation = useSelector((state) => state.trade.calculation)

  const confirm = async () => {

    let buy_market_id = calculation.trade_data.buy_market_id
    let ask_market_id = calculation.trade_data.ask_market_id
    let amount = calculation.trade_data.amount
    let currency_id = calculation.trade_data.currency_id
    let agent_buy_id = calculation.trade_data.agent_buy_id
    let agent_sell_id = calculation.trade_data.agent_sell_id

    try {
      let data = await createTrade(buy_market_id, ask_market_id, amount, currency_id, agent_buy_id, agent_sell_id, language_id)
      if (data.result == 1) {
        alert(lang['trade_success_deal'])
        // Очищаем всё что уже заполнено
        dispatch(actionSetCalculation({}))
      }
    } catch (e) {
      alert(e.response.data.message)
    }

  }

  return (
    <Element name="ArbitrageArea">
      <Card className={styles.wrapper} name="ArbitrageArea" id="ArbitrageAreaId">
        <div className={styles.header}>
          <p className={styles.header__title}>{ lang['trade_success_arbitrage'] }</p>
          <p className={styles.header__time}>
            { lang['server_time'] }: <ColoredText color='gold'>{ server_time }</ColoredText>
          </p>
        </div>
        <div className={styles.calculation}>
          <p className={styles.calculation__title}>{ lang['CALCULATION'] }</p>

          <div className={styles['sale-purchase']}>
            <div className={styles['calculation-section']}>
              <p className={styles['calculation-section__title']}>{ lang['sale'] }</p>
              <p className={styles['calculation-section__item']}>
                { lang['volume'] }: <ColoredText color='gold'>{ calculation.o_value }</ColoredText>
              </p>
              <p className={styles['calculation-section__item']}>
                { lang['price'] }: <ColoredText color='gold'>{ calculation.o_price_buy }</ColoredText>
              </p>
              <p className={styles['calculation-section__item']}>
                { lang['market_exchange'] }: <ColoredText color='gold'>{ calculation.o_market_buy }</ColoredText>
              </p>
              <p className={styles['calculation-section__item']}>
                { lang['beneficiary'] }: <ColoredText color='gold'>{ calculation.o_agent_buy }</ColoredText>
              </p>
              <p className={styles['calculation-section__item']}>
                { lang['transit_paysafe'] }: <ColoredText color='gold'>{ calculation.o_total_com_adyen }</ColoredText>
              </p>
            </div>
            <div className={styles['calculation-section']}>
              <p className={styles['calculation-section__title']}>{ lang['purchase'] }</p>
              <p className={styles['calculation-section__item']}>
                { lang['beneficiary'] }: <ColoredText color='gold'>{ calculation.o_agent_sell }</ColoredText>
              </p>
              <p className={styles['calculation-section__item']}>
                { lang['amount'] }: <ColoredText color='gold'>{ calculation.o_value_usd_sell }</ColoredText>
              </p>
              <p className={styles['calculation-section__item']}>
                { lang['market_exchange'] }: <ColoredText color='gold'>{ calculation.o_market_sell }</ColoredText>
              </p>
              <p className={styles['calculation-section__item']}>
                { lang['price'] }: <ColoredText color='gold'>{ calculation.o_price_sell }</ColoredText>
              </p>
              <p className={styles['calculation-section__item']}>
                { lang['delta'] } <ColoredText color={ calculation.delta && calculation.profit_clienta > 0 ? 'green' : 'red' }>{ calculation.delta }</ColoredText>
              </p>
            </div>
          </div>
          <div className={styles['calculation-section']}>
            <p className={styles['calculation-section__title']}>{ lang['distribution'] }</p>
            <p className={styles['calculation-section__item']}>
              { lang['merchant'] }: <ColoredText color='gold'>{ calculation.o_total_com_merchant }</ColoredText>
            </p>
            <p className={styles['calculation-section__item']}>
              { lang['trade_comission_agent_sale'] }: <ColoredText color='gold'>{ calculation.o_total_com_agent_1 }</ColoredText>
            </p>
            <p className={styles['calculation-section__item']}>
              { lang['trade_comission_agent_purchase'] }: <ColoredText color='gold'>{ calculation.o_total_com_agent_2 }</ColoredText>
            </p>
            <p className={styles['calculation-section__item']}>
              { lang['COMPANY'] }: <ColoredText color='gold'>{ calculation.o_total_com_company }</ColoredText>
            </p>
            <p className={styles['calculation-section__item']}>
              { lang['delta_client'] }: <ColoredText color='gold'>{ calculation.total_delta_client }</ColoredText>
            </p>
            <p className={styles['calculation-section__item']}>
              { lang['transaction_result'] }:{' '}
              <ColoredText color={ calculation.profit_clienta > 0 ? 'green' : 'red' }>{ calculation.total_all }</ColoredText>
            </p>
          </div>
          <ActionButton className={styles.button} onClick={() => confirm()}>{ lang['confirm'] }</ActionButton>
        </div>
      </Card>
    </Element>
  );
};
