const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess= require('../HandleFunction/handleSuccess')
const  Inactive  = require('../models/Inactive')
const Listings = require('../models/Listings')








app.post('/api/addInativeListings', (req, res) => {
    if (req.body.data) {
        let { data } = req.body
        if (data.length > 0) {
            Inactive.create(data, (err, docs) => {
                if (err) return res.json(handleErr(err))
                else {
                    return res.json(handleSuccess(docs))
                }

            })
        }
        else {
            return res.json(handleErr("Minimum 1 listings is required"))
        }
    }
})

//Get inactive listings
app.get('/api/getInactiveListings:firebaseUID', (req, res) => {
    if (req.params.firebaseUID.length > 8) {
        Inactive.find({ firebaseUID: req.params.firebaseUID }, (err, docs) => {
            if (err) res.json(handleErr(err))
            else {
                return res.json(handleSuccess(docs))
            }
        })
    }
    else {
        return res.json(handleErr('Valid firebaseUID is required'))
    }
})

//Add inactive listings to active Listings

app.put('/api/publishInactive', (req, res) => {
    if (req.body.ids) {
        if (req.body.ids.length > 0) {
            Inactive.find({ _id: { $in: req.body.ids } }, (err, docs) => {
                if (err) return res.json(handleErr(err))
                if (docs.length > 0)
                  {
                    let updatedListings = docs.map((li) => {
                        let obj = {
                            ...li._doc
                        }
                        delete obj._id
                        delete obj.createdDate
                        return obj
                    })
                Listings.create(updatedListings, (error, listings) => {
                    if (error) return res.json(handleErr(error))
                    else {
                        let ids = listings.map(d => d._id)
                        Activity.findOne({ firebaseUID: req.body.firebaseUID }, (e, act) => {
                            if (e) return res.json(handleErr(e))
                            else {
                                let { onSale } = act
                                let newSales = onSale.concat(ids)
                                Activity.findOneAndUpdate({ firebaseUID: req.body.firebaseUID }, { onSale: newSales }, { new: true }, (error, doc) => {
                                    if (err) return res.json(handleErr(error))
                                    else {
                                        Inactive.deleteMany({ _id:{$in:req.body.ids}},(e,del)=>{
                                            if(e)console.log(e)
                                            else{
                                                return res.json(handleSuccess(docs))
                                            }
                                        })
                                    }
                                })

                            }
                        })
                    }
                })
                  }
            })
        }
    }
    else {
        return res.json(handleErr('Valid listing ID is required'))

    }
})

module.exports = app;