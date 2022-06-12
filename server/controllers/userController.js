import dotenv from 'dotenv'
import ApiError from '../error/ApiError.js'
import bcrypt from 'bcryptjs'
import { BirLanguage, BirUser, BirUserBalance, BirUserFile, BirVipRequest } from '../models/models.js'
import jwt from 'jsonwebtoken'
import md5 from 'md5'
import validator from 'email-validator'
import { v4 } from 'uuid'
import { getLang, sendEmail } from '../helpers/tradeFunction.js'

dotenv.config()


const generateJWT = (user) => {

    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            is_vip: user.is_vip,
            is_confirmed: user.is_confirmed,
            first_name: user.first_name,
            middle_name: user.middle_name,
            last_name: user.last_name,
            address: user.address,
            verified: user.verified,
        },
        process.env.SECRET_KEY_JWT,
        { expiresIn: '24h' }
    )

}

class userController {

    async restorePassword(req,res,next) {
  
        let email = req.body.email
        let language_id = req.body.language_id

        let language = await BirLanguage.findOne({
            where: {id: language_id}
        })
        let array_lang = getLang(language.file)
        
        const user = await BirUser.findOne({where: {email: email}})

        if (!user) {
            return next(ApiError.badRequest(array_lang['restore_password_error_1']))
        }

        if (user.status_id != 0) {
            return next(ApiError.badRequest(array_lang['account_blocked']))
        } 

        if (user.is_deleted == 1) {
            return next(ApiError.badRequest(array_lang['account_deleted']))
        } 

        let uniqid = v4()
        user.pass_restore = uniqid
        user.pass_restore_date = Date.now()
        await user.save()

        sendEmail(email, array_lang["restore_email_subject"], '<p>' + array_lang["restore_text_email_1"] + '</p><p><a href="https://crossceed.com/restore-password-create/'+uniqid+'">' + array_lang["restore_text_email_2"] + '</a></p>', language_id)

        return res.json({
            message: array_lang['restore_password_success']
        })
    }


    async confirmEmailUser(req,res,next) {
        
        let language_id = req.body.language_id
        let uid = req.body.uid

        let language = await BirLanguage.findOne({
            where: {id: language_id}
        })
        let array_lang = getLang(language.file)

        const user = await BirUser.findOne({where: {register_uid: uid}})
        if (user) {
            user.register_uid = ''
            user.is_confirmed = 1
            user.save()
            return res.json({error: false})
        } else {
            return res.json({error: true})
        }

    }

    async checkPassRestore(req,res,next) {

        let uid = req.body.uid
        let language_id = req.body.language_id

        let language = await BirLanguage.findOne({
            where: {id: language_id}
        })
        let array_lang = getLang(language.file)

        const user = await BirUser.findOne({where: {pass_restore: uid}})

        if (!user) {
            return res.json({error: true, message: array_lang['restore_password_link_not_work']})
        }

        let pass_restore_date = user.pass_restore_date

        let date_diff = ( Date.now() - Date.parse(pass_restore_date) ) / 1000;
        let hour_diff = Math.ceil(date_diff / 3600)

        if (hour_diff > 24) {
            return res.json({error: true, message: array_lang['restore_password_link_not_work']})
        }

        return res.json({error: false})

    }

    async restorePasswordData(req,res,next) {

        let password_new = req.body.password_new
        let password_new_confirn = req.body.password_new_confirn
        let language_id = req.body.language_id
        let uid = req.body.uid

        let language = await BirLanguage.findOne({
            where: {id: language_id}
        })
        let array_lang = getLang(language.file)

        const user = await BirUser.findOne({where: {pass_restore: uid}})

        if (!user) {
            return next(ApiError.badRequest(array_lang['restore_password_link_not_work']))
        }

        let pass_restore_date = user.pass_restore_date

        let date_diff = ( Date.now() - Date.parse(pass_restore_date) ) / 1000;
        let hour_diff = Math.ceil(date_diff / 3600)

        if (hour_diff > 24) {
            return next(ApiError.badRequest(array_lang['restore_password_link_not_work']))
        }

        if (password_new != password_new_confirn) {
            return next(ApiError.badRequest(array_lang['password_match']))
        }

        if (password_new.length <= 5) {
            return next(ApiError.badRequest(array_lang['restore_pass_too_small']))
        }

        let secretPassword = md5(password_new + process.env.PASSWORD_SECRET)

        console.log(user)

        user.pass = secretPassword
        user.password = secretPassword
        user.pass_restore_date = null
        user.pass_restore = ''
        await user.save()

        return res.json({
            message: array_lang['restore_password_success_data']
        })
    }

