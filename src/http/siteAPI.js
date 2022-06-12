import { $authHost, $host } from './index.js'
import jwt_decode from 'jwt-decode'

export const setTicket = async (subject, text, type, language_id) => {
    const {data} = await $authHost.post('api/site/set_ticket', {
        subject, text, type, language_id
    })
    return data
}

export const setCommentTicket = async (id, comment, language_id) => {
    const {data} = await $authHost.post('api/site/set_comment_ticket', {
        id, comment, language_id
    })
    return data
}

export const setWithdrawal = async (amount, address, currency_id, language_id) => {
    const {data} = await $authHost.post('api/site/set_withdrawal', {
        amount, address, currency_id, language_id
    })
    return data
}

export const getTicket = async (id) => {
    const {data} = await $authHost.get('api/site/get_ticket?id=' + id)
    return data
}

export const closeTicket = async (id, language_id) => {
    const {data} = await $authHost.get('api/site/close_ticket?id=' + id + '&language_id=' + language_id)
    return data
}

export const getTickets = async () => {
    const {data} = await $authHost.get('api/site/get_tickets')
    return data
}

export const getCommnets = async (ticket_id) => {
    const {data} = await $authHost.get('api/site/get_comments?ticket_id='+ticket_id)
    return data
}

export const getOperation = async (address, language_id) => {
    const {data} = await $authHost.get('api/site/get_operation?address='+address+'&language_id='+language_id)
    return data
}

export const getTranslation = async (lang) => {
    const {data} = await $host.get('api/site/get_translation?lang='+lang)
    return data.lang
}

export const getCourseBinance = async () => {
    const {data} = await $host.get('api/site/get_course_binance')
    return data
}

export const refill = async (currency_id, amount, uid, language_id) => {
    const {data} = await $authHost.post('api/site/refill', {
        currency_id, amount, uid, language_id
    })
    return data
}

export const getHistoryPayment = async (lang) => {
    const {data} = await $authHost.post('api/site/get_history_payment',{
        lang: lang
    })
    return data
}

export const getPage = async (slug, language_id) => {
    const {data} = await $host.get('api/site/get_page?slug='+slug+'&language_id='+language_id);
    return data   
}

export const getNews = async (language_id) => {
    const {data} = await $host.get('api/site/get_news?language_id='+language_id);
    return data   
}

export const getNewsItem = async (id) => {
    const {data} = await $host.get('api/site/get_news_item?id='+id);
    return data   
}