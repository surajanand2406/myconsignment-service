
const express = require('express')
const app = express()
const Listings = require('../models/Listings')
const Activity = require('../models/ProfileActivity')
const User = require('../models/User')
const handleErr = require('../HandleFunction/HandleErr')



app.post('/api/addListing', (req, res) => {
    const data = req.body
    Listings.create(data, (err, doc) => {
        if (err) res.json(err)
        Activity.findOneAndUpdate({ firebaseUID: doc.firebaseUID }, { $push: { onSale: doc._id } }, { new: true }, (err, docs) => {

        })
        res.json({
            message: 'Success',
            data: doc
        })
    })
})

app.post('/api/findByLocation', (req, res) => {
    if (req.body.longitude && req.body.latitude && req.body.distance) {
        Listings.find(
            {
                geometry: {
                    $nearSphere: {
                        $geometry: {
                            type: "Point",
                            coordinates: [req.body.longitude, req.body.latitude]    //longitude and latitude
                        },
                        $minDistance: 0,
                        $maxDistance: req.body.distance * 1000
                    }
                }
            },
            (err, docs) => {
                if (err) return res.json(handleErr(err))
                else res.json({
                    message: "Success",
                    docs
                })
            }
        )
    }
    else res.json({
        message: "Lcation Not Found",

    })
})

