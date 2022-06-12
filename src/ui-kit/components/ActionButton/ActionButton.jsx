import classNames from 'classnames';
import { Link } from 'react-router-dom';
import styles from './ActionButton.module.scss';

export const ActionButton = ({ children, size, className, onClick, type, to, muted }) => {
  const classes = {
    [styles['action-button--sm']]: size === 'sm',
    [styles['action-button--muted']]: muted,
  };
  if (type === 'link')
    return (
      <Link
        to={to}
        className={classNames(styles['action-button'], classes, className)}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  return (
    <button className={classNames(styles['action-button'], classes, className)} onClick={onClick}>
      {children}
    </button>
  );
};
