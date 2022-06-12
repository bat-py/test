import dotenv from 'dotenv'
import ApiError from '../error/ApiError.js'
import { BirAutotrade, BirBalanceHistory, BirCurrency, BirLanguage, BirMarket, BirMarketCourse, BirNews, BirPage, BirPageTranslate, BirPayment, BirRefill, BirSettings, BirTicket, BirTicketComment, BirUser, BirUserBalance, BirUserFile } from '../models/models.js'
import { getLang, sendEmail, writeHistory } from '../helpers/tradeFunction.js'
import PayKassaSCI from '../modules/paykassa/PayKassaSCI.js'
import PayKassaApi from '../modules/paykassa/PayKassaApi.js'
import LocalKassaApi from '../modules/localkassa/LocalKassaApi.js'
import rp from 'request-promise'
import moment from 'moment'
import { Op } from 'sequelize'

dotenv.config()

class siteController {

    async getCommnets(req,res,next) {
        
        let ticket_id = req.query.ticket_id
        let user_id = req.user.id

        let ticket = await BirTicket.findOne({
            where: {
                user_id: user_id,
                id: ticket_id
            },
            order: [
                ['created_on', 'DESC'],
            ]
        })

        if (ticket) {

            let arr = []

            let comments = await BirTicketComment.findAll({
                where: {
                    ticket_id: ticket_id,
                }
            })

            for (const item of comments) {

                let user_name = ''

                if(item.user_id > 0) {
                    let user_data = await BirUser.findOne({
                        where: {
                            id: item.user_id
                        }
                    })
                    if (user_data) {
                        user_name = user_data.first_name
                    }
                }

                arr.push({
                    user_name: user_name,
                    user_id: item.user_id,
                    comment: item.comment,
                    created_on: item.created_on,
                    date: moment(new Date(item.created_on)).format('DD/MM/YYYY HH:mm'),
                })

            }

            return res.json(arr)

        } else {

            return next(ApiError.badRequest('Error'))

        }

    } 


    async setCommentTicket(req,res,next) {
        let id = req.body.id
        let comment = req.body.comment
        let language_id = req.body.language_id
        let user_id = req.user.id

        let language = await BirLanguage.findOne({
            where: {id: language_id}
        })
        let array_lang = getLang(language.file)

        if (comment.length === 0) {
            return next(ApiError.badRequest(array_lang['wrong_text']))
        }

        let ticket = await BirTicket.findOne({
            where: {
                user_id: user_id,
                id: id
            }
        })

        if (ticket) {

            await BirTicketComment.create({
                ticket_id: id,
                user_id: user_id,
                comment: comment,
                readed: 1,
                readed_admin: 0,
            })

            return res.json({
                message: array_lang['ticket_comment_added']
            })

        } else {
            return next(ApiError.badRequest('Error'))
        }
    
    }

    async setTicket(req,res,next) {
        
        let subject = req.body.subject
        let language_id = req.body.language_id
        let text = req.body.text
        let type = req.body.type

        let language = await BirLanguage.findOne({
            where: {id: language_id}
        })
        let array_lang = getLang(language.file)

        if (subject.length === 0) {
            return next(ApiError.badRequest(array_lang['wrong_subject']))
        }

        if (text.length === 0) {
            return next(ApiError.badRequest(array_lang['wrong_text']))
        }

        await BirTicket.create({
            user_id: req.user.id,
            subject: subject,
            text: text,
            type: type,
            status_id: 0,
            readed_admin: 0,
        })

        return res.json({message: array_lang['success_support_send']})

    }

    async closeTicket(req,res,next) {

        let id = req.query.id
        let language_id = req.query.language_id
        let user_id = req.user.id

        let language = await BirLanguage.findOne({
            where: {id: language_id}
        })
        let array_lang = getLang(language.file)

        let ticket = await BirTicket.findOne({
            where: {
                user_id: user_id,
                id: id
            }
        })

        if (ticket) {

            ticket.status_id = 1

            await ticket.save()

            return res.json({
                message: array_lang['tecket_closed']
            })

        } else {

            return next(ApiError.badRequest('Error'))

        }

    }
    
