const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
var ExclusiveServicesSchema = require("../models/ExclusiveServicesModel");

/////// Exclusiver Service Routes/////


/////// Exclusiver Service Routes/////

app.post('/addexclusiveservice', (req, res) => {

    var newExclusiveServiceData = new ExclusiveServicesSchema({
        ServiceTitle: req.body.Title,
        Price: req.body.Price,
        Category: req.body.Category,
        ServiceDescription: req.body.Description,
        Images: req.body.Images,
        Date: req.body.postedDate,
        totalRatings: req.body.totalRatings,
        Reviews: req.body.Reviews,
        userName: req.body.userName,
        userID: req.body.userID,
        userCountry: req.body.userCountry,
        userDetail: req.body.userDetail,
        userImage: req.body.userImage

    })

    newExclusiveServiceData.save().then(data => {
        res.send(data)
    })
})


app.get('/readexclusiveservices', (req, res) => {

    ExclusiveServicesSchema.find({}).then(data => {
        res.send(data)
    })

})

app.delete('/deleteexclusiveservice', (req, res) => {

    ExclusiveServicesSchema.findByIdAndRemove(req.body.Id, (err, data) => {
        res.send(data)
    })

})

app.put('/updateexclusiveservice', (req, res) => {

    ExclusiveServicesSchema.findByIdAndUpdate(req.body.Id, {
        ServiceTitle: req.body.Title,
        Price: req.body.Price,
        ServiceDescription: req.body.Description,
        Images: req.body.Images,
    }, { new: true }).then(data => res.send(data))

})

app.put('/addexclusiveservicereview', (req, res) => {



    var data = ExclusiveServicesSchema.findById({ _id: req.body.Review.serviceID })

    data.then(service => {
        var Ratings = 0;

        if (service.totalRatings > 0) {
            Ratings = (service.totalRatings + req.body.totalRatings) / 2;
        }
        else {
            Ratings = req.body.totalRatings;
        }

        ExclusiveServicesSchema.findByIdAndUpdate(req.body.Review.serviceID, {
            $push: { Reviews: req.body.Review },
            totalRatings: Ratings
        }, { new: true }).then(data =>
            res.send(data)
        )


    })

})

module.exports = app; 
/////// End Exclusiver Service Routes/////

