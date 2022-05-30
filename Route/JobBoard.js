const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
var JobBoardSchema = require("../models/JobBoardModal");

////////////////////////  Custom Made Routes ///////////////////////

app.post('/postjob', (req, res) => {
    var PostJob = new JobBoardSchema({
        BuyerEmail: req.body.BuyerEmail,
        BuyerName: req.body.BuyerName,
        JobTitle: req.body.Title,
        Budget: req.body.Budget,
        JobCategory: req.body.Category,
        MaterialDes: req.body.Material,
        Size: req.body.Size,
        Shipping: req.body.Shipping,
        PostedDate: req.body.PostedDate,
        JobDetail: req.body.JobDetail,
        Image: req.body.Image,
        firebaseUID:req.body.firebaseUID
    })

    PostJob.save().then(data => {
        res.send(data)
    })
})


app.get('/readjob', (req, res) => {

    JobBoardSchema.find({}).then(jobData => {
        res.send(jobData)
    })
})


app.put('/updatejob', (req, res) => {

    JobBoardSchema.findByIdAndUpdate(req.body.Id, {

        JobTitle: req.body.Title,
        Budget: req.body.Budget,
        MaterialDes: req.body.Material,
        Size: req.body.Size,
        Shipping: req.body.Shipping,
        JobDetail: req.body.JobDetail,
        Image: req.body.Image
    }, { new: true }).then(data => res.send(data))
})


app.delete('/deletejob', (req, res) => {

    JobBoardSchema.findByIdAndRemove(req.body.Id, (err, data) => {
        res.send(data)
    })
})



////////////////////////  End Of Custom Made Routes ///////////////////////
module.exports=app;

