import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getTicket, closeTicket, setCommentTicket, getCommnets } from '../../http/siteAPI';

import {
  Card,
  Table,
  ColoredText,
  HollowButton,
  ActionButton,
  Input,
} from '../../ui-kit/components';

import styles from './Information.module.scss';

export const Information = () => {

  const { id } = useParams()
  const [ticket,setTicket] = useState([])
  const [comment,setComment] = useState('')
  const [comments, setComments] = useState([])
  const language_id = useSelector((state) => state.site.language_id)
  const lang = useSelector((state) => state.site.lang)

  const load_data = async () => {

    let data = await getTicket(id)
    setTicket(data)
    
    data = await getCommnets(id)
    setComments(data)

  }

  const closeTicketHandler = async () => {
    let data = await closeTicket(id, language_id)
    load_data()
    alert(data.message)
  }

  const addCommentHandler = async () => {
    try {
      let data = await setCommentTicket(id, comment, language_id)
      await load_data()
      setComment('')
    } catch (e) {
      alert(e.response.data.message)
    }
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
        Header: lang['support_subject'] ?? ' ',
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
        Header: '',
        accessor: 'information',
        Cell: ({ value }) => {
          if (value.status) {
            return (
              <HollowButton className={!value ? styles['hide-button'] : ''} onClick={closeTicketHandler}>
                Закрыть Тикет
              </HollowButton>
            )
          }
        },
      },
    ],
    [ lang ]
  );

  
  return (
    <div className={styles.body}>
      <h1 className={styles.title}>{ lang['support_information'] }</h1>
      <Card className={styles.card}>
        {/* Desktop only element  */}
        <Table
          className={classNames(styles.table, styles['desktop-element--block'])}
          columns={columns}
          data={ticket}
          rowClassName={styles.table__row}
        />
        {/* Desktop only element  */}

        {/* Mobile only element  */}
        <div className={classNames(styles.requests, styles['mobile-element--block'])}>
          {ticket.map(({ date, topic, status, information }) => (
            <div className={styles['request-item']}>
              <p className={styles['request-item__date']}>{date}</p>
              <div className={styles['request-item__info']}>
                <p className={styles['table__bold-text']}>{topic}</p>
                <ColoredText color={status ? 'green' : 'red'}>
                  {status ? lang['support_status_open'] : lang['support_status_close']}
                </ColoredText>
              </div>
              {information && (
                <HollowButton
                  type='link'
                  to='/support/information'
                  className={styles['request-item__button']}
                >
                  { lang['support_information'] }
                </HollowButton>
              )}
            </div>
          ))}
        </div>
        {/* Mobile only element  */}
        
        <div className={styles.comments}>
          {comments.map((item) => {
            return (
              <>
                {item.user_id > 0 ?
                <div className={styles['comments__item']}>
                  <div className={styles['comments__item-date']}>{ item.user_name } { item.date }</div>
                  <div className={styles['comments__item-comment']}>{ item.comment }</div>
                </div>
                :
                <div className={styles['comments__item-admin']}>
                  <div className={styles['comments__item-admin-date']}>{ item.user_name } { item.date }</div>
                  <div className={styles['comments__item-admin-comment']}>{ item.comment }</div>
                </div>
                }
              </>
            )
          })}
        </div>

        <div className={styles.form}>
          <Input
            className={styles.form__input}
            inputClassName={styles.input}
            label={ lang['support_add_comment'] }
            setInputValue={setComment}
            defvalue={comment}
          />
          <ActionButton onClick={addCommentHandler} className={styles.form__button}>{ lang['support_add_comment_text_button'] }</ActionButton>
        </div>
      </Card>
    </div>
  );
};
