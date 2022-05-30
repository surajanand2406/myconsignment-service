
  /////Help Center Routes //////
const express = require('express')
const app = express()
var HelpCenterSchema = require("../models/HelpCenterModel");
const handleErr = require('../HandleFunction/HandleErr')


  app.get('/readquestions',(req,res)=>{
    HelpCenterSchema.find({}).then(data=>{
        res.send(data)
    })
})

app.post('/addtopic',(req,res)=>{

var newHelpCenterSchema =new HelpCenterSchema({
    Topic:req.body.topic,
    Questions:[]
})

newHelpCenterSchema.save().then(data=>{
    res.send(data)
})
})

app.put('/addquestion',(req,res)=>{
HelpCenterSchema.findByIdAndUpdate(req.body.topicId,{
    $push:{Questions:req.body.Questions},
},{new:true}).then(data=>      
    res.send(data)
)
})

////End of Help Center Routes///

module.exports=app;