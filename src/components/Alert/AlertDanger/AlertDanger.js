import { useEffect, useState } from "react"
import styles from './AlertDanger.module.scss';

const AlertDanger = (props) => {

    const [ text, setText ] = useState('')

    useEffect(() => {
        setText(props.text)
    },[props])

    return (
        <div className={styles.alert_danger}>{ text }</div>
    )
}

export default AlertDanger