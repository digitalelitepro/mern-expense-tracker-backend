import express from "express";
import {
  register,
  login,
  getUserInfos,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

import upload from "../middlewares/upload.middleware.js";


const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", protect, getUserInfos);

authRouter.post('/upload-image', upload.single('image'), (req, res, next) => {
    
    if(!req.file) {
        const err = new Error('No file sent !')
        err.statusCode = 400
        err.success = false
        return next(err)
    } 
    
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req?.uploadedFileName}`

    return res.status(200).json({
        success:true,
        message:'File uploaded successfully',
        data : {imageUrl}
    })

})

export default authRouter;
