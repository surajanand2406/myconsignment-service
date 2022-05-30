
const express = require('express')
const app = express();
const  ListingReport = require('../models/ListingReport')





app.put('/api/searchReport', (req, res) => {
    ListingReport.find({ $text: { $search: req.body.title } })
        .exec((err, docs) => {
            if (err) throw err
            res.json(docs)
        });
})

app.delete('/api/DeleteListingReport', (req, res) => {
    ListingReport.findOneAndDelete(req.body.id, (err, doc) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            data: doc
        })
    })
})



app.put('/api/UpdateReportStatus', (req, res) => {
    ListingReport.findByIdAndUpdate({ _id: req.body.id }, { $set: { Action: req.body.Action } }, (err, docs) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            data: docs
        })
    })
})


app.post('/api/reportListing', (req, res) => {
    ListingReport.create(req.body, (err, doc) => {
        if (err) {
            res.json({
                message: 'Failed',
                err
            })
        }
        else {
            res.json({
                message: "Success",
                doc
            })
        }
    })
})
app.delete('/api/removeReport', (req, res) => {
    ListingReport.findByIdAndDelete(req._id, (err, doc) => {
        if (err) {
            res.json({
                message: 'Failed',
                err
            })
        }
        else {
            res.json({
                message: "Success",
                doc
            })
        }
    })
})

app.get('/api/getListReports', (req, res) => {
    ListingReport.find({}, (err, docs) => {
        if (err) throw err
        res.json({
            message: "Success",
            docs
        })
    })
})

module.exports = app;

