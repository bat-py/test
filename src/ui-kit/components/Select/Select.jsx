import classNames from 'classnames';
import { useState, useRef, useEffect } from 'react';
import { Arrow } from '..';
import { useClickOutside } from '../../../hooks';

import styles from './Select.module.scss';

export const Select = ({ placeholder, options, onChange, className, selected_option }) => {

  selected_option = selected_option ?? null

  const selectRef = useRef(null);
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState(selected_option);

  useEffect(() => {
    setSelected(selected_option)
  },[selected_option])

  const onSelectClick = () => {
    setActive(state => !state);
  };

  const onClickOutside = () => {
    setActive(false);
  };

  const onOptionClick = option => () => {
    setSelected(option);
    onChange(option);
  };

  useClickOutside(onClickOutside, selectRef);

  return (
    <div className={classNames(className, styles.wrapper)} onClick={onSelectClick} ref={selectRef}>
      <div
        className={classNames(styles.selector, {
          [styles['selector--active']]: active,
          [styles['selector--selected']]: selected,
        })}
      >
        {selected ? selected.Component ? <selected.Component /> : selected.name : placeholder}
        <Arrow className={styles.selector__arrow} active={active} color='gray' />
      </div>
      {active && (
        <div className={styles.options}>
          {options?.map(option => (
            <div className={styles.option} onClick={onOptionClick(option)}>
              {option.Component ? <option.Component /> : option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
