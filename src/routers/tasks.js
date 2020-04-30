const express= require('express')
const router = new express.Router()
const Task = require('../models/tasks')
require('../db/mongoose')
const auth = require('../middleware/auth')


router.post('/tasks',auth,async(req,res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }

})
router.get('/tasks',auth,async (req,res)=>{
    const match={}
    const sort ={}
    if(req.query.Completed){
        match.Completed =  req.query.Completed === 'true'
    }
    if(req.query.sortBy){
        const parts =req.query.sortBy.split(':')
        sort[parts[0]]= parts[1] === 'desc' ? -1 : 1
    }
    
    
    try{
        //const tasks = await Task.find({ owner:req.user._id })
        
        await req.user.populate({
                path:'tasks',
                match,
                options:{
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                                }
            }).execPopulate()
        res.status(200).send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)

    }
    
})

router.get('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id
    
    try{
        
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task){
          return  res.status(404).send()
        }
        res.send(task)
    }catch(e){
        send.status(500).send(e)
    }
    
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedupdate=['Description','Completed']
    const isvalid = updates.every((update)=> allowedupdate.includes(update))
    if(!isvalid){
        return res.status(400).send({error:'invalid opertion'})
    }
    try{
       const task= await Task.findOne({ _id:req.params.id,owner: req.user._id})
        if(!task){
         return   res.status(404).send()
        }

        updates.forEach((update)=> task[update]=req.body[update])
        await task.save()
        res.send(task)    
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task){
           return res.status(404).send()
        }
        task.remove() 
        res.send(task)

    }catch(e){
        res.status(500).send(e)
    }
})

module.exports= router