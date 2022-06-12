import classNames from 'classnames';

import { ColoredText, ActionButton } from '../../../ui-kit/components';
import { LandingPageCard } from '../LandingPageCard';
import { AVAX } from '../../../ui-kit/assets';
import BTC from '../LandingPageCard/assets/BTC.svg';

import styles from './HeroSection.module.scss';
import { useSelector } from 'react-redux';

export const HeroSection = () => {

  const lang = useSelector((state) => state.site.lang)

  return (
    <section className={styles.body}>
      <div className={styles['text-block']}>
        <h1 className={styles.title}>
          {lang['landing_page_title']} <ColoredText color='green'>{ lang['landing_page_title_highlighted'] }</ColoredText>
        </h1>
        <p className={styles.text}>{lang['landing_page_text']}</p>
        <ActionButton type='link' to='/sign-up'>
          {lang['sign_up']}
        </ActionButton>
      </div>
      <div className={styles.cards}>
        <LandingPageCard
          className={classNames(styles.card, styles['card--1'])}
          price='42 965,32'
          title='BTC'
          diff={-1.01}
          time='24h'
          icon={BTC}
        />
        <LandingPageCard
          className={classNames(styles.card, styles['card--2'])}
          price='42 965,32'
          title='AVAX'
          diff={1.21}
          time='24h'
          icon={AVAX}
        />
        <div className={styles['cards-bg--1']} />
        <div className={styles['cards-bg--2']} />
      </div>
    </section>
  );
};