    async changePassword(req,res,next) {
  
        let password_old = req.body.password_old
        let password_new = req.body.password_new
        let password_new_confirn = req.body.password_new_confirn

        let secretPassword = md5(password_old + process.env.PASSWORD_SECRET)
        let secretPasswordMew = md5(password_new + process.env.PASSWORD_SECRET)

        const user = await BirUser.findOne({where: {id: req.user.id, password: secretPassword}})
        if (!user) {
            return next(ApiError.badRequest('Вы ввели неверный текущий пароль!'))
        }

        if (password_new != password_new_confirn) {
            return next(ApiError.badRequest('Пароли не совпадают'))
        }

        if (password_new.length <= 5) {
            return next(ApiError.badRequest('Пароль должен быть больше 5 символов'))
        }

        user.pass = secretPasswordMew
        user.password = secretPasswordMew
        await user.save()

        return res.json({
            message: 'Пароль успешно изменен!'
        })
    }

    async sendVipRequest(req,res,next) {
        let bir_vip_request = await BirVipRequest.findOne({
            where: {
                user_id: req.user.id,
            }
        })

        if (bir_vip_request) {
            if (bir_vip_request.status_id == 0) {   
                return res.json({message: 'Заявка на VIP уже подана. Она находится на стадии рассмотрения!'})
            } else if (bir_vip_request.status_id == 1) {
                return res.json({message: 'Заявка на VIP уже одобрена'})
            } else if (bir_vip_request.status_id == 2) {
                return res.json({message: 'В заявке на VIP ОТКАЗАНО'})
            } 
        } else {
            await BirVipRequest.create({
                user_id: req.user.id,
                status_id: 0
            })
            return res.json({message: 'Заявка на VIP подана!'})
        }
    }

    async getUserFile(req,res,next) {

        let user_file = await BirUserFile.findAll({
            where: {
                user_id: req.user.id
            }
        })

        return res.json(user_file)

    }

    // https://attacomsian.com/blog/uploading-files-nodejs-express
    // Как загружать файлы Node js
    async uploadUserFile(req,res,next) {

        if(!req.files) {
            return next(ApiError.badRequest('Не добавлены файлы для загрузки'))
        } else {

            let user_file = await BirUserFile.findOne({
                where: {
                    user_id: req.user.id
                }
            })

            let ob_creator = {
                user_id: req.user.id,
                status_id: 0
            }

            if (req.files.file_1) {
                let file_1 = req.files.file_1;
                let filename_1 = v4() + "." + file_1.name.split('.').pop()
                file_1.mv('./uploads/documents/' + filename_1);
                if (user_file) {
                    user_file.file_1 = filename_1
                    user_file.name_1 = filename_1
                } else {
                    ob_creator.file_1 = filename_1
                    ob_creator.name_1 = filename_1
                }
            }

            if (req.files.file_2) {
                let file_2 = req.files.file_2;
                let filename_2 = v4() + "." + file_2.name.split('.').pop()
                file_2.mv('./uploads/documents/' + filename_2);
                if (user_file) {
                    user_file.file_2 = filename_2
                    user_file.name_2 = filename_2
                } else {
                    ob_creator.file_2 = filename_2
                    ob_creator.name_2 = filename_2
                }
            }

            console.log(req.files)

            if (user_file) {
                await user_file.save()
            } else {
                await BirUserFile.create(ob_creator)
            }

            //send response
            res.send({
                status: true,
                message: 'Файлы загружены',
            });
        }
    }

    async verifyData(req,res,next) {

        let first_name = req.body.first_name
        let last_name = req.body.last_name
        let email = req.body.email
        let middle_name = req.body.middle_name
        let address = req.body.address

        if (first_name && first_name.length == 0) {
            return next(ApiError.badRequest('Необходимо заполнить Имя'))
        }

        if (!validator.validate(email)) {
            return next(ApiError.badRequest('Неверный Email'))
        }

        if (email != req.user.email) {

            let user_email = await BirUser.findAll({
                where: {
                    email: email
                }
            })

            if (user_email.length > 0) {
                return next(ApiError.badRequest('Пользователь с таким Email уже зарегистрирован'))
            }

        }

        let user = await BirUser.findOne({
            where: {
                id: req.user.id
            }
        })

        user.email = email
        user.first_name = first_name
        user.last_name = last_name
        user.middle_name = middle_name
        user.address = address
        user.save()

        let user_file = await BirUserFile.findAll({
            where: {
                user_id: user.id,
                status_id: 1
            }
        })

        const token = generateJWT({
            id: user.id,
            email: user.email,
            is_vip: user.is_vip,
            is_confirmed: user.is_confirmed,
            first_name: user.first_name,
            middle_name: user.middle_name,
            last_name: user.last_name,
            address: user.address,
            verified: user_file.length > 0 ? 1 : 0,
        });

        return res.json({token: token})

    }

