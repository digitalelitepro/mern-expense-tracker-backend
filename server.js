import express from 'express' 
import http from 'http'
import config from './utils/envConfig.js' 
import app from './app/app.js'
import crypto from 'crypto'  


console.log(crypto.randomBytes(32).toString('base64'))

config() 


 
const PORT = process.env.PORT || 5000



const server =  http.createServer(app) 
server.listen(PORT, () => console.log(`The server is Up and running at ${PORT} port`))