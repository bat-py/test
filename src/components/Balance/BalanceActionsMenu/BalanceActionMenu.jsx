import classNames from 'classnames';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useClickOutside } from '../../../hooks';
import { ColoredText } from '../../../ui-kit/components';

import { ReactComponent as DotsIcon } from './assets/Dots.svg';
import styles from './BalanceActionsMenu.module.scss';

export const BalanceActionsMenu = ({symbol, uid}) => {
  const menuRef = useRef(null);
  const [active, setActive] = useState(false);

  const onDotsClick = () => setActive(state => !state);

  const onClickOutside = () => setActive(false);

  useClickOutside(onClickOutside, menuRef);

  return (
    <div className={styles.wrapper} onClick={onDotsClick} ref={menuRef}>
      <DotsIcon
        className={classNames(styles.icon, {
          [styles['icon--active']]: active,
        })}
      />
      {active && (
        <div className={styles.menu}>
          <Link className={styles.menu__item} to={'/deposit/' + symbol + '/' + uid}>
            <ColoredText color='gold'>Deposit</ColoredText>
          </Link>
          <Link className={styles.menu__item} to={'/withdrawal/' + symbol}>
            <ColoredText color='gold'>Withdrawal</ColoredText>
          </Link>
        </div>
      )}
    </div>
  );
};
