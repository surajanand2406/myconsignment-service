const express = require('express')
const app = express()
var ExclusiveUserSchema = require("../models/ExclusiveUserModel");
const handleErr = require('../HandleFunction/HandleErr')


app.post('/requestforregisteration', (req, res) => {

    var newExclusiveUserData = new ExclusiveUserSchema({
        BusinessName: req.body.CompanyName,
        Email: req.body.Email,
        Contact: req.body.Contact,
        Category: req.body.Category,
        Country: req.body.Country,
        BusinessDetail: req.body.Detail,
        Image: req.body.Image,
        Password: req.body.Password,
        isRegistered: req.body.isRegister,
        firebaseUID: req.body.firebaseUID

    })

    newExclusiveUserData.save().then(data => {
        res.send(data)
    })
})
app.get('/readexclusiveuserdata', (req, res) => {

    ExclusiveUserSchema.find({}).then(data => {
        res.send(data)
    })

})

app.post('/readAcceptRequest', (req, res) => {

    ExclusiveUserSchema.findByIdAndUpdate(req.body.Id, {
        isRegistered:true,
    }, { new: true }).then(data => res.send(data))

})

app.put('/updateexclusiveuserdata', (req, res) => {

    ExclusiveUserSchema.findByIdAndUpdate(req.body.Id, {
        BusinessName: req.body.Name,
        Password: req.body.Password,
        Contact: req.body.Contact,
        BusinessDetail: req.body.Detail,
    }, { new: true }).then(data => res.send(data))

})





/////// End Exclusiver User Routes/////

module.exports=app;
