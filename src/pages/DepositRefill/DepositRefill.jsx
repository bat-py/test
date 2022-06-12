import styles from './DepositRefill.module.scss'
import { useEffect, useState } from 'react'
import { getOperation } from '../../http/siteAPI';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Parser from 'html-react-parser';
import { ActionButton, Card, ControlButton } from '../../ui-kit/components';
import {QRCodeCanvas} from 'qrcode.react';


export const DepositRefill = () => {

  const language_id = useSelector((state) => state.site.language_id)
  const lang = useSelector((state) => state.site.lang)
  const [operation,setOperation] = useState({msg: '', msg_balance: ''})

  const {address} = useParams()

  const load_data = async() => {
    let data = await getOperation(address, language_id)
    setOperation(data)
    console.log(data)
  }

  useEffect(() => {
    load_data()
  },[])

  const imageSettings = {
    width: 50
  }

  return (
    <div className={styles.body}>
      <Card className={styles.card}>
        
        <div>
          <p>{ operation.balance_send } <span className={styles.green}>{ operation.value } { operation.symbol }</span> { operation.balance_to_this_address }</p>
          <br/>
          <p><strong className={styles.green_address}>{ address }</strong></p>
        </div>
        <br/>
        <div style={{textAlign: 'center'}}>
          <QRCodeCanvas size={128} imageSettings={imageSettings} value={address} />
          <br/>
          <br/>
          <div>{ Parser(operation.msg_balance) }</div>
          <br/>
          <br/>
          <ActionButton type="link" to={'/balance'} className={styles.button}>{ lang['deposit_go_to_balance'] }</ActionButton>
        </div>
      </Card>
    </div>
  );
};
