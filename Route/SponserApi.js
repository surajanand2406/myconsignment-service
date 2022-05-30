const express = require('express')
const app = express()
var SponsorSchema = require("../models/SponserModel");
const handleErr = require('../HandleFunction/HandleErr')
const CronJob = require("cron").CronJob;



////////////////////////  Sponsorship Routes ///////////////////////


var job2 = new CronJob('00 00 00 * * *', function () {

    var eventDate = '';
    var currentDate = '';
    var Id = '';
    var Donation = 0;

    SponsorSchema.find({}).then(data => {

        var length = data.length;
        eventDate = data[length - 1].Date;
        Id = data[length - 1]._id;
        Donation = data[length - 1].Donation;

        currentDate = new Date().toLocaleDateString();
    }).then(() => {
        if (eventDate !== currentDate) {
            var data = SponsorSchema.findByIdAndUpdate(Id, {
                // $set:{Date:currentDate},
                // $push:{GraphData:Donation}
            }, { new: true })

            data.then(() => console.log('done'))
        }
        else {
            console.log('eeeee')
        }

    })


}, null, true, 'America/Los_Angeles');
job2.start();




app.get('/readevent', (req, res) => {


    // SponsorSchema.find({}).then(sponsorData=>{
    //     console.log(sponsorData)
    //     if(sponsorData.length===0)
    //     {
    //         res.send({event:'No Event Started',Comments:[]})
    //     }
    //     {
    //         const dataLength = sponsorData.length;

    //         res.send(sponsorData[dataLength-1])
    //     }
    // })
    SponsorSchema.find({}, (err, docs) => {
        if (err) return res.send(err)
        else {
            console.log(docs)
            if (docs.length > 0) {
                const dataLength = docs.length;
                res.send(docs[dataLength - 1])
            }
            else if (docs.length === 0) {
                res.send({ event: 'No Event Started', Comments: [] })

            }
        }
    })
})


app.post('/startevent', (req, res) => {

    var SponsorData = new SponsorSchema({
        Title: req.body.Title,
        TargetedAmount: req.body.targetedAmount,
        Donation: req.body.Donation,
        RequiredAmount: req.body.RequiredAmount,
        GraphData: req.body.GraphData,
        Comments: req.body.Comments,
        Date: req.body.Date
    })

    SponsorData.save().then(newSponsorData => {
        res.send(newSponsorData);
    })
})


app.put('/updateevent', (req, res) => {

    var data = SponsorSchema.findByIdAndUpdate(req.body.Id, {
        $set: { Title: req.body.Title, TargetedAmount: req.body.TargetedAmount }
    }, { new: true })

    data.then(updateEvent => {
        res.send(updateEvent);
    })

})

app.put('/addcomment', (req, res) => {

    var data = SponsorSchema.findByIdAndUpdate(req.body.Id, {
        $push: { Comments: req.body.Comment }
    }, { new: true })

    data.then(newData => {
        res.send(newData);
    })
})


app.put('/deletecomment', (req, res) => {

    var newComm;
    var Event = SponsorSchema.findOne({ _id: req.body.Id })


    Event.then(data => {
        newComm = data.Comments.filter(values => {
            return data.Comments[req.body.Index] !== values
        })

        setTimeout(() => {
            SponsorSchema.findByIdAndUpdate(req.body.Id, { Comments: newComm }, { new: true })
                .then(newComment => {
                    res.send(newComment);
                })
        }, 500)

    })

})

app.put('/donation', (req, res) => {

    var newDonation;
    var data = SponsorSchema.findById({ _id: req.body.Id })

    data.then(value => {
        newDonation = value.Donation + req.body.Donation
    })


    setTimeout(() => {
        SponsorSchema.findByIdAndUpdate(req.body.Id, { Donation: newDonation }, { new: true })
            .then(newData => {
                res.send(newData)
            })
    }, 500)
})


//////////////////////// End Of Sponsorship Routes ///////////////////////

module.exports=app;
