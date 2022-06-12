import { useSelector } from 'react-redux';
import { ActionButton, Card } from '../../../ui-kit/components';
import styles from './Info.module.scss';

export const Info = () => {
  
  const lang = useSelector((state) => state.site.lang)

  return (
    <section className={styles.body}>
      <h3 className={styles.title}>{ lang['info_title_1'] }</h3>
      <p className={styles.subtitle}>
        { lang['info_text_1'] }
      </p>
      <Card className={styles.info}>
        <div className={styles['info-block']}>
          <h5 className={styles['info-block__title']}>{ lang['info_title_2'] }</h5>
          <p className={styles['info-block__text']}>
            { lang['info_text_2'] }
          </p>
        </div>
        <div className={styles['info-block']}>
          <h5 className={styles['info-block__title']}>{ lang['info_title_3'] }</h5>
          <p className={styles['info-block__text']}>
            { lang['info_text_3'] }
          </p>
        </div>
        <div className={styles['info-block']}>
          <h5 className={styles['info-block__title']}>{ lang['info_title_4'] }</h5>
          <p className={styles['info-block__text']}>
            { lang['info_text_4'] }
          </p>
        </div>
      </Card>
    </section>
  );
};