    async getTicket(req,res,next) {
        let id = req.query.id
        let user_id = req.user.id

        let ticket = await BirTicket.findOne({
            where: {
                user_id: user_id,
                id: id
            }
        })

        if (ticket) {
            return res.json([{
                date: moment(new Date(ticket.created_on)).format('DD/MM/YYYY HH:mm'), 
                topic: ticket.subject, 
                status: ticket.status_id == 0 ? true : false, 
                information: {
                    status: ticket.status_id == 0 ? true : false,  
                    id: ticket.id
                },
            }])
        }

        return next(ApiError.badRequest('Error'))

    }

    async getTickets(req,res,next) {

        let user_id = req.user.id

        let tickets = await BirTicket.findAll({
            where: {
                user_id: user_id
            },
            order: [
                ['created_on', 'DESC'],
            ]
        })

        let arr = []
        tickets.map((item) => {
            arr.push({ 
                date: moment(new Date(item.created_on)).format('DD/MM/YYYY HH:mm'), 
                topic: item.subject, 
                status: item.status_id == 0 ? true : false, 
                information: {
                    status: true,
                    id: item.id
                },
                id: item.id,
            })
        })

        return res.json(arr)

    }

    async setWithdrawal(req,res,next) {
        let value = Number(req.body.amount)
        let currency_id = req.body.currency_id
        let wallet = req.body.address
        let language_id = req.body.language_id

        let user_id = req.user.id

        let currency = await BirCurrency.findOne({
            where: {
                id: currency_id
            }
        })

        let user = await BirUser.findOne({
            where: {
                id: user_id
            }
        })

        let language = await BirLanguage.findOne({
            where: {id: language_id}
        })
        let array_lang = getLang(language.file)

        if (value <= 0) {
            return next(ApiError.badRequest(array_lang['wrong_sum']))
        }

        if (wallet == '') {
            return next(ApiError.badRequest(array_lang['payment_destination']))
        }

        // Проверяем есть ли запущенные автотрейды
        let autotrade = await BirAutotrade.findAll({
            where: {
                user_id: user_id,
                status_id: 0
            }
        })
        if (autotrade.length > 0) {
            return next(ApiError.badRequest(array_lang['autotrade_block']))
        }

        let setting_list = {}
        let data_setting = await BirSettings.findAll()
        data_setting.map( item => {
            let id = item.id
            setting_list[id] = item.opt_value
        })

        let date = moment().format('YYYY-MM-DD')
        let startDt = date + " 00:00:00"
        let endDt = date + " 23:59:59"

        let payment = await BirPayment.findAll({
            where: {
                user_id: user_id,
                status_id: 1,
                created_on: {
                    [Op.gte]: startDt,
                    [Op.lte]: endDt,
                }
            }
        })
        if (payment.length > setting_list[30]) {
            return next(ApiError.badRequest(array_lang['limit_payout_at_day']))
        }

        let col_day_diff_mist = 0
        let refill = await BirRefill.findOne({
            where: {
                user_id: user_id,
                status_id: 1
            },
            order: [
                ['id', 'DESC'],
            ],
            limit: 1
        })

        if (refill) {
            let day_diff = (Date.now() - Date.parse(refill.created_on)) / 1000 / 3600 / 24
            if (day_diff < setting_list[31]) {
                col_day_diff_mist
            }
        }

        if (col_day_diff_mist == 1) {
            return next(ApiError.badRequest(array_lang['limit_payout_at_day'].replace('{x}',setting_list[31])))
        }


        // Проверка баланса
        let user_balance = await BirUserBalance.findOne({
            where: {
                user_id: user_id,
                currency_id: currency_id
            }
        })
        if (
            !user || 
            !user_balance || 
            !currency || 
            user_balance.value < value || 
            user.is_vip == 1 && (user_balance.value - value) < currency.vip_min_balance
        ) {
            return next(ApiError.badRequest(array_lang['enough_balance']))
        }

        if(
            !user ||
            user.is_vip == 0 && value < currency['min_payout'] ||
            user.is_vip == 1 && value < currency['vip_min_payout']
        ){
            return next(ApiError.badRequest(array_lang['minimum_error']))
        }

        let user_file = await BirUserFile.findOne({
            where: {
                user_id: user_id,
                status_id: 1
            }
        })

        if (!user_file && value > currency.max_payout) {
            return next(ApiError.badRequest(array_lang['maximum_error']))
        }
        
        // Переходим к процессу вывода
        let code_gen = Math.random() * (999 - 100) + 100
        if(setting_list[32] == '1') {
			code_gen = 0;
		}

        let balance_history_id = await writeHistory(user_id, value * (-1), currency_id, 40)
        let bp = await BirPayment.create({
            user_id: user_id,
            currency_id: currency_id,
            value: value,
            wallet: wallet,
            optional_id: 0,
            commission: currency.commission_payout,
            status_id: 0, 
            code_gen: code_gen,
            balance_history_id: balance_history_id
        })

        let text = encodeURI('Вывод ' + value + ' ' + currency.symbol + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' - ' + user.email)
        let resdata = await rp('https://api.telegram.org/bot' + process.env.TG_TOKEN + '/sendMessage?chat_id=' + process.env.TG_CHAT_ID + '&text=' + text)
        console.log(resdata)

        let msg = ''
        if (setting_list[32] == '1' || true) {
            sendEmail(user['email'], array_lang['dear'] + ' ' + user['first_name'] + ' ' + user['last_name'], '<p style="margin:0;">' + array_lang['payment_order'] + ' ' + array_lang['sum'] + ' ' + value + ' <p style="margin:0;">' + array_lang['detailed_history'] + '</p>', language_id)
            msg  = array_lang['manual_payout_wait']
        } else {
            sendEmail(user['email'], array_lang['dear'] + ' ' + user['first_name'] + ' ' + user['last_name'], '<p style="margin:0;">' + array_lang['payment_order'] + ' ' + array_lang['sum'] + ' ' + value + ' ' + array_lang['your_code_2'] + ':' + code_gen + '<p style="margin:0;">' + array_lang['detailed_history'] + '</p>', language_id)
            msg  = array_lang['email_code_2']
        }

        return res.json({message: msg})

    }

