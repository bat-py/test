import { memo } from 'react';
import classNames from 'classnames';

import styles from './ControlButton.module.scss';

export const ControlButton = memo(({ name, onClick, active, className }) => {
  const classes = {
    [styles.active]: active,
  };

  return (
    <button className={classNames(styles.button, classes, className)} onClick={onClick}>
      {name}
    </button>
  );
});
