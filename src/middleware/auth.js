const jwt= require('jsonwebtoken')
const User = require('../models/users')


const auth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token,process.env.JWT_Secret)
        const user= await User.findOne({_id: decode._id, 'tokens.token':token})

        if(!user){
            throw Error()
        }
        req.token=token
        req.user=user
        next()
    }catch(e){
        res.status(401).send({error:'pelase Authanticate'})
    }
}
module.exports=auth