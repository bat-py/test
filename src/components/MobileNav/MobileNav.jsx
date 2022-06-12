import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { ActionButton, ColoredText } from '../../ui-kit/components';

import { ReactComponent as BalanceIcon } from './assets/Balance.svg';
import { ReactComponent as SupportIcon } from './assets/Support.svg';
import { ReactComponent as TradeIcon } from './assets/Trade.svg';
import { ReactComponent as HistoryIcon } from './assets/History.svg';
import { ReactComponent as SignOutIcon } from './assets/SignOut.svg';

import styles from './MobileNav.module.scss';

export const MobileNav = () => {
  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        <div className={styles['nav__button-group']}>
          <NavLink to='/balance' className={styles['nav__button-wrapper']}>
            {({ isActive }) => (
              <div className={styles.nav__button}>
                <BalanceIcon
                  className={classNames(styles['nav__button-icon'], {
                    [styles['nav__button-icon--active']]: isActive,
                  })}
                />
                <ColoredText color={isActive ? 'green' : 'white'}>Баланс</ColoredText>
              </div>
            )}
          </NavLink>
          <NavLink to='/support' className={styles['nav__button-wrapper']}>
            {({ isActive }) => (
              <div className={styles.nav__button}>
                <SupportIcon
                  className={classNames(styles['nav__button-icon'], {
                    [styles['nav__button-icon--active']]: isActive,
                  })}
                />
                <ColoredText color={isActive ? 'green' : 'white'}>Поддержка</ColoredText>
              </div>
            )}
          </NavLink>
        </div>
        <div className={styles['nav__button-group']}>
          <NavLink to='/history' className={styles['nav__button-wrapper']}>
            {({ isActive }) => (
              <div className={styles.nav__button}>
                <HistoryIcon
                  className={classNames(styles['nav__button-icon'], {
                    [styles['nav__button-icon--active']]: isActive,
                  })}
                />
                <ColoredText color={isActive ? 'green' : 'white'}>История</ColoredText>
              </div>
            )}
          </NavLink>
          <NavLink to='/' className={styles['nav__button-wrapper']}>
            {({ isActive }) => (
              <div className={styles.nav__button}>
                <SignOutIcon
                  className={classNames(styles['nav__button-icon'], {
                    [styles['nav__button-icon--active']]: isActive,
                  })}
                />
                <ColoredText color={isActive ? 'green' : 'white'}>Выйти</ColoredText>
              </div>
            )}
          </NavLink>
        </div>
      </nav>
      <div className={styles.trade}>
        <ActionButton type='link' to='/trade' className={styles.trade__button}>
          <TradeIcon className={styles.trade__icon} />
        </ActionButton>
      </div>
    </div>
  );
};