    async register(req,res,next) {

        let email = req.body.email
        let name = req.body.name
        let password = req.body.password
        let confirm_password = req.body.confirm_password
        let language_id = req.body.language_id

        let lang = await BirLanguage.findOne({
            where: {
                id: language_id
            }
        })
        let count_code = 'en'
        if (lang) {
            count_code = lang.file
        }

        if (password != confirm_password) {
            return next(ApiError.badRequest('Пароли не совпадают'))
        }

        if (password.length <= 5) {
            return next(ApiError.badRequest('Пароль должен быть больше 5 символов'))
        }

        if (name.length <= 1) {
            return next(ApiError.badRequest('Введите имя'))
        }

        if (!validator.validate(email)) {
            return next(ApiError.badRequest('Неверный Email'))
        }

        let user_email = await BirUser.findAll({
            where: {
                email: email
            }
        })

        if (user_email.length > 0) {
            return next(ApiError.badRequest('Пользователь с таким Email уже зарегистрирован'))
        }

        let secretPassword = md5(password + process.env.PASSWORD_SECRET)

        let uid = v4()

        let user = await BirUser.create({
            email: email,
            password: secretPassword,
            created_on: Date.now(),
            status_id: 0,
            is_confirmed: 0,
            is_vip: 0,
            is_deleted: 0,
            chief_referral: 0,
            referral_id: 0,
            referral_branch: 0,
            first_name: name,
            middle_name: null,
            last_name: null,
            country_id: null,
            address: null,
            pass: secretPassword,
            last_fail: null,
            count_fail: null,
            login_code: null,
            register_code: null,
            newsletter: 1,
            count_code: count_code,
            token: '',
            register_uid: uid,
        })

        if (!user) {
            return next(ApiError.badRequest('Что-то пошло не так, попробуйте позже!'))
        }

        let subject = array_lang['dear'] + ' ' + user.first_name ?? '' + " " + user.last_name ?? ''
        subject = subject.trim()

        let body = "<p>" + array_lang['registration_email_body'] + "</p>"
        body += "<p><a href='https://crossceed.com/confirm-email/" + uid + "'>" + array_lang['registration_email_body_link_text'] + "</a></p>"

        sendEmail(user.email, subject, body)

        const token = generateJWT({
            id: user.id,
            email: user.email,
            is_vip: user.is_vip,
            is_confirmed: user.is_confirmed,
            first_name: user.first_name,
            middle_name: user.middle_name,
            last_name: user.last_name,
            address: user.address,
            verified: 0,
        });

        return res.json({token: token})


    }

    async sendConfirmEmail(req,res,next) {

        let language_id = req.query.language_id
        let language = await BirLanguage.findOne({
            where: {id: language_id}
        })
        let array_lang = getLang(language.file)

        let user = await BirUser.findOne({
            where: {
                id: req.user.id
            }
        })
        if (user) {

            let uid = v4()
            user.register_uid = uid
            user.save()

            let subject = array_lang['dear'] + ' ' + user.first_name ?? '' + " " + user.last_name ?? ''
            subject = subject.trim()

            let body = "<p>" + array_lang['registration_email_body_confirm'] + "</p>"
            body += "<p><a href='https://crossceed.com/confirm-email/" + uid + "'>" + array_lang['registration_email_body_link_text'] + "</a></p>"

            sendEmail(user.email, subject, body)

            return res.json({error: false, message: array_lang['registration_email_confirm_sended']})
            
        }

        return res.json({error: true, message: "Error!"})
    }

    
    async getBalanceList(req,res,next) {

        let user_id = req.user.id

        let balance_list = {}

        let data = await BirUserBalance.findAll({
            where: {
                user_id: user_id
            }
        })

        data.map( item => {
            let currency_id = item.currency_id
            balance_list[currency_id] = item.value
        })

        return res.json(balance_list)
    }

    async login(req,res,next) {

        const { email, password } = req.body;

        if (!email || !password) {
            return next(ApiError.badRequest('Нужно ввести email и пароль!'))
        }

        let secretPassword = md5(password + process.env.PASSWORD_SECRET)

        const user = await BirUser.findOne({where: {email: email, password: secretPassword}})

        if (!user) {
            return next(ApiError.badRequest('Неверный email или пароль!'))
        }

        let user_file = await BirUserFile.findAll({
            where: {
                user_id: user.id,
                status_id: 1
            }
        })

        const token = generateJWT({
            id: user.id,
            email: user.email,
            is_vip: user.is_vip,
            is_confirmed: user.is_confirmed,
            first_name: user.first_name,
            middle_name: user.middle_name,
            last_name: user.last_name,
            address: user.address,
            verified: user_file.length > 0 ? 1 : 0,
        });

        return res.json({token: token})

    }
    
    async auth(req,res) {

        let user_file = await BirUserFile.findAll({
            where: {
                user_id: req.user.id,
                status_id: 1
            }
        })

        let is_confirmed = req.user.is_confirmed

        if (req.user.is_confirmed == 0) {
            let bir_user = await BirUser.findOne({
                where: {
                    id: req.user.id
                }
            })
            if (bir_user) {
                is_confirmed = bir_user.is_confirmed
            }
        }

        const token = generateJWT({
            id: req.user.id,
            email: req.user.email,
            is_vip: req.user.is_vip,
            is_confirmed: is_confirmed,
            first_name: req.user.first_name,
            middle_name: req.user.middle_name,
            last_name: req.user.last_name,
            address: req.user.address,
            verified: user_file.length > 0 ? 1 : 0,
        });
        return res.json({token: token})
    }

    async getUserList(req,res) {
        const user = await BirUser.findAll()
        return res.json(user)
    }

}

export default new userController()