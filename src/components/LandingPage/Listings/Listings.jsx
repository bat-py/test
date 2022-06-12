import { LandingPageCard } from '../LandingPageCard';
import { BTC, BCH, DASH, ETC, ETH, XRP, AVAX } from '../../../ui-kit/assets';
import { ListingsTable } from '..';

import styles from './Listings.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getDataLandingPage } from '../../../http/tradeAPI';
import { useEffect, useState } from 'react';

export const Listings = () => {

  const components = {
    BTC: BTC,
    BCH: BCH,
    DASH: DASH,
    ETC: ETC,
    ETH: ETH,
    XRP: XRP,
  }

  const supported = ['90', '80', '2321', '58', '118']

  const [arr,setArr] = useState([])
  const [charts,setCharts] = useState({})

  const load_data = async () => {
    let data = await getDataLandingPage()
    setArr(data.rate.data)
    setCharts(data.charts)
  }
  
  useEffect(() => {
    load_data()
  },[])


  return (
    <section className={styles.body}>
      <div className={styles.cards}>

        { arr.length > 0 && arr.map((item) => {

          if (supported.includes(item.id)) {
            
            return (
              <LandingPageCard
                className={styles.card}
                title={item.symbol}
                icon={components[item.symbol]}
                price={item.price_usd}
                diff={item.percent_change_24h}
                time='24h'
                charts={charts[item.id] ?? []}
              />
            )

          }
        }) }
  
      </div>
      <ListingsTable />
    </section>
  );
};
