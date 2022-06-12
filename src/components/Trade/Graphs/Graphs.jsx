import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ControlButtonMenu, Card } from '../../../ui-kit/components';
import styles from './Graphs.module.scss';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { actionGetGraphAskBid } from '../../../store/asyncActions/asyncTradeAction';

export const Graphs = () => {


  const dispatch = useDispatch()

  const currency_id_selected = useSelector((state) => state.trade.currency_id)
  const graph = useSelector((state) => state.trade.graph)
  const currency_list = useSelector((state) => state.trade.currency_list)
  const bid_mid = useSelector((state) => state.trade.bid_mid)
  const ask_mid = useSelector((state) => state.trade.ask_mid)
  const currency_id = useSelector((state) => state.trade.currency_id)
  const [data, setData] = useState({})
  const graph_ask = useSelector((state) => state.trade.graph_ask)
  const graph_bid = useSelector((state) => state.trade.graph_bid)
  const lang = useSelector((state) => state.site.lang)

  
  const options = {
    responsive: true,
    height: 360,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
  }

  const toStringObject = (arr,pole) => {
    let str = ''

    if (arr.length === 0) return '_'

    arr.map((item) => {
      str += item.hour
      if (pole === 'bid') {
        str += item.buy_value + "_"
      } else {
        str += item.sell_value + "_"
      }
    })

    //console.log(arr)
    //console.log(pole)
    //console.log(str)
    return str
  }


  useEffect(() => {

    dispatch(actionGetGraphAskBid(bid_mid, ask_mid, currency_id))

  },[bid_mid, ask_mid])

  const [graph_ask_saved, setGraphAskSaved] = useState([])
  const [graph_bid_saved, setGraphBidSaved] = useState([])

  useEffect(() => {


    if (toStringObject(graph_ask_saved,'ask') != toStringObject(graph_ask,'ask') || toStringObject(graph_bid_saved,'bid') != toStringObject(graph_bid,'bid')) {

      setGraphAskSaved(graph_ask)
      setGraphBidSaved(graph_bid)

      dispatch(actionGetGraphAskBid(bid_mid, ask_mid, currency_id))

      const labels = []

      const data_buy = []
      const data_sell = []

      graph_bid.map((item) => {
        labels.push(item.hour)
        data_buy.push(item.buy_value)
      })

      graph_ask.map((item) => {
        data_sell.push(item.sell_value)
      })

    

      ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
      )
      
      //const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
      
      if (data_buy.length > 0 && data_sell.length > 0) {
        setData({
          labels,
          datasets: [
            {
              label: 'Bid USD',
              data: data_buy,
              borderColor: 'rgb(50, 200, 50)',
              backgroundColor: 'rgba(50, 200, 50)',
            },
            {
              label: 'Ask USD',
              data: data_sell,
              borderColor: 'rgb(200, 50, 50)',
              backgroundColor: 'rgba(200, 50, 50)',
            },
          ],
        })
      }

      //console.log(graph_ask)
      //console.log(graph_bid)

    }


  },[graph_ask, graph_bid])


  return (
    <div className={styles.wrapper}>
      <ControlButtonMenu className={styles.controls} buttons={currency_list} />
      <Card className={styles.graph}>
        <div className={styles.graphpadding}>
          {
            data.labels && data.datasets.length > 0 && <Line height={185} options={options} data={data} />
          }
        </div>
      </Card>
    </div>
  );
};
