import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { checkPassRestore, restorePassword, restorePasswordData } from '../../http/userAPI';
import { ActionButton, Input, PasswordInput } from '../../ui-kit/components';
import { PASSWORD_RESTORE_ROUTER } from '../../utils/consts';
import styles from './RestorePassword.module.scss';

export const RestorePasswordCreate = () => {

  const { uid } = useParams()

  const [active, setActive] = useState(false)

  const lang = useSelector((state) => state.site.lang)
  const language_id = useSelector((state) => state.site.language_id)
  
  const [password, setPassword] = useState('')
  const [confirm_password, setConfirmPassword] = useState('')

  const navigate = useNavigate()

  const handlerRestorePassword = async () => {
    try {
      let data = await restorePasswordData(password, confirm_password, language_id, uid)
      alert(data.message)
      navigate('/sign-in')
    } catch(e) {
      alert(e.response.data.message)
    }
  }

  const [label_password_new, setLabelPasswordNew] = useState()
  const [label_password_new_confirm, setLabelPasswordNewConfirm] = useState()

  const [message, setMessage] = useState('')

  useEffect(() => {
    setLabelPasswordNew(lang['restore_pass_new'])
    setLabelPasswordNewConfirm(lang['restore_pass_new_confirm'])
  },[lang])


  let load_data = async () => {
    let data = await checkPassRestore(uid, language_id)
    let error = data.error
    if (error) {
      let message = data.message
      setMessage(message)
    } else {
      setActive(true)
    }
  }

  useEffect(() => {
    load_data()
  }, [])

  return (
    <div className={styles.body}>
      <h1 className={styles.title}>{ lang['restore_password_finished'] }</h1>

      { active && 
        <div className={styles.form}>
          <PasswordInput autocomplete="off" className={styles.input} setInputValue={(val) => setPassword(val)} label={ label_password_new } />
          <PasswordInput autocomplete="off" className={styles.input} setInputValue={(val) => setConfirmPassword(val)} label={ label_password_new_confirm } dynamicLabel />
          <ActionButton onClick={handlerRestorePassword} className={styles.button}>{ lang['restore_password_btn'] }</ActionButton>
        </div> 
      }

      { message !== '' && 
        <div className={styles.form}>
          { message }
          <br/>
          <br/>
          <br/>
          <ActionButton type="link" to={PASSWORD_RESTORE_ROUTER} className={styles.button}>{ lang['restore_password_btn'] }</ActionButton>
        </div>
      }

      <br/>
      <br/>
      <br/>
      <br/>

    </div>
  );
};
