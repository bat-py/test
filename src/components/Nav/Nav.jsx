import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import styles from './Nav.module.scss';
import { BALANCE_ROUTER, EXCHANGE_ROUTER, HISTORY_ROUTER, SUPPORT_ROUTER, TRADE_ROUTER } from '../../utils/consts';
import { useSelector } from 'react-redux';

export const Nav = () => {

  const lang = useSelector((state) => state.site.lang)

  const navLinks = useMemo(
    () => [
      {
        text: lang['trade'],
        to: TRADE_ROUTER,
      },
      {
        text: lang['balance'],
        to: BALANCE_ROUTER,
      },
      {
        text: lang['exchange'],
        to: EXCHANGE_ROUTER,
      },
      {
        text: lang['history'],
        to: HISTORY_ROUTER,
      },
      {
        text: lang['mob_support'],
        to: SUPPORT_ROUTER,
      },
    ],
    [lang]
  );

  return (
    <nav className={styles.body}>
      {navLinks.map(({ to, text }) => (
        <NavLink className={styles.item} to={to}>
          {({ isActive }) => (
            <span
              className={classNames(styles.item__text, {
                [styles['item--active']]: isActive,
              })}
            >
              {text}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
