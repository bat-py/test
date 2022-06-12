import { $authHost, $host } from './index.js'
import jwt_decode from 'jwt-decode'

export const change_password = async (password_old, password_new, password_new_confirn) => {
    const {data} = await $authHost.post('api/user/change_password', {
        password_old, password_new, password_new_confirn
    })
    return data
}

export const sendConfirmEmail = async (language_id) => {
    const {data} = await $authHost.get('api/user/send_confirm_email?language_id=' + language_id)
    return data
}

export const confirmEmailUser = async (uid, language_id) => {
    const {data} = await $authHost.post('api/user/confirm_email_user', {
        uid, language_id
    })
    return data
}

export const restorePasswordData = async (password_new, password_new_confirn, language_id, uid) => {
    const {data} = await $host.post('api/user/restore_password_data', {
        password_new, password_new_confirn, language_id, uid
    })
    return data
}

export const checkPassRestore = async (uid, language_id) => {
    const {data} = await $host.post('api/user/check_pass_restore', {
        uid, language_id
    })
    return data
}


export const send_vip_request = async () => {
    const {data} = await $authHost.get('api/user/send_vip_request')
    return data
}

export const restorePassword = async (email, language_id) => {
    const {data} = await $host.post('api/user/restore_password', {
        email,
        language_id,
    })
    return data
}

export const get_user_file = async () => {
    const {data} = await $authHost.get('api/user/get_user_file')
    return data
}

export const upload_user_file = async (formData) => {
    const { data } = await $authHost.post('api/user/upload_user_file', formData, {
        headers: {
            'content-type': 'multipart/form-data'
        }
    })
    return data
}

export const register = async (email, name, password, confirm_password, language_id) => {

    const {data} = await $host.post('api/user/register', {
        email, name, password, confirm_password, language_id
    })

    localStorage.setItem('token',data.token)

    // Сохраняем в локальное хранилище логин и пароль
    // чтобы если он их изменит, мы могли его убрать
    localStorage.setItem('password',password)
    localStorage.setItem('email',email)

    return jwt_decode(data.token)
}

export const verify_data = async (first_name, last_name, email, middle_name, address) => {
    const {data} = await $authHost.post('api/user/verify_data', {
        first_name, last_name, email, middle_name, address
    })
    
    localStorage.setItem('token',data.token)

    // Сохраняем в локальное хранилище логин и пароль
    // чтобы если он их изменит, мы могли его убрать
    localStorage.setItem('email',email)

    return jwt_decode(data.token)
}

export const login = async (email,password) => {

    const {data} = await $host.post('api/user/login', {
        email, password
    })

    localStorage.setItem('token',data.token)

    // Сохраняем в локальное хранилище логин и пароль
    // чтобы если он их изменит, мы могли его убрать
    localStorage.setItem('password',password)
    localStorage.setItem('email',email)

    return jwt_decode(data.token)

}

export const checkIsAuth = async () => {

    // Добавляем в запрос сохраненные логин и пароль
    const email = localStorage.getItem('email')
    const password = localStorage.getItem('password')

    const { data } = await $authHost.post('api/user/auth')
    
    localStorage.setItem('token',data.token)
    
    return jwt_decode(data.token)

}

export const getUserList = async () => {
    const {data} = await $authHost.get('api/user/get_user_list')
    return data
}

export const getBalanceList = async () => {
    const {data} = await $authHost.get('api/user/get_balance_list')
    return data
}