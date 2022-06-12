import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_user_file, upload_user_file, verify_data } from '../../http/userAPI';
import { actionSetUserData } from '../../store/actionCreators/userActionCreator';
import { ActionButton, Card, ColoredText, FileInput, Input } from '../../ui-kit/components';

import { ReactComponent as ShieldIcon } from './assets/Shield.svg';
import styles from './Verification.module.scss';

export const Verification = () => {

  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()

  const [verified, setVerified] = useState(false);
  const [first_name, setFirstName] = useState(user.first_name);
  const [last_name, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [middle_name, setMiddleName] = useState(user.middle_name);
  const [address, setAddress] = useState(user.address);
  const lang = useSelector((state) => state.site.lang)

  const verify = async () => {

    try {
      let data = await verify_data(first_name, last_name, email, middle_name, address)
      dispatch(actionSetUserData(data)) 
      alert(lang['verification_data_saved'])
    } catch (e) {
      alert(e.response.data.message)
    }
  }

  const [formData, setFormData] = useState({})
  const [file_1, setFile1] = useState('')
  const [file_2, setFile2] = useState('')
  const [user_file, setUserFile] = useState([])
  const [need_check_files, setNeedCheckFiles] = useState(false)

  useEffect(() => {
    setFile1(lang['verification_file_1'])
    setFile2(lang['verification_file_2'])
  }, [lang])

  const onLoadFile = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] })
    if (e.target.name === 'file_1') {
      setFile1(e.target.files[0].name)
    } else if (e.target.name === 'file_2') {
      setFile2(e.target.files[0].name)
    }
  }

  const load_files = async () => {
    try {
      let data = await upload_user_file(formData)
      if (data.status == true) {
        setFile1('')
        setFile2('')
        setFormData({})
        alert(lang['verification_file_loaded'])
        setNeedCheckFiles(!need_check_files)
      }
    } catch (e) {
      alert(e.response.data.message)
    }
  }

  useEffect(() => {
    setVerified(user.verified)
  },[user])

  const load_data = async() => {
    let data = await get_user_file()
    setUserFile(data)
  }

  useEffect(() => {
    load_data()
  },[need_check_files])

  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <h1 className={styles.title}>{ lang['verification_title'] }</h1>
        <ColoredText
          className={styles.status}
          color={verified ? 'green' : 'red'}
        >
          <ShieldIcon
            className={classNames(styles.status__icon, {
              [styles['status__icon--green']]: verified,
              [styles['status__icon--red']]: !verified,
            })}
          />
          {verified ? lang['verification_already_verify'] : lang['login_not_verify']}
        </ColoredText>
      </div>
      <Card className={styles.forms}>
        <div className={styles.form}>
          <h2 className={styles.form__title}>{ lang['verification_fill_data'] }</h2>
          <div className={styles['form-row']}>
            <div className={styles['form-col']}>
              <Input
                defvalue={first_name}
                className={styles.form__item}
                inputClassName={styles['form-col__input']}
                label={ lang['verification_your_name'] }
                setInputValue={(val) => setFirstName(val)}
              />
              <Input
                defvalue={last_name}
                className={styles.form__item}
                inputClassName={styles['form-col__input']}
                label={ lang['verification_patronomic'] }
                setInputValue={(val) => setLastName(val)}
              />
              <Input
                defvalue={email}
                className={styles.form__item}
                inputClassName={styles['form-col__input']}
                label={ lang['verification_email'] }
                setInputValue={(val) => setEmail(val)}
              />
            </div>
            <div className={styles['form-col']}>
              <Input
                defvalue={middle_name}
                className={styles.form__item}
                inputClassName={styles['form-col__input']}
                label={ lang['verification_last_name'] }
                setInputValue={(val) => setMiddleName(val)}
              />
              <Input
                defvalue={address}
                className={styles.form__item}
                inputClassName={styles['form-col__input']}
                label={ lang['verification_address'] }
                setInputValue={(val) => setAddress(val)}
              />
              <ActionButton onClick={verify} className={styles.form__item}>{ lang['verification_btn'] }</ActionButton>
            </div>
          </div>
        </div>
        <div className={styles.form}>
          <h2 className={styles.form__title}>{ lang['verification_prove_persone'] }</h2>
          { user_file.length > 0 && user_file[0].status_id == 0 && 
            <div style={{color: 'rgb(100,255,100)'}}>{ lang['verification_file_loaded_waiting'] }<br/><br/></div>
          }
          <div className={styles['form-row']}>
            <div className={styles['form-col']}>
              <FileInput
                label={file_1}
                inputWrapperClassName={styles['form__item']}
                inputClassName={styles['form-col__input']}
                onUploadFile={(e) => onLoadFile(e)}
                name="file_1"
              />
            </div>
            <div className={styles['form-col']}>
              <FileInput
                label={file_2}
                inputWrapperClassName={styles['form__item']}
                inputClassName={styles['form-col__input']}
                onUploadFile={(e) => onLoadFile(e)}
                name="file_2"
              />
            </div>
          </div>
          <ActionButton onClick={() => load_files()} className={styles.form__item}>{ lang['verification_btn'] }</ActionButton>
        </div>
      </Card>
    </div>
  );
};
