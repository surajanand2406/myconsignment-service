const FeatureModelSchema =require('../models/FeauturesModel');
const express = require('express')
const app = express()
const moment =require('moment')
const handleErr = require('../HandleFunction/HandleErr')
app.post('/PostFeatureData',(req,res)=>{

    let date=moment().format('L');
    FeatureModelSchema.count({},(err,doc) =>{
        if(err )
        {
            res.json(handleErr(err))
        }
        else if(doc>32)
        {
            res.send({message:"Sorry slot not available"})
        }
    else
        {
            let FeatureData=new FeatureModelSchema({
                Name:req.body.name,
                ListingId:req.body.listingid
            })
            FeatureData.save().then((data)=>{
                res.send({message:"data Save Successfully",doc:data})
            })

        }
    })
    

})


app.get('/GetFeatureData',(req,res)=>{
    FeatureModelSchema.find({},(err,doc)=>{
        if(err)
        {
            res.json(handleErr(err))
        }
        else {
            res.json(handleSuccess(doc))
        }
    })
})


module.exports=app;