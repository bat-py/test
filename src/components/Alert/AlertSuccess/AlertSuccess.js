import { useEffect, useState } from "react"
import styles from './AlertSuccess.module.scss';

const AlertSuccess = (props) => {

    const [ text, setText ] = useState('')

    useEffect(() => {
        setText(props.text)
    },[props])

    return (
        <div className={styles.alert_success}>{ text }</div>
    )
}

export default AlertSuccess