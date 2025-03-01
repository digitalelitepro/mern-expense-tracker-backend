import jwt from 'jsonwebtoken'
import config from '../utils/envConfig.js'
// import User from '../models/user.model.js'
config()

export const protect = async (req, res, next) => {
   try{

      const token = req.headers?.authorization.split(" ")[1]
      const decoded =  jwt.verify(token, process.env.JWT_SECRET)
      console.log(`func : protect middleware : ${decoded} `)
    //   if(!decoded){
    //     const err =  new Error('Action not authorized ! please log in')
    //     err.statusCode = 403
    //     err.success = false
    //     return next(err)
    //   }

      req.user_id = decoded.id
      next()

   }catch(err){
      return next(err)
   }
}