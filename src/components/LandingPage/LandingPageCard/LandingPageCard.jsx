import classNames from 'classnames';
import { Arrow, Card, ColoredText } from '../../../ui-kit/components';
import GraphGreen from './assets/GraphGreen.png';
import GraphRed from './assets/GraphRed.png';
import landingPageCard from './LandingPageCard.module.scss';
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
import { useEffect, useState } from 'react';

export const LandingPageCard = ({ title, time, price, diff, icon, className, charts }) => {
  const isPositive = diff > 0;
  const abs = Math.abs(diff);

  console.log(charts)

  const [data_chart, setDataChart] = useState({
    labels: [],
    datasets: [
      {
        label: 'Bid USD',
        data: [],
        borderColor: 'rgb(50, 200, 50)',
        backgroundColor: 'rgba(50, 200, 50)',
      },
    ],
  })

  const options = {
    responsive: true,
    height: 200,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false,
      },
    },
    scaleShowLabels: false,
    scales: {
      xAxes: {
          display: false
      },
      yAxes: {
        display: false
      }
    }
  }


  useEffect(() => {

    let labels = []
    let data = []
    if (charts && charts.length > 0) {
      charts.map((item) => {
        labels.push(item.hour)
        data.push(item.value)
      })

      setDataChart({
        labels,
        datasets: [
          {
            label: 'Bid USD',
            data: data,
            borderColor: isPositive ? 'rgb(50, 200, 50)' : 'rgb(200, 50, 50)',
            backgroundColor: isPositive ? 'rgb(50, 200, 50)' : 'rgb(200, 50, 50)',
            pointBorderColor: 'transparent',
            pointBackgroundColor: 'transparent',
          },
        ],
      })
    }
  },[charts])

  

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )


  return (
    <Card className={classNames(landingPageCard.card, className)}>
      <div className={landingPageCard.header}>
        <div className={landingPageCard.token}>
          <img className={landingPageCard.token__logo} src={icon} /> {' '}
          <span className={landingPageCard.token__title}>{title}</span>
        </div>
        <div className={landingPageCard.time}>{time}</div>
      </div>
      <div className={landingPageCard.body}>
        <ColoredText color='gold' className={landingPageCard.price}>
          ${price}
        </ColoredText>
        <div className={landingPageCard.graph}>
          <ColoredText className={landingPageCard.graph__diff} color={isPositive ? 'green' : 'red'}>
            <Arrow color={isPositive ? 'green' : 'red'} active={isPositive} />
            {abs}
          </ColoredText>

          <Line height={100} width={150} options={options} data={data_chart} />

        </div>
      </div>
    </Card>
  );
};
