import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getPage } from '../../http/siteAPI';
import Parser from 'html-react-parser';
import moment from 'moment'
import { Card } from '../../ui-kit/components';

import styles from './Page.module.scss';

export const Page = () => {

  const language_id = useSelector((state) => state.site.language_id)
  const [page, setPage] = useState({})

  const {slug} = useParams()


  const load_data = async (slug, language_id) => {
    let data = await getPage(slug, language_id)
    setPage(data)
  }

  const replacePath = (str) => {
    let regex = /\/template\/template1/g
    str = str.replace(regex,'')
    return str
  }

  useEffect(() => {
    load_data(slug, language_id)
  },[slug, language_id])


  return (
    <>
      <div className={styles.body}>
        <h1 className={styles.title}>{ page.name }</h1>
        <div style={{marginTop: 30}} className={styles.page_content}>
          { Parser(replacePath(page.content ?? '')) }
        </div>
      </div>
    </>
  );
};
