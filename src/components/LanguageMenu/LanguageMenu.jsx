import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { Arrow, Card } from '../../ui-kit/components';
import { useClickOutside, useWindowSize } from '../../hooks';
import { LanguageMenuIcon } from './LanguageMenuIcon';

import RU from './assets/RU.svg';
import EN from './assets/EN.svg';
import FR from './assets/FR.svg';
import DE from './assets/DE.svg';
import ES from './assets/ES.svg';
import TR from './assets/TR.svg';

import styles from './LanguageMenu.module.scss';
import { getTranslation } from '../../http/siteAPI';
import { useDispatch } from 'react-redux';
import { actionSetLang, actionSetLanguageId } from '../../store/actionCreators/siteActionCreator';

const languages = [
  {
    lang: 'ru-RU',
    icon: RU,
    text: 'Русский',
  },
  {
    lang: 'en-US',
    icon: EN,
    text: 'English',
  },
  {
    lang: 'fr-FR',
    icon: FR,
    text: 'France',
  },
  {
    lang: 'de-DE',
    icon: DE,
    text: 'Deutschland',
  },
  {
    lang: 'es-ES',
    icon: ES,
    text: 'Spanish',
  },
  {
    lang: 'tr-TR',
    icon: TR,
    text: 'Turkish',
  },
];

export const LanguageMenu = () => {

  const [active, setActive] = useState(false);
  const { i18n } = useTranslation();
  const { isMobile } = useWindowSize();
  const languageMenuRef = useRef(null);
  const currLang = i18n.language.slice(0, 2);
  const dispatch = useDispatch()

  const handleButtonClick = () => {
    setActive(state => !state);
  };

  const language = {
    'ru': 1,
    'en': 2,
    'es': 11,
    'fr': 12,
    'de': 13,
    'tr': 14,
  }

  const handleOptionClick = async (value) => {
    i18n.changeLanguage(value.lang)
    let lang = await getTranslation(value.lang.slice(0,2))
    let language_id = language[value.lang.slice(0,2)]
    dispatch(actionSetLanguageId(language_id))
    dispatch(actionSetLang(lang))
  };

  const onClickOutside = () => {
    setActive(false);
  };

  useClickOutside(onClickOutside, languageMenuRef);

  return !isMobile ? (
    <div className={styles.wrapper} ref={languageMenuRef}>
      <div className={styles.button} onClick={handleButtonClick}>
        <LanguageMenuIcon
          className={classNames(styles.icon, {
            [styles['icon--active']]: active,
          })}
        />
        <Arrow active={active} />
      </div>
      {active && (
        <Card className={styles.body}>
          {languages.map(option => (
            <div
              className={classNames(styles.option, {
                [styles['option--active']]: currLang === option.lang.slice(0, 2),
              })}
              onClick={() => handleOptionClick(option)}
            >
              <img className={styles.option__icon} src={option.icon} alt={option.text} />
              {option.text}
            </div>
          ))}
        </Card>
      )}
    </div>
  ) : (
    <div className={styles.wrapper}>
      {languages.map(option =>
        currLang !== option.lang.slice(0, 2) ? (
          <div className={styles['option--mobile']}>
            <img className={styles.option__icon} src={option.icon} alt='' />
          </div>
        ) : (
          <LanguageMenuIcon
            className={classNames(styles.icon, styles['option--mobile'], styles['icon--active'])}
          />
        )
      )}
    </div>
  );
};
