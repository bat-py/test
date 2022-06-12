import { useSelector } from 'react-redux';
import First from './assets/First.png';
import Second from './assets/Second.png';
import Third from './assets/Third.png';
import styles from './Guide.module.scss';

export const Guide = () => {

  const lang = useSelector((state) => state.site.lang)

  return (
    <section className={styles.body}>
      <div className={styles.head}>
        <h3 className={styles.title}>{ lang['guide_info_beginners'] }</h3>
        <p className={styles.subtitle}>{ lang['guide_more_about_crossceed'] }</p>
      </div>
      <div className={styles.items}>
        <div className={styles.item}>
          <img className={styles.item__img} src={First} alt='' />
          <p className={styles.item__text}>{ lang['guide_how_work'] }</p>
        </div>
        <div className={styles.item}>
          <img className={styles.item__img} src={Second} alt='' />
          <p className={styles.item__text}>{ lang['guide_how_buy'] }</p>
        </div>
        <div className={styles.item}>
          <img className={styles.item__img} src={Third} alt='' />
          <p className={styles.item__text}>{ lang['guide_crypto_wallet'] }</p>
        </div>
      </div>
    </section>
  );
};
