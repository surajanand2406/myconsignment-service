
const express = require('express')
const app = express();
const PaidListingSchema=require('../models/PaidListing');
const handleErr =require('../HandleFunction/HandleErr')
const handleSuccess =require( '../HandleFunction/handleSuccess');



app.get('/readPaidListing', (req, res) => {

    PaidListingSchema.find({}, (err, docs) => {
        if (err) return res.json(handleErr)
        else {
            res.send({
                message:"get data Successfully",
                doc:docs
            })
      
        }
    })
})



app.post('/addPaidListing', (req, res) => {

    
    var PaidData = new PaidListingSchema({
    Title:req.body.title,
    Description:req.body.description,
    Price:req.body.price,
    Currency:req.body.currency,
    Trade:req.body.trade,
    shippingNational:req.body.shippingNational,
    shippingInternational:req.body.shippingInternational,
    ImageLink:req.body.ImageLink,
    Category:req.body.category,
    subCategory:req.body.subCategory,
    accountID:req.body.accountID,
    listingID:req.body.listingID,
    shipping:req.body.shipping,
    isPRO:req.body.isPRO,
    Status:req.body.Status

    })


    PaidData.save().then(data => {
        console.log("data===>",data)
        res.send(data)
    })

})

module.exports=app;



