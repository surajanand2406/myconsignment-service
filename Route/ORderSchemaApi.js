var OrderSchema = require("../models/OrderModel")
const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess = require('../HandleFunction/handleSuccess')








////////////////////////  Order Routes ///////////////////////

app.get('/readorders', (req, res) => {



    OrderSchema.find({}).then(data => {
        res.send(data)
    })
})


app.post('/createorder', (req, res) => {
    var newOrderData = new OrderSchema({

        SellerName: req.body.SellerName,
        SellerID: req.body.SellerID,
        BuyerName: req.body.BuyerName,
        BuyerID: req.body.BuyerID,
        JobID: req.body.JobID,
        StartDate: req.body.StartDate,
        EndDate: req.body.EndDate,
        Amount: req.body.Amount,
        isComplete: false,

    })

    newOrderData.save().then(data => {
        res.send(data)
    })
})


app.delete('/canceljob', (req, res) => {

    OrderSchema.findByIdAndRemove(req.body.Id, (err, data) => {
        res.send(data)
    })

})


app.delete('/cancelorder', (req, res) => {

    var data = OrderSchema.findById({ _id: req.body.Id })

    data.then(order => {
        var orderEndDate = order.EndDate;
        var currentDate = new Date();

        var days = Math.floor((Date.parse(orderEndDate) - Date.parse(currentDate)) / 86400000);
        var hours = days * 24;

        console.log(days)
        console.log(hours)
    })

})

app.put('/completeorder', (req, res) => {
    if(req.body.id){
        let {id} = req.body
        OrderSchema.findByIdAndUpdate(id,{isComplete:true},{new:true},(err,doc)=>{
            if(err)return res.json(handleErr(err))
            else{
                return res.json(handleSuccess(doc))
            }
        })
    }else{
        return res.json(handleErr('Order id is required'))
    }

})

////////////////////////  End Of Order Routes ///////////////////////

module.exports =app;
