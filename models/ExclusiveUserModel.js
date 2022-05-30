const mongo = require("mongoose");
const Schema = mongo.Schema;

const ExclusiveUserModel =Schema({
   BusinessName:String,
   Email:String,
   Contact:Number,
   Category:String,
   Country:String,
   BusinessDetail:String,
   Image:String,
   Password:String,
   isRegistered:Boolean,
   firebaseUID:String
});

module.exports = mongo.model('ExclusiveUserData',ExclusiveUserModel);