import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { BirUser } from '../models/models.js'

export default (req,res,next) => {

    dotenv.config()

    if (req.method == "OPTION") {
        next()
    }

    try {

        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({message: 'Пользователь не авторизован'})
        } else {
            const decoded_token = jwt.verify(token,process.env.SECRET_KEY_JWT)
            req.user = decoded_token
            next()
        }
    } catch(e) {
        res.status(401).json({message: 'Пользователь не авторизован'})
    }

}