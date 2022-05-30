const express = require('express')
const app = express()
var JobCategorySchema = require("../models/CategoryModal");
const handleErr = require('../HandleFunction/HandleErr')
////////////////////////  Job Category Routes ///////////////////////


app.get('/readcategory', (req, res) => {

    JobCategorySchema.find({}).then(data => {
        res.send(data)
    })

})

app.post('/addcategory', (req, res) => {

    var newCategories = new JobCategorySchema({
        Name: req.body.Name,
        Image: req.body.Image
    })

    newCategories.save().then(data => {
        res.send(data)
    })

})


app.delete('/deletecategory', (req, res) => {

    JobCategorySchema.findByIdAndRemove(req.body.Id, (err, data) => {
        res.send(data)
    })

})

module.exports=app;
////////////////////////  End Of Job Category Routes ///////////////////////

