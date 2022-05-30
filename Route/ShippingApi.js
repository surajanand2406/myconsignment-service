const express = require('express')
const app = express()
const Shipping = require('../models/Shipping')
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess = require('../HandleFunction/handleSuccess')



app.post('/api/getSpacShippings', (req, res) => {
    Shipping.find({ firebaseUID: req.body.firebaseUID }, (err, docs) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            data: docs
        })
    })
})
app.get('/api/getShippings:firebaseUID', (req, res) => {
    Shipping.find({ firebaseUID: req.params.firebaseUID }, (err, docs) => {
        if (err) return res.json(handleErr(err))
        else {
            return res.json(handleSuccess(docs))
        }
    })
})
app.get('/api/getShipping:id', (req, res) => {
    Shipping.findById(req.params.id, (err, doc) => {
        if (err) res.json({ message: "Failed", err })
        else res.json({
            message: "Success",
            data: doc
        })
    })
})
app.delete('/api/deleteShipping:id', (req, res) => {
    Shipping.findByIdAndDelete(req.params.id, (err, doc) => {
        if (err) res.json({ message: "Failed", err })
        else {
            res.json({
                message: "Success",
                doc
            })
        }
    })
})
app.post('/api/getFilteredShippings', (req, res) => {
    Shipping.find({ firebaseUID: req.body.id, type: req.body.type }, (err, docs) => {
        if (err) res.json({ message: "Failed", err })
        else {
            res.json({
                message: "Success",
                docs
            })
        }
    })
})

app.put('/api/updateShipping:id', (req, res) => {
    const query = Object.assign({}, req.body)
    let id = req.params.id
    Shipping.findByIdAndUpdate(id, query, { new: true }, (err, doc) => {
        if (err) res.json({ message: 'Failed', err })
        else {
            res.json({
                message: "Success",
                doc
            })
        }
    })
})
app.get('/api/getShips', (req, res) => {
    Shipping.find({}, (err, docs) => {
        if (err) res.json({
            message: "Failed",
            err
        })
        res.json({
            message: "Success",
            docs
        })
    })
})



// app.put('/api/addShipping', (req, res) => {
//     Shipping.findOne({ firebaseUID: req.body.firebaseUID }, (err, docs) => {
//         if (err) throw err
//         if (docs === null) {    //insert
//             let data = req.body
//             Shipping.create(data, (err, docs) => {
//                 if (err) res.json(err)
//                 return res.json({
//                     message: "Success",
//                     data: docs
//                 })
//             })
//         }
//         else {           //update
//             let data = req.body
//             Shipping.findOneAndUpdate({ firebaseUID: req.body.firebaseUID }, data, { new: true }, (err, doc) => {
//                 if (err) throw err
//                 return res.json({
//                     message: "Success",
//                     data: doc
//                 })
//             })
//         }
//     })
// })
app.post('/api/addShipping', (req, res) => {
    if (req.body.firebaseUID) {
        let data = req.body
        Shipping.create(data, (err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(doc))
            }
        })
    } else {
        return res.json(handleErr("Valid UID is required"))
    }
})
app.put('/api/updateShipping', (req, res) => {
    if (req.body.id) {
        let data = req.body
        let id = data.id
        Shipping.findByIdAndUpdate(id, data, { new: true }, (err, doc) => {
            if (err) return res.json(handleErr(err))
            else {
                return res.json(handleSuccess(doc))
            }
        })
    } else {
        return res.json(handleErr('Shipping profile ID required'))
    }
})


app.delete('/api/deleteShippingUID', (req, res) => {
    Shipping.findOneAndDelete(req.body.uid, (err, doc) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            data: doc
        })
    })
})

module.exports=app;