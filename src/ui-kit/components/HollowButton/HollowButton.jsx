import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import styles from './HollowButton.module.scss';

export const HollowButton = ({ children, className, type, onClick, active, to }) => {

  const classes = {
    [styles['button--active']]: active,
  };
  if (type === 'link')
    return (
      <Link className={classNames(styles.button, className, classes)} to={to} onClick={onClick}>
        {children}
      </Link>
    );

  return (
    <button className={classNames(styles.button, className, classes)} onClick={onClick}>
      {children}
    </button>
  );
};
