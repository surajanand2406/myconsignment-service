const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess= require('../HandleFunction/handleSuccess')
const  Drafts = require('../models/DraftListings')



app.post('/api/createDraft', (req, res)=>{
    if(req.body.firebaseUID){
        let data = req.body
        Drafts.create(data, (err, doc) => {
            if(err) res.json(handleErr(err))
            else{
                return res.json(handleSuccess(doc))
            }
        })
    }
    else{
        return res.json(handleErr('Valid firebaseUID is required'))
    }
})

//update draft

app.put('/api/updateDraft', (req, res)=>{
    if(req.body.firebaseUID && req.body.id){
        let data = req.body
        Drafts.findByIdAndUpdate(req.body.id,{data},{ new: true}, (err, doc)=>{
            if(err)return res.json(handleErr(err))
            else{
                return res.json(handleSuccess(doc))
            }
        })
    }   
    else{
        return res.json(handleErr('Valid firebaseUID and listing _id is required'))
    }
})

//delete draft
app.delete('/api/deleteDraft',(req,res)=>{
    if(req.body.id){
        Drafts.findByIdAndDelete(req.body.id,(err, doc)=>{
            if(err)return res.json(handleErr(err))
            else{
                return res.json(handleSuccess(doc))
            }
        })
    }
    else{
        return res.json(handleErr('Valid draft _id is required'))
    }
})

//get all drafts for user

app.get('/api/getUserDrafts:firebaseUID',(req, res)=>{
    Drafts.find({ firebaseUID: req.params.firebaseUID}, (err, docs)=>{
        if(err)return res.json(handleErr(err))
            else{
                return res.json(handleSuccess(docs))
            }
    })
})

module.exports = app;