import classNames from 'classnames';
import { useRef } from 'react';
import { Input } from '../Input';

import { ReactComponent as ScanIcon } from './assets/Scan.svg';
import styles from './FileInput.module.scss';

export const FileInput = ({ inputClassName, inputWrapperClassName, className, label, onUploadFile, name }) => {

  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  
  return (
    <div className={classNames(styles.wrapper, className)} onClick={handleClick}>
      <input type="file" name={name} ref={hiddenFileInput} onChange={onUploadFile} className={classNames(styles.realInput)}/>
      <Input
        className={classNames(styles['input-wrapper'], inputWrapperClassName)}
        inputClassName={classNames(styles.input, inputClassName)}
        label={label}
      />
      <ScanIcon className={styles.icon} />
    </div>
  );
};
