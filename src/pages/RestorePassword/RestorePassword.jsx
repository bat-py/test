import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { restorePassword } from '../../http/userAPI';
import { ActionButton, Input, PasswordInput } from '../../ui-kit/components';
import styles from './RestorePassword.module.scss';

export const RestorePassword = () => {

  const lang = useSelector((state) => state.site.lang)
  const language_id = useSelector((state) => state.site.language_id)
  const [email, setEmail] = useState('')

  const navigate = useNavigate()

  const handlerRestorePassword = async () => {
    try {
      let data = await restorePassword(email,language_id)
      navigate('/restore-email-sent')
    } catch(e) {
      alert(e.response.data.message)
    }
  }

  return (
    <div className={styles.body}>
      <h1 className={styles.title}>{ lang['restore_password'] }</h1>
      <div className={styles.form}>
        <Input setInputValue={setEmail} className={styles.input} label='E-mail' dynamicLabel />
        <ActionButton onClick={handlerRestorePassword} className={styles.button}>{ lang['restore_password_btn'] }</ActionButton>
      </div>
    </div>
  );
};
