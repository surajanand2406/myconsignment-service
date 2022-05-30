
const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess= require('../HandleFunction/handleSuccess')
const Activity = require('../models/ProfileActivity')
const mongoose = require('mongoose')
const Chats = require('../models/Chats')




app.put('/api/dislike', (req, res) => {
    Activity.findOneAndUpdate({ firebaseUID: req.body.firebaseUID }, { $pull: { Favorites: req.body.id } }, { new: true }, (err, doc) => {
        if (err) res.json({ message: "Falied" })
        res.json({
            message: "Success",
            doc
        })
    })
})


app.get('/api/getActivity:firebaseUID', (req, res) => {
    Activity.findOne({ firebaseUID: req.params.firebaseUID }).populate([
        { path: 'onSale' },
        { path: "Favorites" },
        { path: "Conversations" },
        { path: "Orders" },
        { path: "Purchases" }
    ]).exec((err, data) => {
        if (err) return res.json(handleErr(err))
        else {
            return res.json(handleSuccess(data))
        }
    })
})



app.get('/api/getFavoriteIds:firebaseUID', (req, res) => {
    console.log(req.params.firebaseUID)
    if (req.params.firebaseUID !== null) {
        Activity.findOne({ firebaseUID: req.params.firebaseUID }, 'Favorites', (err, docs) => {
            if (err) res.json({
                message: "Failed"
            })
            else {
                console.log('fav => ',docs)
                res.json({
                    message: "Success",
                    docs
                })
            }
        })
    }
})

app.get('/api/getFavorites:firebaseUID', (req, res) => {
    Activity.findOne({ firebaseUID: req.params.firebaseUID }, 'Favorites', (err, doc) => {
        if (err) {
            console.log(err)
            res.json({ message: 'Failed' })
        }
        else {
            let ids = doc.Favorites
            let objecIDs = ids.map(id => mongoose.Types.ObjectId(id))
            console.log(objecIDs)
            if (ids.length > 0) {
                Listings.find({ _id: { $in: objecIDs } }, (err, docs) => {
                    if (err) throw err
                    if (docs.length > 0)
                        res.json({
                            message: "Success",
                            data: docs
                        })
                })
            }

        }
    })
})
app.get('/api/getPurchases:firebaseUID', (req, res) => {
    Activity.findOne({ firebaseUID: req.params.firebaseUID }, 'Purchases', (err, doc) => {
        if (err) {
            res.json({ message: 'Failed' })
        }
        else {
            let ids = doc.Purchases
            let objecIDs = ids.map(id => mongoose.Types.ObjectId(id))
            if (ids.length > 0) {
                Orders.find({ _id: { $in: objecIDs } }, (err, docs) => {
                    if (err) throw err
                    if (docs.length > 0)
                        res.json({
                            message: "Success",
                            data: docs
                        })
                })
            }

        }
    })
})

app.put('/api/getChats', (req, res) => { //get messages of a chat from conversations
    // console.log(req.body)
    if (req.body.firebaseUID) {
        Activity.findOne({ firebaseUID: req.body.firebaseUID }, 'Conversations', (err, doc) => {
            if (err) return res.json({ err })
            console.log('doc---->',doc)
            if (doc.Conversations) {
                let conversations = doc.Conversations
                let objecIDs = conversations.map(conversation => mongoose.Types.ObjectId(conversation))
                if (conversations.length > 0) {
                    Chats.find({ _id: { $in: objecIDs } }, (err, docs) => {
                        if (err) {
                            // return res.json({ err })
                            return res.json(handleErr(err))
                        }
                            // return res.json({
                            //     message: "Success",
                            //     data: docs
                            // })
                            return res.json(handleSuccess(docs))
                    })
                }
                else{
                    // return res.json({
                    //     message: "Success",
                    //     data: doc
                    // })
                    return res.json(handleSuccess(doc))
                }
            }
        })
    } else {
        return res.json({ err: "Valid UID is required" })
    }
})



app.put('/api/addFavorite', (req, res) => {
    Activity.findOneAndUpdate({ firebaseUID: req.body.firebaseUID }, { $push: { Favorites: req.body.id } }, { new: true }, (err, docs) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            data: docs
        })
    })
})


app.delete('/api/deleteActivityUserUID', (req, res) => {
    Activity.findOneAndDelete(req.body.uid, (err, doc) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            data: doc
        })
    })
})
app.delete('/api/deleteActivityUserUID', (req, res) => {
    Activity.findOneAndDelete(req.body.uid, (err, doc) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            data: doc
        })
    })
})


app.get('/api/Orders:firebaseUID', (req, res) => {
    Activity.findOne({ firebaseUID: req.params.firebaseUID }, 'Orders', (err, doc) => {
        if (err) {
            res.json({ message: 'Failed' })
        }
        else {
            let ids = doc.Orders
            let objecIDs = ids.map(id => mongoose.Types.ObjectId(id))
            if (ids.length > 0) {
                Orders.find({ _id: { $in: objecIDs } }, (err, docs) => {
                    if (err) throw err
                    if (docs.length > 0)
                        res.json({
                            message: "Success",
                            data: docs
                        })
                })
            }

        }
    })
})
module.exports = app;