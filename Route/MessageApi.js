var messegeSchema = require("../models/ChatModal");
const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')

app.post('/readmessege', (req, res) => {

    messegeSchema.findByIdAndUpdate(req.body.Id, {
        isRead: true
    }, { new: true }).then(data => res.send(data))


})

app.post('/sendproposal', (req, res) => {

    var newMesseg = new messegeSchema({

        messages: req.body.messages,
        sellerID: req.body.sellerID,
        sellerProfilePic: req.body.sellerProfilePic,
        sellerName: req.body.sellerName,
        buyerID: req.body.buyerID,
        buyerProfilePic: req.body.buyerProfilePic,
        buyerName: req.body.buyerName,
        isRead: req.body.isRead
    })

    newMesseg.save().then(Proposal => {
        res.send(Proposal)
    })
})



app.get('/readchatdata', (req, res) => {

    messegeSchema.find({}).then(data => {
        res.send(data)
    })
})

app.post('/sendchatdata', (req, res) => {

    var messeges = new messegeSchema({
        content: req.body.content,
        name: req.body.name
    })

    messeges.save().then((data) => {
        res.send(data)
    })
})
module.exports=app;

