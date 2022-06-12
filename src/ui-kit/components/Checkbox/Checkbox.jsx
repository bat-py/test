import classNames from 'classnames';
import { useState } from 'react';

import { ReactComponent as CheckboxIcon } from './assets/Checkbox.svg';
import styles from './Checkbox.module.scss';

export const Checkbox = ({ onChange, color, active, onClick, className }) => {
  return (
    <CheckboxIcon
      className={classNames(styles.checkbox, className, {
        [styles['checkbox--red']]: active && color === 'red',
        [styles['checkbox--green']]: active && color === 'green',
      })}
      onClick={onClick}
    />
  );
};
