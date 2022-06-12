import classNames from 'classnames';
import { useState } from 'react';
import { Input } from '../Input';

import { ReactComponent as EyeIcon } from './assets/EyeIcon.svg';
import { ReactComponent as EyeClosedIcon } from './assets/EyeClosedIcon.svg';

import styles from './PasswordInput.module.scss';
import { useSelector } from 'react-redux';

export const PasswordInput = ({ className, setInputValue, autocomplete, label, inputClassName }) => {
  const [showPass, setShowPass] = useState();

  const lang = useSelector((state) => state.site.lang)

  label = label ?? lang['registration_pass']

  autocomplete = autocomplete ?? 'on'

  const onShowClick = () => {
    setShowPass(state => !state);
  };

  return (
    <div className={classNames(styles.wrapper, className)}>
      <Input inputClassName={inputClassName} autocomplete={autocomplete} label={label} type={!showPass ? 'password' : 'text'} setInputValue={setInputValue} dynamicLabel />
      {showPass ? (
        <EyeClosedIcon className={styles.icon} onClick={onShowClick} />
      ) : (
        <EyeIcon className={styles.icon} onClick={onShowClick} />
      )}
    </div>
  );
};
