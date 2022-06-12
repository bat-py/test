import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getNewsItem } from '../../http/siteAPI';
import moment from 'moment'
import { Card } from '../../ui-kit/components';

import styles from './NewsItem.module.scss';

export const NewsItem = () => {

  const [news, setNews] = useState([])

  const {id} = useParams()

  const load_data = async (id) => {
    let data = await getNewsItem(id)
    setNews(data)
  }

  useEffect(() => {
    load_data(id)
  },[id])


  return (
    <>
      <div className={styles.body}>
        <h1 className={styles.title}>{ news.title }</h1>
        <div style={{marginTop: 30}}>
          { news.text }
        </div>
      </div>
    </>
  );
};
