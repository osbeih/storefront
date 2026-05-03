import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const {
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_TEST_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
} = process.env

const ENV = process.env.ENV || 'dev'
console.log('ENV:', ENV)
console.log('DB:', ENV === 'test' ? POSTGRES_TEST_DB : POSTGRES_DB)

const client = new Pool({
    host: POSTGRES_HOST,
    database: ENV === 'test'
        ? POSTGRES_TEST_DB
        : POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
})

export default client