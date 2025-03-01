import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
const { Schema } = mongoose

const userSchema = new Schema({
     fullName : {
        type : String,
        required:true
     },
     email : {
        type:String,
        required:true,
        unique:true
     },
     password : {
        type:String,
        required:true
     },
     profileImageUrl : {
        type: String, 
        default:null
     }
}, {timestamps: true})


userSchema.pre('save', async function(next){
   if(!this.isModified('password')) return  next()
   const salt = await bcrypt.genSalt(10) 
   this.password = await bcrypt.hash(this.password, salt)
   next()

})


userSchema.methods.comparePassword = async function(pwd) {
    return await bcrypt.compare(pwd, this.password)
}


const User =  mongoose.model ('User', userSchema)



export default User