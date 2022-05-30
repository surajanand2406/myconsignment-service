const express = require('express')
const app = express()
const Icons = require('../models/Icons')
const handleErr = require('../HandleFunction/HandleErr')

app.post('/api/addIcons', (req, res) => {
    const data = req.body
    let icons = data.map(icon => {
        return {
            name: icon,
            type: 'ionicon'
        }
    })
    Icons.create(icons, (err, docs) => {
        if (err) throw err
        res.json({
            message: 'Success',
            docs
        })




    })
})
app.get('/api/getIcons:type', (req, res) => {
    let { type } = req.params
    Icons.find({ type: type }, (err, docs) => {
        if (err) throw err
        res.json({
            message: 'Success',
            docs
        })
    })
})

module.exports =app;
