const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
const Payouts = require('../models/Payouts')



app.post('/api/createPayout', (req, res) => {
    let data = req.body
    Payouts.create(data, (err, doc) => {
        if (err) res.json({ message: "Failed", err })
        else {
            return res.json({ message: "Success", doc })
        }
    })
})

app.get('/api/getPayout:id', (req, res) => {
    Payouts.findById(req.params.id).populate([
        { path: 'receiver' },
        { path: "sender" }
    ]).exec(function (err, doc) {
        if (err) return res.json({ err })
        else {
            return res.json({ doc })
        }
    })
})

app.get('/api/getPendingPayouts', (req, res) => {
    Payouts.find({ status: false }).populate([
        { path: 'receiver' },
        { path: "sender" }
    ]).exec((err, docs) => {
        if (err) return res.json({ message: "Failed", err })
        return res.json({ message: "Success", docs })
    })
})

app.get('/api/getAllPayouts', (req, res) => {
    Payouts.find({}).populate([
        { path: 'receiver' },
        { path: "sender" }
    ]).exec((err, docs) => {
        if (err) return res.json({ message: "Failed", err })
        return res.json({ message: "Success", docs })
    })
})


module.exports=app;
