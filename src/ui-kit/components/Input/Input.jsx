import classNames from 'classnames';
import { useEffect, useState } from 'react';
import styles from './Input.module.scss';

export const Input = ({ label, control, type, step, dynamicLabel, className, inputClassName, setInputValue, defvalue, disabled, autocomplete }) => {

  defvalue = defvalue ?? ''
  disabled = disabled ?? false
  step = step ?? 'any'
  autocomplete = autocomplete ?? 'on'

  const [value, setValue] = useState(defvalue)

  const updateValue = (val) => {
    setValue(val)
    setInputValue(val)
  }

  useEffect(() => {
    setValue(defvalue)
  },[defvalue])

  return (
    <div className={classNames(styles.body, className)}>
      <input
        autocomplete={autocomplete}
        value={value}
        disabled={disabled}
        onChange={(e)=>updateValue(e.target.value)}
        className={classNames(styles.input, inputClassName, {
          [styles['input--dynamic-label']]: dynamicLabel,
        })}
        {...control}
        placeholder={!dynamicLabel ? label : ' '}
        type={type}
      />
      {dynamicLabel && <span className={classNames(styles.label)}>{label}</span>}
    </div>
  );
};
