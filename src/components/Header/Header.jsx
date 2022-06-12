import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Nav, LoginButton, LanguageMenu, BurgerMenu } from '..';
import { useWindowSize } from '../../hooks';
import { Close, Logo } from '../../ui-kit/assets';
import AlertDanger from '../Alert/AlertDanger/AlertDanger';
import AlertSuccess from '../Alert/AlertSuccess/AlertSuccess';

import { VerificationWarning } from '../VerificationWarning';

import styles from './Header.module.scss';

const pagesToShowCloseButton = {
  '/sign-in': true,
  '/sign-up': true,
  '/password-restore': true,
  '/restore-email-sent': true,
  '/balance/deposit-refill': true,
};

export const Header = ({ logged = true }) => {
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();
  const location = useLocation();
  let pathname = location.pathname.includes('/balance/deposit-refill') ? '/balance/deposit-refill' : location.pathname
  const isOnLoginStage = pagesToShowCloseButton[pathname];

  const isAuth = useSelector((state) => state.user.isAuth)
  const user = useSelector((state) => state.user.user)
  const alert_success = useSelector((state) => state.site.alert_success)
  const alert_success_text = useSelector((state) => state.site.alert_success_text)
  const alert_danger = useSelector((state) => state.site.alert_danger)
  const alert_danger_text = useSelector((state) => state.site.alert_danger_text)
  


  const [showVerify, setShowVerify] = useState(false)

  useEffect(() => {

    if (isAuth && user.is_confirmed == 0) {
      setShowVerify(true)
    }

  }, [isAuth, user])

  const onCloseClick = () => {
    if (pathname === '/balance/deposit-refill') {
      navigate('/balance');
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link to='/'>
            <Logo />
          </Link>
        </div>
        {!isOnLoginStage ? (
          !isMobile ? (
            <>
              {logged && <Nav />}
              <div className={styles.menus}>
                <LoginButton logged={logged} />
                <LanguageMenu />
              </div>
            </>
          ) : (
            <BurgerMenu logged={logged} />
          )
        ) : (
          <div className={styles.close} onClick={onCloseClick}>
            <Close />
          </div>
        )}
      </header>

      { alert_success && <AlertSuccess text={ alert_success_text }/>} 
      
      { alert_danger && <AlertDanger text={ alert_danger_text }/>} 

      { showVerify && <VerificationWarning/> }

    </>
  );
};
