import classNames from 'classnames';
import { ReactComponent as ArrowIcon } from '../../assets/Arrow.svg';

import styles from './Arrow.module.scss';

export const Arrow = ({ className, active, color }) => {
  return (
    <ArrowIcon
      className={classNames(styles.arrow, className, {
        [styles['arrow--active']]: active,
        [styles['arrow--green']]: color === 'green',
        [styles['arrow--red']]: color === 'red',
        [styles['arrow--dark-green']]: color === 'dark-green',
        [styles['arrow--gray']]: color === 'gray',
      })}
      active={active}
    />
  );
};
