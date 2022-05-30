
const express = require('express')
const app = express()
const Reports = require('../models/Reports')
const handleErr = require('../HandleFunction/HandleErr')


app.get('/api/getReports', (req, res) => {
    Reports.find({}, (err, docs) => {
        if (err) 
        res.json(handleErr(err))
        res.json({
            message: "Success",
            docs
        })
    })
})



app.post('/api/report', (req, res) => {
    Reports.create(req.body, (err, doc) => {
        if (err) throw err
        res.json({
            message: "Success",
            data: doc
        })
    })
})
module.exports =app;
