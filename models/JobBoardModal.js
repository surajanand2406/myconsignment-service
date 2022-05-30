const mongo = require("mongoose");
const Schema = mongo.Schema;

const JobBoardModel =Schema({

   BuyerEmail:String,
   BuyerName:String,
   JobTitle:String,
   JobCategory:String,
   Budget:Number,
   MaterialDes:String,
   Size:String,
   Shipping:String,
   PostedDate:String,
   JobDetail:String,
   Image:String,
   firebaseUID:String


});

module.exports = mongo.model('JobBoardData',JobBoardModel);