    async getOperation(req,res,next) {

        let copyhtml = '&nbsp;&nbsp;<svg class="bi bi-clipboard" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 1.5H3a2 2 0 00-2 2V14a2 2 0 002 2h10a2 2 0 002-2V3.5a2 2 0 00-2-2h-1v1h1a1 1 0 011 1V14a1 1 0 01-1 1H3a1 1 0 01-1-1V3.5a1 1 0 011-1h1v-1z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M9.5 1h-3a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5zm-3-1A1.5 1.5 0 005 1.5v1A1.5 1.5 0 006.5 4h3A1.5 1.5 0 0011 2.5v-1A1.5 1.5 0 009.5 0h-3z" clip-rule="evenodd"/></svg>'

        let address = req.query.address
        let language_id = req.query.language_id

        let language = await BirLanguage.findOne({
            where: {id: language_id}
        })
        let array_lang = getLang(language.file)

        let refill = await BirRefill.findOne({
            where: {
                billing_wallet: address
            }
        })

        if (!refill) {
            return next(ApiError.badRequest('Ошибка адреса!'))
        }

        let currency = await BirCurrency.findOne({
            where: {id: refill.currency_id}
        })
        if (!currency) {
            // TODO
            return next(ApiError.badRequest('Ошибка выбора валюты'))
        }

        let value = refill.value

        let msg = '<p>' + array_lang['balance_send'] + ' <span style="color: rgb(0,192,90);">' + value + ' ' + currency.symbol + '</span> ' + array_lang['balance_to_this_address'] + ':<br/><br/><b class="to_copy" style="font-weight: 600; color: rgb(0,192,90);">' + address + '</b>' + '</p>';
        let msg_balance = '<p>' + array_lang['balance_will_update_automatically'] + '</p>'
        res.json({
            msg: msg,
            msg_balance: msg_balance,
            copyhtml: copyhtml,
            balance_send: array_lang['balance_send'],
            value: value,
            symbol: currency.symbol,
            balance_to_this_address: array_lang['balance_to_this_address'],
        })
    }

