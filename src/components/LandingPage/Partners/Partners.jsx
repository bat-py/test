import { Card } from '../../../ui-kit/components';

import TechData from './assets/TechData.png';
import Tencent from './assets/Tencent.png';
import Viacom from './assets/Viacom.png';
import TaiwanBank from './assets/TaiwanBank.png';
import styles from './Partners.module.scss';
import { useSelector } from 'react-redux';

const partnersList = [
  {
    name: 'Tech Data',
    logo: TechData,
  },
  {
    name: 'Tencent',
    logo: Tencent,
  },
  {
    name: 'Viacom',
    logo: Viacom,
  },
  {
    name: 'Taiwan Business Bank',
    logo: TaiwanBank,
  },
];

export const Partners = () => {
 
  const lang = useSelector((state) => state.site.lang)

  return (
    <section className={styles.body}>
      <h3 className={styles.title}>{ lang['partners_title'] }</h3>
      <Card className={styles.list}>
        {partnersList.map(({ name, logo }) => (
          <div className={styles.item}>
            <img className={styles.item__logo} src={logo} alt='' />
            <p className={styles.item__text}>{name}</p>
          </div>
        ))}
      </Card>
    </section>
  );
};
