import classNames from 'classnames';
import styles from './Card.module.scss';

export const Card = ({ children, className, ref }) => {
  return (
    <div className={classNames(styles.body, className)} ref={ref}>
      {children}
    </div>
  );
};
