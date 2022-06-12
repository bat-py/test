import Sequelize from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()
// 37.232.143.61
export default new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'mariadb',
        host: process.env.DB_HOST,
        dialectOptions: {
            charset: 'utf8',
            collate: 'utf8_general_ci', 
        },
        /*pool: {
            min: 0,
            max: 5,
            idle: 10000
        },
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci', 
            timestamps: true
        },
        collation: {
            charset: 'utf8',
        },
        benchmark: false,*/
        logging: false
    }
)