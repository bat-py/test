import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { confirmEmailUser } from '../../http/userAPI';
import styles from './ConfirmEmailData.module.scss';
import Message from './assets/Message.png';
import { useParams } from 'react-router-dom';

export const ConfirmEmailData = () => {
  
  const { uid } = useParams()

  const lang = useSelector((state) => state.site.lang)
  const language_id = useSelector((state) => state.site.language_id)
  const [show,setShow] = useState(false)
  const [showMist, setShowMist] = useState(false)

  let load_data = async () => {
    let data = await confirmEmailUser(uid, language_id)
    if (data.error == false) {
      setShow(true)
    } else {
      setShowMist(true)
    }
  }

  useEffect(() => {
    load_data()
  }, [])

  return (
    <div className={styles.body}>
      { show && 
        <>
          <img src={Message} alt='' />
          <h1 className={styles.title}>{ lang['confirm_email_title'] }</h1>
          <p className={styles.subtitle}>{ lang['confirm_email_text'] }</p>
        </>
      }
      { showMist && 
        <>
          <img src={Message} alt='' />
          <h1 className={styles.title} style={{color: 'red'}}>{ lang['confirm_email_mistake'] }</h1>
        </>
      }
    </div>
  )

}

  