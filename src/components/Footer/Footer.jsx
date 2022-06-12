import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useWindowSize } from '../../hooks';

import { ReactComponent as Logo } from '../../ui-kit/assets/Logo.svg';
import { NEWS_ROUTER } from '../../utils/consts';
import styles from './Footer.module.scss';

const pagesToShowFooterOnMobile = {
  '/': true,
};

const loginPages = {
  '/sign-up': true,
  '/sign-in': true,
  '/password-restore': true,
  '/restore-email-sent': true,
};

export const Footer = () => {
  const { isMobile } = useWindowSize();
  const location = useLocation();
  const showOnMobile = pagesToShowFooterOnMobile[location.pathname];
  const isOnLoginPage = loginPages[location.pathname];

  const lang = useSelector((state) => state.site.lang)

  return (
    (isMobile && !showOnMobile) ||
    (!isOnLoginPage && (
      <footer className={styles.footer}>
        <div className={classNames(styles.item, styles['logo-block'])}>
          <Logo className={styles.logo} />
          <p className={styles.text}>
            Copyright © 2022
            <br />
          </p>
          <p className={classNames(styles.text, styles['text--small'])}>
            Crossceed Finance. All rights reserved. Crossceed is a trademark of Crossceed Finance
            LTD
          </p>
        </div>
        {!isMobile ? (
          <>
            <div className={styles.item}>
              <h6 className={styles.title}>{ lang['footer_about_us'] }</h6>
              <Link className={styles.text} to={NEWS_ROUTER}>
                { lang['footer_news'] }
              </Link>
              <Link className={styles.text} to='/'>
                { lang['footer_agents'] }
              </Link>
              <Link className={styles.text} to='/'>
                { lang['footer_vacancies'] }
              </Link>
            </div>
            <div className={styles.item}>
              <h6 className={styles.title}>{ lang['footer_agreement'] }</h6>
              <Link className={styles.text} to='/page/bank-fees'>
                { lang['footer_cash'] }
              </Link>
              <Link className={styles.text} to='/page/risk-statement'>
                { lang['footer_risk'] }
              </Link>
              <Link className={styles.text} to='/page/aml-bsa'>
                AML & BSA tt
              </Link>
              <Link className={styles.text} to='/referal'>
                { lang['footer_for_partner'] }
              </Link>
            </div>
            <div className={styles.item}>
              <h6 className={styles.title}>{ lang['footer_safe'] }</h6>
              <Link className={styles.text} to='/page/user-agreement'>
                { lang['footer_user_agreement'] }
              </Link>
              <Link className={styles.text} to='/page/privacy-policy'>
                { lang['footer_policy'] }
              </Link>
            </div>
            <div className={styles.item}>
              <h6 className={styles.title}>{ lang['footer_help'] }</h6>
              <Link className={styles.text} to='/page/how-it-works'>
                { lang['footer_how_work'] }
              </Link>
              <Link className={styles.text} to='/page/cryptocurrency-wallets'>
                { lang['footer_crypto_wallet'] }
              </Link>
            </div>
          </>
        ) : (
          <></>
        )}
      </footer>
    ))
  );
};
