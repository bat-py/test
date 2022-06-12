import { useSelector } from 'react-redux';
import Message from './assets/Message.png';
import styles from './RestoreEmailSent.module.scss';

export const RestoreEmailSent = () => {

  const lang = useSelector((state) => state.site.lang)
  return (
    <div className={styles.body}>
      <img src={Message} alt='' />
      <h1 className={styles.title}>{ lang['restore_pass_sended'] }</h1>
      <p className={styles.subtitle}>{ lang['restore_pass_instruction'] }</p>
    </div>
  );
};
