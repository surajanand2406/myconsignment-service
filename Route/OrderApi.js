const express = require('express')
const app = express()
const Orders = require('../models/Orders')
const handleErr = require('../HandleFunction/HandleErr')
app.get("/api/AllSales", (req, res) => {
    Orders.find({}, (err, sales) => {
        if (err) {
            res.json({
                message: "fail",

            })
        }
        res.json(sales)
    })
})






app.post('/api/getOrders', (req, res) => {
    Orders.find({}, (err, sales) => {
        if (err) {
            res.json({
                message: "failed",

            })
        }
        res.json(sales)
    })
})
app.delete('/api/deletOrder', (req, res) => {
    Orders.findByIdAndRemove(req.body.id, (err, doc) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            data: doc
        })
    })
})








app.post("/api/addOrder", (req, res) => {

    Orders.create(req.body, (err, doc) => {
        if (err) res.json({ err })
        res.json({
            message: "Success",
            data: doc
        })
    })



})



module.exports=app;