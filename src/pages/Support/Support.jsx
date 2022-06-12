import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTickets, setTicket } from '../../http/siteAPI';
import {
  Input,
  Select,
  Textarea,
  ActionButton,
  Table,
  ColoredText,
  HollowButton,
  Card,
} from '../../ui-kit/components';

import styles from './Support.module.scss';

export const Support = () => {

  const dispatch = useDispatch()

  const user = useSelector((state) => state.user.user)
  const lang = useSelector((state) => state.site.lang)
  const language_id = useSelector((state) => state.site.language_id)
  const [tickets,setTickets] = useState([])

  const load_data = async () => {
    let data = await getTickets()
    setTickets(data)
  }

  useEffect(() => {
    load_data()
  },[])

  const columns = useMemo(
    () => [
      {
        Header: lang['support_date'] ?? ' ',
        accessor: 'date',
        Cell: ({ value }) => <p className={styles['table__bold-text']}>{value}</p>,
      },
      {
        Header: lang['support_topic'] ?? ' ',
        accessor: 'topic',
        Cell: ({ value }) => <p className={styles['table__bold-text']}>{value}</p>,
      },
      {
        Header: lang['support_status'] ?? ' ',
        accessor: 'status',
        Cell: ({ value }) => (
          <ColoredText color={value ? 'green' : 'red'}>{value ? lang['support_status_open'] : lang['support_status_close']}</ColoredText>
        ),
      },
      {
        Header: lang['support_information'] ?? ' ',
        accessor: 'information',
        Cell: ({ value }) => (
          <HollowButton
            className={!value.status ? styles['hide-button'] : ''}
            type='link'
            to={'/support/information/' + value.id}
          >
            { lang['support_information'] }
          </HollowButton>
        ),
      },
    ],
    [lang]
  );

  const options = useMemo(
    () => [
      {value: 1, name: lang?.question},
      {value: 2, name: lang?.error},
      {value: 3, name: lang?.another},
    ],
    [lang]
  );


  const [subject, setSubject] = useState('')
  const [text, setText] = useState('')
  const [type, setType] = useState(options[0])

  const handlerBtn = async () => {
    try {
      let data = await setTicket(subject, text, type.value, language_id)
      await load_data()
      setSubject('')
      setText('')
      setType(options[0])
      alert(data.message)
    } catch (e) {
      alert(e.response.data.message)
    }
  }


  return (
    <div className={styles.body}>
      <h1 className={styles.title}>{ lang['support_title'] }</h1>
      <div className={styles.form}>
        <div className={styles.form__inputs}>
          <div className={styles['input-list']}>
            <Input
              className={styles.input}
              inputClassName={styles.input__input}
              label={lang?.subject}
              setInputValue={setSubject}
            />
            <Select selected_option={options[0]} onChange={setType} options={options} className={styles.input} placeholder={lang?.question} />
          </div>
          <Textarea onChange={setText} className={styles.textarea} placeholder={lang?.text} />
        </div>
        <ActionButton onClick={handlerBtn} className={styles.form__button}>{ lang['support_send'] }</ActionButton>
      </div>
      <Table
        className={styles['desktop-element--block']}
        columns={columns}
        data={tickets}
        rowClassName={styles.table__row}
      />
      <Card className={classNames(styles.requests, styles['mobile-element--block'])}>
        {tickets.map(({ date, topic, status, information, id }) => (
          <div className={styles['request-item']}>
            <p className={styles['request-item__date']}>{date}</p>
            <div className={styles['request-item__info']}>
              <p className={styles['table__bold-text']}>{topic}</p>
              <ColoredText color={status ? 'green' : 'red'}>
                {status ? lang['support_status_open'] : lang['support_status_close']}
              </ColoredText>
            </div>
            {information.status && (
              <HollowButton
                type='link'
                to={'/support/information/' + information.id}
                className={styles['request-item__button']}
              >
                { lang['support_information'] }
              </HollowButton>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
};
