const express = require('express')
const app = express()
const ExclusiveCategory = require('../models/ExclusiveCategory')


app.get('/readExclusivecategory', (req, res) => {

    ExclusiveCategory.find({}).then(data => {
        res.send(data)
    })

})

app.post('/addExclusiveCategory', (req, res) => {

    var newCategories = new ExclusiveCategory({
        Name: req.body.Name,
    })

    newCategories.save().then(data => {
        res.send(data)
    })

})


app.delete('/deleteExclusivecategory', (req, res) => {

    ExclusiveCategory.findByIdAndRemove(req.body.Id, (err, data) => {
        res.send(data)
    })

})


app.put('/updateexclusiveCategory', (req, res) => {

    ExclusiveCategory.findByIdAndUpdate(req.body.Id, {
        Name: req.body.Name,
      
    }, { new: true }).then(data => res.send(data))

})

module.exports =app;

