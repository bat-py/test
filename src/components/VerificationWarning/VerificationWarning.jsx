import { useDispatch, useSelector } from 'react-redux';
import { sendConfirmEmail } from '../../http/userAPI';
import { actionSetUserData } from '../../store/actionCreators/userActionCreator';
import { ColoredText } from '../../ui-kit/components';

import styles from './VerificationWarning.module.scss';

export const VerificationWarning = () => {

  const language_id = useSelector((state) => state.site.language_id)
  const lang = useSelector((state) => state.site.lang)
  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()

  const handlerConfirmEmail = async () => {
    let data = await sendConfirmEmail(language_id)
    if (data.error == false) {
      user.is_confirmed = 1
      alert(data.message)
      dispatch(actionSetUserData(user))
    }
  }

  return (
    <>
      { user && user.is_confirmed === 0 &&
        <div className={styles.wrapper}>
          { lang['registration_email_confirm_text_1'] } <br />
          <ColoredText color='red'>{ lang['registration_email_confirm_text_2'] }</ColoredText> 
          { lang['registration_email_confirm_text_3'] } <span onClick={handlerConfirmEmail} style={{cursor: 'pointer', textDecoration: 'underline'}}>{ lang['registration_email_confirm_text_4'] }</span>
        </div>
      }
    </>
  );
};
