const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')
const Task = require('./tasks')
 
const userSchema= new mongoose.Schema({
    name:{
      type: String,
      required:true,
      trim:  true
      
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('the age must be a psotive number')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true, 
        minlength:6,
        validate(value){
          if(value.includes('password')){
            throw new Error('password doesnt  contain word password')
          }  
        }

    },
    
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

//Virtual fileds for owner
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON= function(){ 
    const user=this
    const userObject= user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    
    
    return userObject

}

userSchema.methods.generateOfToken= async function(){
    const user=this
    const token = jwt.sign({ _id:user._id.toString() },process.env.JWT_Secret)
    
    user.tokens=user.tokens.concat({ token })
    await user.save()
    
    return token
}

//deleting all tasks of users

userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
        next()    
})

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('unable to login')
    }
    return  user
}

//hash password before saving
userSchema.pre('save', async function(next){
    const user= this

    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password,8) 
    }

    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User