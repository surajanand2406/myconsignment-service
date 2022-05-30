const mongoose = require('mongoose');

const serviceReviews = new mongoose.Schema({
    buyerName:String,
    buyerID:String,
    buyerImage:String,
    buyerCountry:String,
    serviceID:String,
    Date:String,
    Messege:String,
    Ratings:Number

})

const ExclusiveServicesSchema = new mongoose.Schema({
   ServiceTitle:String,
   Price:Number,
   Category:String,
   ServiceDescription:String,
   Images:Array,
   Date:String,
   totalRatings:Number,
   Reviews:[serviceReviews],
   userName:String,
   userID:String,
   userCountry:String,
   userDetail:String,
   userImage:String
});

module.exports = mongoose.model('ExclusiveServicesData', ExclusiveServicesSchema);