    async refill(req,res,next) {

        let user_id = req.user.id

        let currency_id = req.body.currency_id
        let uid = req.body.uid
        let language_id = req.body.language_id
        let value = Number(req.body.amount)

        let language = await BirLanguage.findOne({
            where: {id: language_id}
        })
        let array_lang = getLang(language.file)

        if (!value || value <= 0) {
            return next(ApiError.badRequest(array_lang['wrong_sum']))
        }

        // Проверка что сумма больше минимальной для валюты
        let currency = await BirCurrency.findOne({
            where: {id: currency_id}
        })
        if (!currency) {
            // TODO
            return next(ApiError.badRequest('Ошибка выбора валюты'))
        }
        if (value < currency.min_refill) {
            return next(ApiError.badRequest(array_lang['minimum_refill']))
        }

        let refill = await BirRefill.create({
            user_id: user_id,
            currency_id: currency_id,
            value: value,
            uid: uid,
            status_id: 0
        })

        let operation_id = refill.id
        
        let currncy_list = {
            '1': {'name': 'bitcoin', 'symbol': 'BTC', 'system': 11},
            '3': {'name': 'ethereum', 'symbol': 'ETH', 'system': 12},
            '4': {'name': 'litecoin', 'symbol': 'LTC', 'system': 14},
            '5': {'name': 'bitcoincash', 'symbol': 'BCH', 'system': 18},
            '7': {'name': 'tron', 'symbol': 'TRX', 'system': 27},
            '8': {'name': 'ripple', 'symbol': 'XRP', 'system': 22},
            '9': {'name': 'dash', 'symbol': 'DASH', 'system': 16},
            '10': {'name': 'ethereumclassic', 'symbol': 'ETC', 'system': 21},
        }
    
        let currency_list_localkassa = {
            '1': 'bitcoin',
            '4': 'litecoin',
            '5': 'bitcoincash',
            '9': 'dash'
        }

        if (currency_list_localkassa[currency_id]) {

            let localkassa = new LocalKassaApi(process.env.LOCALKASSA_TOKEN)

            localkassa.sendRequest('createpayment', {
                order_id: operation_id,
                amount: value, 
                currency: currency_list_localkassa[currency_id]
            }, async (result) => {
                if (!result.error) {

                    try {
                        
                        let balance_history_id = await writeHistory(user_id, value, currency_id, 222)

                        refill.billing_id = result.payment_id
                        refill.billing_wallet = result.address
                        refill.billing_tag = ''
                        refill.balance_history_id = balance_history_id
                        await refill.save()

                        return res.json({address: result.address})

                    } catch (e) {
                        
                        return next(ApiError.badRequest('Неизвестная ошибка, попробуйте снова пополнить.'))

                    }

                }
                
            })

        } else {

            // PAYKASSA

            let amount = Number(value)
            let system = currncy_list[currency_id]['system']
            let currency = currncy_list[currency_id]['symbol']
            let order_id = operation_id
            let comment = 'Пополнение счета'

            let paykassa = new PayKassaSCI(process.env.PAYKASSA_CSI_ID, process.env.PAYKASSA_CSI_KEY)
            paykassa.sendRequest('sci_create_order_get_data', {
                order_id: order_id,
                amount: amount,
                currency: currency,
                system: system,
                comment: comment,
                phone: false,
                paid_commission: 'shop',
            }, async (result) => {

                if (!result.error) {

                    try {
                        
                        let balance_history_id = await writeHistory(user_id, value, currency_id, 222)

                        refill.billing_id = result.data.invoice
                        refill.billing_wallet = result.data.wallet
                        refill.billing_tag = ''
                        refill.balance_history_id = balance_history_id
                        await refill.save()

                        return res.json({address: result.data.wallet})

                    } catch (e) {
                        
                        return next(ApiError.badRequest("Неизвестная ошибка"))

                    }

                } else {

                    return next(ApiError.badRequest(result.message))
                    
                }

            })  

        }

    }

    async getCourseBinance(req,res,next) {

        let courseArray = {}

        let market = await BirMarket.findAll({
            where: {
                name: 'binance'
            }
        })
        for (const item of market) {

            let market_id = item.id
            let currency_id = item.currency_id

            let market_course = await BirMarketCourse.findOne({
                where: {
                    market_id: market_id
                }
            })

            courseArray[currency_id] = market_course?.buy_value
        }

        return res.json(courseArray)
    }

    async getPaykassaBalance(req,res,next) {
        // https://habr.com/ru/post/351550/
        var paykassa = new PayKassaApi({ 
            api_id: process.env.PAYKASSA_API_ID, 
            api_key: process.env.PAYKASSA_API_KEY, 
        })

        paykassa.sendRequest('api_get_shop_balance', {
            shop: process.env.PAYKASSA_API_SHOP
        }, function (result) {
            console.log(2)
            return res.json(result)
        })

    }

