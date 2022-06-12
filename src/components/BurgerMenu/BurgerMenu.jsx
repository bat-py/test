import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageMenu, LoginButton } from '..';

import { ActionButton } from '../../ui-kit/components';
import { Close, Burger } from '../../ui-kit/assets';

import { ReactComponent as ProfileIcon } from './assets/ProfileIcon.svg';

import styles from './BurgerMenu.module.scss';
import { useSelector } from 'react-redux';

export const BurgerMenu = ({ logged }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  const lang = useSelector((state) => state.site.lang)

  const onBurgerClick = () => {
    setActive(true);
  };

  const onCloseClick = () => {
    setActive(false);
  };

  const onButtonClick = () => {
    navigate('sign-in');
    setActive(false);
  };

  return (
    <>
      {!logged ? (
        !active ? (
          <div onClick={onBurgerClick}>
            <Burger />
          </div>
        ) : (
          <div className={styles.menu}>
            <div className={styles['close-button']} onClick={onCloseClick}>
              <Close />
            </div>
            <ActionButton onClick={onButtonClick} className={styles.button}>
              {lang['login']}
            </ActionButton>
            <LanguageMenu />
          </div>
        )
      ) : (
        <LoginButton logged={logged} />
      )}
    </>
  );
};
