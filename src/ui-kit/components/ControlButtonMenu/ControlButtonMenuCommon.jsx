import classNames from 'classnames';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ControlButton } from '..';
import { actionChangeCurrency } from '../../../store/actionCreators/tradeActionCreator';
import styles from './ControlButtonMenu.module.scss';
import { actionSetCalculation, actionSetOrderAmount } from '../../../store/actionCreators/tradeActionCreator';

export const ControlButtonMenuCommont = ({ buttons, className, onChange }) => {
    const firstActive = buttons ? buttons[0].value : undefined;
    const [active, setActive] = useState(firstActive);

    const handleButtonClick = value => () => {
        setActive(value);
        onChange(value)
    };

  return (
    <div className={classNames(styles.menu, className)}>
      {buttons?.map(({ name, value }) => (
        <ControlButton
          className={styles.button}
          name={name}
          onClick={handleButtonClick(value)}
          active={active === value}
        />
      ))}
    </div>
  );
};
