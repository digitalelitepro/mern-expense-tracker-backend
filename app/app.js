import config from '../utils/envConfig.js'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from '../database/connectDB.js'
import authRouter from '../routes/auth.routes.js'
import path from 'path'
import {URL} from 'url'


const app = express()
config()
connectDB()

 
const __dirname = decodeURI(new URL('..', import.meta.url).pathname)
console.log(path.join(__dirname, "uploads")) 


 

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const allowedOrigins = ['http://localhost:5175']
const corsOptions = {
    origin : allowedOrigins,
    credentials:true
}

app.use(cors(corsOptions))
app.use('/uploads', express.static(path.join(__dirname, "uploads")))


app.use('/api/v1/auth', authRouter)


app.get('/', (req, res, next) => {
    return res.status(200).json({
        success : true,
        message : 'Welcome to the Expense Tracker APIs',
        data: {}
    })
})


app.get('*', (req,res,next) => {
    const err = new Error(`The ${req.originalUrl} path not found in the server`)
    err.success = false
    err.statusCode = 404
    next(err)
})


app.use((err, req, res, next) => {
    const message = err?.message || 'Internal server error'
    const statusCode = err?.statusCode ||  500
    const success = err?.success || false

    return res.status(statusCode).json({
        success,
        message,
        data: {}
    })
})



export default app
