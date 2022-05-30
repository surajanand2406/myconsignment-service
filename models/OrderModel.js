const mongo = require("mongoose");
const Schema = mongo.Schema;

const OrdersModal =Schema({

   SellerName:String,
   SellerID:String,
   BuyerName:String,
   BuyerID:String,
   JobID:String,
   StartDate:String,
   EndDate:String,
   Amount:Number,
   isComplete:Boolean,


});

module.exports = mongo.model('OrdersData',OrdersModal);