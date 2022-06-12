import { Card, ColoredText } from '../../../ui-kit/components';

import IgorCEO from './assets/IgorCEO.png';
import MarinaCTO from './assets/MarinaCTO.png';
import MarkCMO from './assets/MarkCMO.png';
import DmitrySupport from './assets/DmitrySupport.png';
import AlexandraContent from './assets/AlexandraContent.png';
import styles from './Team.module.scss';
import { useSelector } from 'react-redux';

export const Team = () => {
  
  const lang = useSelector((state) => state.site.lang)

  return (
    <section className={styles.body}>
      <h3 className={styles.title}>
        { lang['team_title'] } <ColoredText color='green'>Cross</ColoredText>ceed
      </h3>
      <div className={styles.row}>
        <Card className={styles.member__item}>
          <img className={styles.member__icon} src={IgorCEO} alt='' />
          <div>
            <p className={styles.member__name}>{ lang['team_user_1'] }</p>
            <p className={styles.member__role}>{ lang['team_user_1_o'] }</p>
          </div>
        </Card>
        <Card className={styles.member__item}>
          <img className={styles.member__icon} src={MarinaCTO} alt='' />
          <div>
            <p className={styles.member__name}>{ lang['team_user_2'] }</p>
            <p className={styles.member__role}>{ lang['team_user_2_o'] }</p>
          </div>
        </Card>
        <Card className={styles.member__item}>
          <img className={styles.member__icon} src={MarkCMO} alt='' />
          <div>
            <p className={styles.member__name}>{ lang['team_user_3'] }</p>
            <p className={styles.member__role}>{ lang['team_user_3_o'] }</p>
          </div>
        </Card>
      </div>
      <div className={styles.row}>
        <Card className={styles.member__item}>
          <img className={styles.member__icon} src={DmitrySupport} alt='' />
          <div>
            <p className={styles.member__name}>{ lang['team_user_4'] }</p>
            <p className={styles.member__role}>{ lang['team_user_4_o'] }</p>
          </div>
        </Card>
        <Card className={styles.member__item}>
          <img className={styles.member__icon} src={AlexandraContent} alt='' />
          <div>
            <p className={styles.member__name}>{ lang['team_user_5'] }</p>
            <p className={styles.member__role}>{ lang['team_user_5_o'] }</p>
          </div>
        </Card>
      </div>
    </section>
  );
};
