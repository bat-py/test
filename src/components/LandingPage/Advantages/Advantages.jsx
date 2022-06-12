import First from './assets/First.png';
import Second from './assets/Second.png';
import Third from './assets/Third.png';
import Fourth from './assets/Fourth.png';
import Fifth from './assets/Fifth.png';

import styles from './Advantages.module.scss';
import { useSelector } from 'react-redux';

export const Advantages = () => {
  
  const lang = useSelector((state) => state.site.lang)

  return (
    <section className={styles.body}>
      <h3 className={styles.title}>{ lang['advantages'] }</h3>
      <div className={styles.items}>
        <div className={styles.item}>
          <div className={styles.item__img}>
            <img src={First} alt='' />
          </div>
          <h4 className={styles.item__title}>{ lang['advantages_support'] }</h4>
          <p className={styles.item__text}>
           { lang['advantages_support_text'] }
          </p>
        </div>
        <div className={styles.item}>
          <div className={styles.item__img}>
            <img src={Second} alt='' />
          </div>
          <h4 className={styles.item__title}>{ lang['advantages_autorobot'] }</h4>
          <p className={styles.item__text}>
            { lang['advantages_autorobot_text'] }
          </p>
        </div>
        <div className={styles.item}>
          <div className={styles.item__img}>
            <img src={Third} alt='' />
          </div>
          <h4 className={styles.item__title}>{ lang['advantages_comunity'] }</h4>
          <p className={styles.item__text}>
            { lang['advantages_comunity_text'] }
          </p>
        </div>
      </div>
      <div className={styles.items}>
        <div className={styles.item}>
          <div className={styles.item__img}>
            <img src={Fourth} alt='' />
          </div>
          <h4 className={styles.item__title}>{ lang['advantages_mobile'] }</h4>
          <p className={styles.item__text}>
            { lang['advantages_mobile_text'] }
          </p>
        </div>
        <div className={styles.item}>
          <div className={styles.item__img}>
            <img src={Fifth} alt='' />
          </div>
          <h4 className={styles.item__title}>{ lang['advantages_structure'] }</h4>
          <p className={styles.item__text}>
            { lang['advantages_structure_text'] }
          </p>
        </div>
      </div>
    </section>
  );
};
