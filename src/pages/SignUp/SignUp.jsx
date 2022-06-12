import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../http/userAPI';
import { ActionButton, Input, PasswordInput } from '../../ui-kit/components';
import styles from './SignUp.module.scss';
import { MAIN_ROUTER } from '../../utils/consts'
import { actionSetIsAuth, actionSetUserData } from '../../store/actionCreators/userActionCreator';

export const SignUp = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const lang = useSelector((state) => state.site.lang)
  const language_id = useSelector((state) => state.site.language_id)
  const isAuth = useSelector(store => store.user.isAuth)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm_password, setConfirmPassword] = useState('')

  const clickSignUp = async () => {

    if (isAuth) {
      navigate(MAIN_ROUTER)
    }
    
    try {

      let data = await register(email, name, password, confirm_password, language_id)

      dispatch(actionSetIsAuth(true))
      dispatch(actionSetUserData(data)) 

      navigate(MAIN_ROUTER)

    } catch(e) {
        
      alert(e.response.data.message)

    }

  }

  return (
    <div className={styles.body}>
      <h1 className={styles.title}>{ lang['registration_title'] }</h1>
      <div className={styles.form}>
        <Input autocomplete="off" className={styles.input} setInputValue={(val) => setEmail(val)} label='E-mail' dynamicLabel />
        <Input autocomplete="off" className={styles.input} setInputValue={(val) => setName(val)} label={ lang['registration_name'] } dynamicLabel />
        <PasswordInput autocomplete="off" className={styles.input} setInputValue={(val) => setPassword(val)} label={ lang['registration_pass'] } />
        <PasswordInput autocomplete="off" className={styles.input} setInputValue={(val) => setConfirmPassword(val)} label={ lang['registration_pass_confirm'] } dynamicLabel />
        <Link className={styles.link} to='/sign-in'>
          { lang['registration_have_account'] }
        </Link>
        <ActionButton className={styles.button} onClick={() => clickSignUp()}>Создать аккаунт</ActionButton>
      </div>
      <p className={styles.disclaimer}>
        { lang['registration_if_click'] }{' '}
        <Link className={styles.disclaimer__link} to='/page/user-agreement'>
          { lang['login_agreement'] }
        </Link>{' '}
        { lang['login_and'] }{' '}
        <Link className={styles.disclaimer__link} to='/page/privacy-policy'>
          { lang['login_policy'] }
        </Link>
      </p>
    </div>
  );
};
