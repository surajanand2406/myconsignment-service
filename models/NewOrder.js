const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    fName:{
        type:String
    },
    lName:{
        type:String
    },
    addressLine1:{
        type:String
    },
    addressLine2:{
        type:String
    },
    country:{
        type:String
    },
    state:{
        type:String
    },
    zipCode:{
        type:String
    }
})

const orderSchema = new mongoose.Schema({
 buyer:{       //User who is ordering
     type:mongoose.Schema.Types.ObjectId,
     ref:"Users"
 },
 seller:{        
    type:mongoose.Schema.Types.ObjectId,
    ref:"Users"
 },
 listing:{        
    type:mongoose.Schema.Types.ObjectId,
    ref:"Listings"
 },
 createdDate:{
     type:Date,
     default:Date.now()
 },
 totalCost:{     //entered by driver
    type:Number,
    min:0
 },
 orderId:{
     type:String,
     unique:true
 },
 shippingAddress:addressSchema
});
module.exports = mongoose.model('neworders', orderSchema);