app.post('/api/getListings:page', (req, res) => {
    const query = Object.assign({}, req.body)
    var perPage = 20
    var page = req.params.page || 1
    if (query.hasOwnProperty("minPrice")) {
        console.log('fhaosidhfo')
        delete query.minPrice
        delete query.maxPrice
        if (query.hasOwnProperty('last')) {
            let startDate = new Date()
            startDate.setDate(startDate.getDate() - query.last)
            startDate.setHours(0)   // Set the hour, minute and second components to 0
            startDate.setMinutes(0)
            startDate.setSeconds(0)
            Listings.find({
                trade: query.trade, $or: [{ shippingNational: query.deliverable }, { shippingInternational: query.deliverable }], price: {
                    $lte: req.body.maxPrice,
                    $gte: req.body.minPrice
                },
                createdDate: { $gte: startDate }
            }).skip((perPage * page) - perPage).limit(perPage).exec((err, data) => {

                Listings.estimatedDocumentCount().exec((err, count) => {
                    if (err) return res.json({ message: err })
                    res.json({
                        data,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            })
        }
        else {
            Listings.find({
                trade: req.body.trade, $or: [{ shippingNational: req.body.deliverable }, { shippingInternational: req.body.deliverable }], price: {
                    $lte: req.body.maxPrice,
                    $gte: req.body.minPrice
                }
            }).skip((perPage * page) - perPage).limit(perPage).exec((err, data) => {

                Listings.estimatedDocumentCount().exec((err, count) => {
                    if (err) return res.json({ message: err })
                    res.json({
                        data,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            })
        }
    }
    else {
        Listings.find(query).skip((perPage * page) - perPage).limit(perPage).exec((err, data) => {
            Listings.estimatedDocumentCount().exec((err, count) => {
                if (err) return res.json({ message: err })
                res.json({
                    data,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
    }
})


app.post('/api/sortByDate:page', (req, res) => {
    var page = req.params.page || 1
    var perPage = 20
    if (req.body.type === 'asc') {
        Listings.find({}).sort({ createdDate: 1 }).skip((perPage * page) - perPage).limit(perPage).exec((err, data) => {
            if (err) return res.json(handleErr(err))
            else Listings.estimatedDocumentCount().exec((err, count) => {
                if (err) return res.json({ message: err })
                res.json({
                    data,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    message: "Success"
                })
            })
        })

    } else {
        Listings.find({}).sort({ createdDate: -1 }).skip((perPage * page) - perPage).limit(perPage).exec((err, data) => {
            if (err) return res.json(handleErr(err))
            else Listings.estimatedDocumentCount().exec((err, count) => {
                if (err) return res.json({ message: err })
                res.json({
                    data,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    message: "Success"

                })
            })
        })
    }
})
app.post('/api/sortByPrice:page', (req, res) => {
    var page = req.params.page || 1
    var perPage = 20
    if (req.body.type === 'asc') {
        Listings.find({}).sort({ price: 1 }).skip((perPage * page) - perPage).limit(perPage).exec((err, data) => {
            if (err) return res.json(handleErr(err))
            else Listings.estimatedDocumentCount().exec((err, count) => {
                if (err) return res.json({ message: err })
                res.json({
                    data,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    message: "Success"
                })
            })
        })

    } else {
        console.log('afoshfiashd')
        Listings.find({}).sort({ price: -1 }).skip((perPage * page) - perPage).limit(perPage).exec((err, data) => {
            if (err) return res.json(handleErr(err))
            else Listings.estimatedDocumentCount().exec((err, count) => {
                if (err) return res.json({ message: err })
                res.json({
                    data,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    message: "Success"
                })
            })
        })
    }
})
app.get('/api/getListing:listingId', (req, res) => {
    Listings.findById(req.params.listingId, (err, doc) => {
        if (err) throw err
        User.findOne({ firebaseUID: doc.firebaseUID }, 'fName profilePic', (err, data) => {
            Shipping.findOne({ firebaseUID: doc.firebaseUID }, (err, shipping) => {
                let result = {
                    doc,
                    userData: data,
                    shipping
                }
                if (err) throw err
                res.json({
                    message: "Success",
                    result
                })
            })
        })
    })
})
app.get('/api/listingByListingID:listingId', (req, res) => {
    console.log(req.params.listingId)
    // Listings.findOne({listingID: req.params.listingId},(err, doc)=>{
    //     if (err) res.json(handleErr(err))
    //     User.findOne({ firebaseUID: doc.firebaseUID }, 'fName profilePic', (err, data) => {
    //         Shipping.findOne({ firebaseUID: doc.firebaseUID }, (error, shipping) => {
    //             let result = {
    //                 doc,
    //                 userData: data,
    //                 shipping
    //             }
    //             if (error) return res.json(handleErr(error))
    //             else res.json({
    //                 message: "Success",
    //                 result
    //             })
    //         })
    //     })
    // })
    Listings.findOne({ listingID: req.params.listingId }).populate('shippingID').exec((err, doc) => {
        if (err) return res.json(handleErr(err))
        User.findOne({ firebaseUID: doc.firebaseUID }, 'fName profilePic', (error, data) => {
            if (error) return res.json(handleErr(error))
            else {
                let result = {
                    doc,
                    userData: data
                }
               return res.json({
                    message: "Success",
                    result
                })
            }
        })
    })
})


app.get('/api/getUserListings:firebaseUID', (req, res) => {
    Listings.find({ firebaseUID: req.params.firebaseUID }, (err, docs) => {
        if (err) res.json({ message: "Failed" })
        else {
            console.log(docs)
            res.json({
                message: "Success",
                docs
            })
        }
    })
})

app.put('/api/searchListing', (req, res) => {
    Listings.find({ $text: { $search: req.body.title } })
        .limit(30)
        .exec((err, docs) => {
            if (err) return res.json({ message: "Success", err })
            res.json({ message: "Success", doc: docs })
        });
})




app.get("/api/AllListings", (req, res) => {
    Listings.find({}, (err, sales) => {
        if (err) {
            res.json({
                message: "failed",

            })
        }
        res.json(sales)
    })
})


app.delete('/api/deleteListing', (req, res) => {
    Listings.findByIdAndRemove(req.body.id, (err, doc) => {
        if (err) res.json(err)
        else{
            Activity.findOneAndUpdate({firebaseUID:req.body.firebaseUID},{$pull:{onSale:req.body.id}},{new:true},(errr,act)=>{
                if(errr)return res.json(handleErr(errr))
                else{
                    return res.json(handleSuccess(doc))
                }
            })
        }
    })
})
app.delete('/api/DeleteAllListings', (req, res) => {
    Listings.remove({ firebaseUID: req.body.id }, (err, doc) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            data: doc
        })
    })
})

app.delete('/api/DeleteReportListing', (req, res) => {
    Listings.findByIdAndRemove(req.body.id, (err, doc) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            data: doc
        })
    })
})

app.post('/api/getFilteredListings:page', (req, res) => {
    const query = Object.assign({}, req.body)
    var perPage = 20
    var page = req.params.page || 1
    if (query.hasOwnProperty('last')) {
        let startDate = new Date()
        startDate.setDate(startDate.getDate() - query.last)
        startDate.setHours(0)   // Set the hour, minute and second components to 0
        startDate.setMinutes(0)
        startDate.setSeconds(0)
        Listings.find({
            trade: query.trade, shippingNational: query.shippingNational, shippingInternational: query.shippingInternational,
            price: {
                $gte: req.body.minPrice
            },
            createdDate: { $gte: startDate }
        }).skip((perPage * page) - perPage).limit(perPage).exec((err, data) => {

            Listings.estimatedDocumentCount().exec((err, count) => {
                if (err) return res.json({ message: err })
                else res.json({
                    data,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
    }

})

module.exports = app;
