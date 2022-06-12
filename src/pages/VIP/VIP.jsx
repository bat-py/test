import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { send_vip_request } from '../../http/userAPI';
import { ActionButton, Card, ColoredText } from '../../ui-kit/components';

import styles from './VIP.module.scss';

export const VIP = () => {

  const sendVipRequest = async () => {
    try {
      let data = await send_vip_request()
      alert(data.message)
    } catch(e) {
      alert(e.response.data.message)
    }
  }

  const lang = useSelector((state) => state.site.lang)


  return (
    <div className={styles.body}>
      <h1 className={styles.title}>{ lang['vip_title'] }</h1>
      <Card className={styles.info}>
        <h2 className={styles.info__title}>{ lang['vip_title_additional'] }</h2>
        <p className={styles.info__text}>
          { lang['vip_text_1'] }
        </p>
        <h3 className={styles.info__subtitle}>{ lang['vip_condition'] }</h3>
        <div className={styles.info__list}>
          <p className={styles['info__list-item']}>
            <ColoredText color='gold'>1. </ColoredText>
            { lang['vip_page_msg4'] }
          </p>
          <p className={styles['info__list-item']}>
            <ColoredText color='gold'>2. </ColoredText> { lang['vip_min_balance'] }{' '}
            <ColoredText color='white'>3 BTC</ColoredText> { lang['vip_or'] }{' '}{' '}
            <ColoredText color='white'>85 ETH</ColoredText> { lang['vip_other'] }{' '}
            <ColoredText color='white'>$30 000</ColoredText>
          </p>
          <p className={styles['info__list-item']}>
            <ColoredText color='gold'>3. </ColoredText>{ lang['vip_page_msg6'] }
          </p>
          <p className={styles['info__list-item']}>
            <ColoredText color='gold'>4. </ColoredText>{ lang['vip_page_msg7'] }
          </p>
        </div>
        <ActionButton className={styles.info__button} onClick={() => sendVipRequest()}>{ lang['vip_request'] }</ActionButton>
        <p className={styles.info__disclaimer}>
          { lang['vip_text'] }{' '}
          <span className={styles['info__disclaimer--underline']}>
            { lang['vip_top'] }
          </span>{' '}
          { lang['and'] }{' '}
          <Link className={styles['info__disclaimer--underline']} to='/page/user-agreement'>
            { lang['user_agreement'] }
          </Link>
        </p>
      </Card>
    </div>
  );
};
