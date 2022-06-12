import { Link } from 'react-router-dom';
import { ColoredText, Card } from '../../ui-kit/components';

import FlagIcon from './assets/Flag.svg';
import LinkArrowIcon from './assets/LinkArrow.svg';
import CopyIcon from './assets/Copy.svg';

import styles from './Referal.module.scss';
import { useSelector } from 'react-redux';

export const Referal = () => {

  const user = useSelector((state) => state.user.user)
  const onCopyClick = () => navigator.clipboard.writeText('crossceed.com/?referral=' + user.id);

  const lang = useSelector((state) => state.site.lang)

  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          { lang['partner_invite_friends'] }.{''}
          <br />
          <ColoredText color='green'>{ lang['partner_earn_crypto'] }</ColoredText>
        </h1>
        <div className={styles.referal}>
          <h2 className={styles.referal__title}>{ lang['partner_referer_link'] }</h2>
          <Card className={styles.referal__input}>
            <span className={styles['referal__input-text']}>{ lang['partner_referer_link_2'] }</span>
            crossceed.com/?referral={user.id}
            <img
              className={styles['referal__input-icon']}
              src={CopyIcon}
              alt=''
              onClick={onCopyClick}
            />
          </Card>
        </div>
      </div>
      <Card className={styles.rules}>
        <div className={styles.rules__header}>
          <h2 className={styles.rules__title}>
            <img className={styles.rules__icon} src={FlagIcon} alt='' />
            { lang['partner_rools'] }
          </h2>
          <Link className={styles.rules__link} to='/' style={{display: 'none'}}>
            <ColoredText color='gold'>FAQ</ColoredText>
            <img className={styles['rules__link-arrow']} src={LinkArrowIcon} alt='' />
          </Link>
        </div>
        <div className={styles.rules__body}>
          <h4 className={styles.rules__subtitle}>
            <ColoredText color='gold'>
              { lang['partner_rools'] }
            </ColoredText>
          </h4>
          <p className={styles.rules__text}> { lang['partner_text_1'] }
            <br />
            <br className={styles['mobile-element--inline']} /> { lang['partner_text_2'] }
            <br />
            <br className={styles['mobile-element--inline']} /> { lang['partner_text_3'] }
            <br />
            <br className={styles['mobile-element--inline']} /> { lang['partner_text_4'] }
            <br />
            <br className={styles['mobile-element--inline']} /> { lang['partner_text_5'] }
          </p>
          <div className={styles['rules__text-blocks']}>
            <div className={styles['rules__text-block']}>
              <p className={styles['rules__text']}>
                <ColoredText color='gold'>A) </ColoredText> { lang['partner_text_6'] }
              </p>
            </div>
            <div className={styles['rules__text-block']}>
              <p className={styles['rules__text']}>
                <ColoredText color='gold'>B) </ColoredText> { lang['partner_text_7'] }
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
