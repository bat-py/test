import { useState, useRef } from 'react';
import { Link , Navigate} from 'react-router-dom';
import classNames from 'classnames';

import { useClickOutside } from '../../hooks';
import { Card, ColoredText } from '../../ui-kit/components';

import { ReactComponent as ProfileIcon } from './assets/ProfileIcon.svg';
import { ReactComponent as MedalIcon } from './assets/Medal.svg';
import { ReactComponent as ReferalIcon } from './assets/Referal.svg';
import { ReactComponent as KeyIcon } from './assets/Key.svg';
import { ReactComponent as SignOutIcon } from './assets/SignOut.svg';
import { 
  actionSetIsAuth,
  actionSetUserData
} from '../../store/actionCreators/userActionCreator'

import Verified from './assets/Verified.png';
import styles from './LoginButton.module.scss';
import { useSelector, useDispatch } from 'react-redux'
import { MAIN_ROUTER } from '../../utils/consts';

export const LoginButton = ( { logged } ) => {

  const dispatch = useDispatch()

  const lang = useSelector((state) => state.site.lang)

  const profileMenuRef = useRef(null);
  const [active, setActive] = useState(false);

  const onProfileIconClick = () => setActive(state => !state);

  const user = useSelector((state) => state.user.user)

  const onClickOutside = () => setActive(false);

  const logOut = () => {
    
    dispatch(actionSetIsAuth(false))
    dispatch(actionSetUserData({}))

    delete localStorage.token;
    delete localStorage.pass;
    delete localStorage.email;

    Navigate(MAIN_ROUTER)
    
  }

  const cutEmail = (email) => {
    let temp = ''

    let arr = email.split('@')

    temp = arr[0].substring(0,3) + '***@' + arr[1]
    return temp
  }

  useClickOutside(onClickOutside, profileMenuRef);

  return logged ? (
    <div className={styles.wrapper} ref={profileMenuRef}>
      <div className={styles.body} onClick={onProfileIconClick}>
        <ProfileIcon
          className={classNames(styles.icon, {
            [styles['icon--active']]: active,
          })}
        />
      </div>
      {active && (
        <Card className={styles.menu}>
          <p className={styles.menu__header}>{ cutEmail(user.email) }</p>
          <Link className={styles['menu-item']} to='/verification' onClick={onClickOutside}>
            { user.verified == 1 && <>
            <img className={styles['menu-item__icon']} src={Verified} alt='' />
            <ColoredText color='green'>{ lang['login_verify'] }</ColoredText> </>}
            { user.verified == 0 && <>
            <ColoredText color='red'>{ lang['login_not_verify'] }</ColoredText> </>}
          </Link>
          <Link className={styles['menu-item']} to='/vip' onClick={onClickOutside}>
            <MedalIcon className={styles['menu-item__icon']} />
            { lang['login_vip'] }
          </Link>
          <Link className={styles['menu-item']} to='/referal' onClick={onClickOutside}>
            <ReferalIcon className={styles['menu-item__icon']} />
            { lang['login_ref'] }
          </Link>
          <Link className={styles['menu-item']} to='/change-password' onClick={onClickOutside}>
            <KeyIcon className={styles['menu-item__icon']} />
            { lang['login_change_pass'] }
          </Link>
          <div className={styles['menu-separator']} />
          <div
            className={classNames(styles['menu-item'], styles['menu-item--sign-out'])}
            onClick={logOut}
          >
            <SignOutIcon className={styles['menu-item__icon']} />
            { lang['logout'] }
          </div>
        </Card>
      )}
    </div>
  ) : (
    <Link to='/sign-in' className={styles.body}>
      <ProfileIcon className={styles.icon} />
      {!logged && lang['sign_in']}
    </Link>
  );
};