    async getPage(req,res,next) {
        let slug = req.query.slug
        let language_id = req.query.language_id
        let page = await BirPage.findOne({
            where: {
                slug: slug
            }
        })

        if (!page) {
            return next(ApiError.badRequest('Такой страницы нет'))
        }

        let page_translate = await BirPageTranslate.findOne({
            where: {
                page_id: page.id,
                language_id: language_id,
            }
        })

        if (!page_translate) {
            return next(ApiError.badRequest('Отсутсвует перевод для этой страницы'))
        }

        res.json(page_translate)
    }


    async getNewsItem(req,res,next) {
        let id = req.query.id
        let news = await BirNews.findOne({
            where: {
                id: id
            }
        })
        res.json(news)
    }
    
    async getNews(req,res,next) {
        let language_id = req.query.language_id
        let news = await BirNews.findAll({
            where: {
                language_id: language_id
            }
        })
        res.json(news)
    }

    async getTranslation(req,res,next) {

        let lang = req.query.lang
        let array_lang = getLang(lang)

        res.json({
            lang: array_lang
        })
        
    }

    async getHistoryPayment(req,res,next) {
        
        let user_id = req.user.id
        let lang = req.body.lang ?? 'ru'
        let page = req.body.page ?? 1
        let currency_id = req.body.currency_id

        let array_lang = getLang(lang)

        let limit = 30
	    let offset = limit * (page - 1)

        let balance_history = await BirBalanceHistory.findAll({
            where: { user_id: user_id }
        })

        let col_history = balance_history.length

        let array_history = []
        balance_history = await BirBalanceHistory.findAll({
            where: { user_id: user_id },
            limit: limit,
            offset: offset,
            order: [
                ['id', 'DESC'],
            ],
        })

        for (const h of balance_history) {
            let one_history = {}
            one_history.id = h.id;
            one_history.value = h.value;
            one_history.created_on = h.created_on;
            let operation_id = h['operation_id']

            let op_text = ""; 

            if (operation_id == 1) op_text = array_lang['history_payment_o1'];
            if (operation_id == 2) op_text = array_lang['history_payment_o2'];
            if (operation_id == 222) op_text = array_lang['history_payment_o2'];
            if (operation_id == 4) op_text = array_lang['history_payment_o4'];
            if (operation_id == 5) op_text = array_lang['history_payment_o5'];
            if (operation_id == 8) op_text = array_lang['history_payment_o8'];
            if (operation_id == 10) op_text = array_lang['history_payment_o10'];
            if (operation_id == 7) op_text = array_lang['history_payment_o7'];
            if (operation_id == 22) op_text = array_lang['history_payment_o22'];
            if (operation_id == 11) op_text = array_lang['history_payment_o11'];
            if (operation_id == 15) op_text = array_lang['history_payment_o15'];
            if (operation_id == 23) op_text = array_lang['history_payment_o23'];
            if (operation_id == 24) op_text = array_lang['history_payment_o24'];
            if (operation_id == 30) op_text = array_lang['history_payment_o30'];
            if (operation_id == 31) op_text = array_lang['history_payment_o31'];
            if (operation_id == 40) op_text = array_lang['history_payment_o4'];
            if (operation_id == 24) {
                let bir_refill = await BirRefill.findOne({
                    where: {
                        balance_history_id: h['id']
                    }
                })

                if (bir_refill) {
                    one_history['confirmations'] = bir_refill['confirmations'];
                    one_history['required_confirmations'] = bir_refill['required_confirmations'];
                }
            }

            if (operation_id == 4) {
                let payment = await BirPayment.findOne({
                    where: {
                        balance_history_id: h['id']
                    }
                })

                if (payment) {
                    one_history['link'] = payment['link'];
                }
            }

            one_history['op_text'] = op_text;
            one_history['operation_id'] = operation_id;

            let currency = await BirCurrency.findOne({
                where: {
                    id: h['currency_id']
                }
            })

            one_history['symbol'] = currency['symbol'];

            array_history.push(one_history)

        }

        return res.json({
            array_history: array_history,
            col_history: col_history,
        })

    }

}

export default new siteController()