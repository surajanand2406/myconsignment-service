const express = require('express')
const app = express()
const Listings = require('../models/Listings')
const User = require('../models/User')
const NewOrder = require('../models/NewOrder')
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess = require('../HandleFunction/handleSuccess')
const uid = require('uid').uid

//Create order
app.post('/api/createNewOrder',(req,res)=>{
    if(req.body.buyer && req.body.seller && req.body.listing && req.body.totalCost!==undefined){
        let { buyer,seller,listing,totalCost,shippingAddress } = req.body
        let order = {
            buyer,
            seller,
            listing,
            totalCost,
            shippingAddress,
            totalCost
        }
        order.orderId = uid(12)
        NewOrder.create(order,(err,doc)=>{
            if(err)return res.json(handleErr(err))
            else{
                NewOrder.populate(doc,[
                    {
                        path:"buyer",
                        model:"Users"
                    },
                    {
                        path:"seller",
                        model:"Users"
                    },
                    {
                        path:"listing",
                        model:"Listings"
                    }
                ],(error,newOrder)=>{
                    if(error)return res.json(handleErr(error))
                    else{
                        return res.json(handleSuccess(newOrder))
                    }
                })
            }
        })
    }else{
        return res.json(handleErr('Order details are required'))
    }
})

//Get my orders
app.post('/api/myOrders',(req,res)=>{
    if(req.body.seller){
        let {seller} = req.body
        NewOrder.find({seller}).sort({createdDate:-1}).populate([
            {
                path:"buyer",
                model:"Users"
            },
            {
                path:"seller",
                model:"Users"
            },
            {
                path:"listing",
                model:"Listings"
            }
        ]).exec((err,docs)=>{
            if(err)return res.json(handleErr(err))
            else{
                return res.json(handleSuccess(docs))
            }
        })
    }else{
        return res.json(handleErr('User is required'))
    }
})

//Get my purchases
app.post('/api/myPurchases',(req,res)=>{
    if(req.body.buyer){
        let {buyer} = req.body
        NewOrder.find({buyer}).sort({createdDate:-1}).populate([
            {
                path:"buyer",
                model:"Users"
            },
            {
                path:"seller",
                model:"Users"
            },
            {
                path:"listing",
                model:"Listings"
            }
        ]).exec((err,docs)=>{
            if(err)return res.json(handleErr(err))
            else{
                return res.json(handleSuccess(docs))
            }
        })
    }else{
        return res.json(handleErr('User is required'))
    }
})

//Get all orders
app.post('/api/getAllNewOrders:page',(req,res)=>{
    const page = req.params.page || 1
    const perPage = 20
    NewOrder.find({}).skip((perPage * page) - perPage).limit(perPage).populate([
        {
            path:"buyer",
            model:"Users"
        },
        {
            path:"seller",
            model:"Users"
        },
        {
            path:"listing",
            model:"Listings"
        }
    ]).exec((err, data) => {
        NewOrder.estimatedDocumentCount().exec((err, count) => {
            if (err) return res.json(handleErr(err))
            else{
                let response = {
                    data,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    total:count
                }
                return res.json(handleSuccess(response))
            }
        })
    })
})
module.exports = app