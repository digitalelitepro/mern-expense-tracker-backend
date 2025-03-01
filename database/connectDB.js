import config from '../utils/envConfig.js'
import mongoose from 'mongoose'
config()

export const connectDB = async () => {
  
    mongoose.connection.on('connected', () => {
       console.log('The Server is successfully connected to the database !')
    })
    
    mongoose.connection.on('error', () => {
        console.log('An error occurs when the server tried to connect to the database !') 
    })

    mongoose.connection.on('disconnected', ()=>{
      console.log('The server is disconnected to the database !')
    })

    await mongoose.connect(process.env.MONGO_DB_URL)
}