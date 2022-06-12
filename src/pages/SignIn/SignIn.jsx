import { Link, useNavigate } from 'react-router-dom'
import { ActionButton, Input, PasswordInput } from '../../ui-kit/components'
import styles from './SignIn.module.scss'
import { useState } from 'react'
import { login } from '../../http/userAPI'
import store from '../../store/store'
import { 
  actionSetIsAuth,
  actionSetUserData
} from '../../store/actionCreators/userActionCreator'
import { MAIN_ROUTER } from '../../utils/consts'
import { useSelector, useDispatch } from 'react-redux'

export const SignIn = () => {

  const dispatch = useDispatch()
  
  const lang = useSelector((state) => state.site.lang)
  
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const navigate = useNavigate()

  const isAuth = useSelector(store => store.user.isAuth)


  if (isAuth) {
    navigate(MAIN_ROUTER)
  }

  const sendForm = async (e) => {

    e.preventDefault()

    try {

      let data = await login(email,password)
      
      dispatch(actionSetIsAuth(true))
      dispatch(actionSetUserData(data)) 

      navigate(MAIN_ROUTER)
      
    } catch(e) {
        
      alert(e.response.data.message)

    }
    
  }
  
  return (
    <div className={styles.body}>
      <h1 className={styles.title}>{ lang['login_to_crossceed'] }</h1>
      <form className={styles.form}>
        <Input className={styles.input} setInputValue={setEmail} label='E-mail' dynamicLabel />
        <PasswordInput setInputValue={setPassword} className={styles.input} />
        <div className={styles.links}>
          <Link className={styles.link} to='/password-restore'>
            { lang['login_remember_pass'] }
          </Link>
          <Link className={styles.link} to='/sign-up'>
            { lang['login_create_new_acc'] }
          </Link>
        </div>
        <ActionButton onClick={(e) => sendForm(e)} className={styles.button}>Войти</ActionButton>
      </form>
      <p className={styles.disclaimer}>
        { lang['login_auth'] }{' '}
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
