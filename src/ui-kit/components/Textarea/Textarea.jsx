import classNames from 'classnames';
import { useState } from 'react';

import styles from './Textarea.module.scss';

export const Textarea = ({ className, textareaClassName, placeholder, onChange }) => {

  const [value, setValue] = useState('')

  const onHandler = (e) => {
    let val = e.target.value
    setValue(val)
    onChange(val)
  }
  return (
    <div className={classNames(className, styles.wrapper)}>
      <textarea
        className={classNames(textareaClassName, styles.textarea)}
        placeholder={placeholder}
        onChange={(e) => onHandler(e)}
        value={value}
      />
    </div>
  );
};
