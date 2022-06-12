import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { change_password } from '../../http/userAPI';
import { ActionButton, Card, Input, PasswordInput } from '../../ui-kit/components';

import styles from './ChangePassword.module.scss';

export const ChangePassword = () => {

  const navigate = useNavigate()

  const [password_old, setPasswordOld] = useState('')
  const [password_new, setPasswordNew] = useState('')
  const [password_new_confirn, setPasswordNewConfirm] = useState('')

  const lang = useSelector((state) => state.site.lang)

  const handleChangePassword = async () => {
    if (password_old.length >= 5 && password_new.length >= 5 && password_new_confirn.length >= 5) {
      try {
        let data = await change_password(password_old, password_new, password_new_confirn)
        setPasswordOld('')
        setPasswordNew('')
        setPasswordNewConfirm('')
        alert(data.message)
        navigate('/')
      } catch(e) {
        alert(e.response.data.message)
      }
    } else {
      alert(lang['change_pass_fill_all_fields'])
    }
  }

  return (
    <div className={styles.body}>
      <h1 className={styles.title}>{ lang['change_pass_title'] }</h1>
      <Card className={styles.form__wrapper}>
        <h2 className={styles.form__title}>{ lang['change_pass_data'] }</h2>
        <div className={styles.form}>
          <Input
            className={styles['form__input-wrapper']}
            inputClassName={styles['form__input']}
            setInputValue={setPasswordOld}
            label={ lang['change_pass_old_pass'] }
            type="password"
          />
          <Input
            className={styles['form__input-wrapper']}
            inputClassName={styles['form__input']}
            setInputValue={setPasswordNew}
            label={ lang['change_pass_new_pass'] }
            type="password"
          />
          <Input
            className={styles['form__input-wrapper']}
            inputClassName={styles['form__input']}
            setInputValue={setPasswordNewConfirm}
            label={ lang['change_pass_new_pass_confirm'] }
            type="password"
          />
          <ActionButton onClick={handleChangePassword} className={styles['form__button']}>{ lang['change_pass_btn'] }</ActionButton>
        </div>
      </Card>
    </div>
  );
};
