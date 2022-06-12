import classNames from 'classnames';
import styles from './ColoredText.module.scss';

export const ColoredText = ({ children, color, className, onClick }) => {
  const classes = {
    [styles.gold]: color === 'gold',
    [styles.green]: color === 'green',
    [styles.red]: color === 'red',
    [styles['dark-green']]: color === 'dark-green',
    [styles['dark-gray']]: color === 'dark-gray',
    [styles.white]: color === 'white',
  };

  return (
    <span onClick={onClick} className={classNames(className, classes)}>
      {children}
    </span>
  );
};
