const mongo = require('mongoose');
const Schema = mongo.Schema;

const ExclusiveOrderModel = Schema({

    sellerID:{
        type:String
    },
    sellerProfilePic:{
        type:String,
    },
    sellerName:{       
        type:String
    },
    buyerID:{
      type:String,
    },
    buyerProfilePic:{
        type:String,
    },
    buyerName:{         
        type:String
    },
    startTime:String,
    endTime:String,
    Price:Number,
    Days:String,
    orderDetail:String,
    ServiceId:String,
    isComplete:Boolean
});

module.exports = mongo.model('ExclusiveOrderData', ExclusiveOrderModel);