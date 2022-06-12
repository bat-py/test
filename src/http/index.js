import axios from 'axios'

const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

const authInterceptor = confing => {
    confing.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return confing
}

$authHost.interceptors.request.use(authInterceptor)

export {
    $host,
    $authHost,
}