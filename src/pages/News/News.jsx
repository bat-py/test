import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getNews } from '../../http/siteAPI';
import moment from 'moment'

import styles from './News.module.scss';
/*
const news = [
  {
    title: 'Cегодня мы укомплектовали весь штат агентов',
    date: '22/04/2022',
    description:
      'Добрый день уважаемые пользователи! Cегодня мы укомплектовали весь штат агентов. Теперь работа платформы будет намного быстрее. Вы можете наблюдать что количество ордеров в сутки увеличилось. С Уважением администрация...',
  },
  {
    title: 'Cегодня мы укомплектовали весь штат агентов',
    date: '22/04/2022',
    description:
      'Добрый день уважаемые пользователи! Cегодня мы укомплектовали весь штат агентов. Теперь работа платформы будет намного быстрее. Вы можете наблюдать что количество ордеров в сутки увеличилось. С Уважением администрация...',
  },
  {
    title: 'Cегодня мы укомплектовали весь штат агентов',
    date: '22/04/2022',
    description:
      'Добрый день уважаемые пользователи! Cегодня мы укомплектовали весь штат агентов. Теперь работа платформы будет намного быстрее. Вы можете наблюдать что количество ордеров в сутки увеличилось. С Уважением администрация...',
  },
  {
    title: 'Cегодня мы укомплектовали весь штат агентов',
    date: '22/04/2022',
    description:
      'Добрый день уважаемые пользователи! Cегодня мы укомплектовали весь штат агентов. Теперь работа платформы будет намного быстрее. Вы можете наблюдать что количество ордеров в сутки увеличилось. С Уважением администрация...',
  },
];*/

export const News = () => {

  const language_id = useSelector((state) => state.site.language_id)
  const [news, setNews] = useState([])

  const load_data = async (language_id) => {
    let data = await getNews(language_id)
    setNews(data)
  }

  useEffect(() => {
    load_data(language_id)
  },[language_id])


  return (
    <>
      <div className={styles.body}>
        <h1 className={styles.title}>Новости</h1>
        {news.map(({ title, text, created_on, id }) => (
          <div className={styles['news-item']}>
            <p className={styles['news-item__date']}>{moment(new Date(created_on)).format('DD/MM/YYYY')}</p>
            <h2 className={styles['news-item__title']}>{title}</h2>
            <p className={styles['news-item__text']}>{text}</p>
            <Link className={styles['news-item__link']} to={'/news/'+id}>
              Подробнее
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};
