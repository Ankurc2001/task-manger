const express = require('express')
const taskRouter = require('./routers/tasks')
const userRouter = require('./routers/users')
const app =express()
const port= process.env.PORT 

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log('listeng on port ' + port)
})


