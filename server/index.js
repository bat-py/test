import dotenv from 'dotenv'
import express, { json } from 'express'
import router from './routes/index.js'
import cors from 'cors'
import errorHandler from './middleware/ErrorHandlingMiddleware.js'
import sequelize from './db.js'
import fileupload from 'express-fileupload'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000
 
app.use(cors())
app.use(json())

app.use(fileupload({
    createParentPath: true,
    limits: { 
        fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
    },
}));

app.use(express.static('uploads'));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/api',router)

// Обработка ошибок
app.use(errorHandler);

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT,() => {
            console.log(`server start on PORT ${PORT}`)
        })
    } catch(e) {
        console.log(e);
    }
}

start();