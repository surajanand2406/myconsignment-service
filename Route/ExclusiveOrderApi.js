const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
var ExclusiveOrderSchema = require("../models/ExclusiveOrderModel");

app.post('/createexclusiveorder', (req, res) => {

    var newExclusiveOrderData = new ExclusiveOrderSchema({

        sellerID: req.body.sellerID,
        sellerProfilePic: req.body.sellerProfilePic,
        sellerName: req.body.sellerName,
        buyerID: req.body.buyerID,
        buyerProfilePic: req.body.buyerProfilePic,
        buyerName: req.body.buyerName,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        Price: req.body.Price,
        Days: req.body.Days,
        orderDetail: req.body.orderDetail,
        ServiceId: req.body.ServiceId,
        isComplete: req.body.isComplete
    })

    newExclusiveOrderData.save().then(data => {
        res.send(data)
    })
})

app.get('/readexclusiveorders', (req, res) => {
    ExclusiveOrderSchema.find({}).then(orders => {
        res.send(orders)
    })
})

app.delete('/deleteexclusivesellerorder', (req, res) => {
    ExclusiveOrderSchema.findByIdAndRemove(req.body.Id, (err, data) => {
        res.send(data)
    })
})

app.delete('/deleteexclusivebuyerorder', (req, res) => {

    var orderEndDate = req.body.endDate;
    var currentDate = new Date();

    var days = Math.floor((Date.parse(orderEndDate) - Date.parse(currentDate)) / 86400000);
    var hours = days * 24;

    console.log(days)
    console.log(hours)


    ExclusiveOrderSchema.findByIdAndRemove(req.body.Id, (err, data) => {
        res.send(data)
    })
})

app.put('/completeexclusiveorder', (req, res) => {
    ExclusiveOrderSchema.findByIdAndUpdate(req.body.Id, {
        isComplete: true
    }, { new: true }).then(data => res.send(data))
})


/////// End Exclusiver Service Order Routes/////

app.post('/addstoreslistings', (req, res) => {
    console.log(req.body)
})

module.exports=app;
