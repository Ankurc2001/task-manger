const mongodb = require("mongodb")
const MongoClient = mongodb.MongoClient
const ObjectID =mongodb.ObjectID
const connecturl= 'mongodb://127.0.0.1:27017'
const databasename ='task-manager'

MongoClient.connect(connecturl, {useNewUrlParser: true},(error,client)=>{
    if(error){
       return console.log('unable to connect')
    }

    const db =client.db(databasename)

    db.collection('users').deleteMany({
         age:"19"
     }).then((result)=>{
         console.log(result)
     }).catch((error)=>{
         console.log(error)
     })
})