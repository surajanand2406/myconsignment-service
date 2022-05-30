const mongoose = require('mongoose');
const OrdersSchema = new mongoose.Schema({
    title:{
        type:String
    },
    description:{
        type:String
    },
    amount:{
        type:Number
    },
    listingID:{
        type:String,
        required:true
    },
    sellerFirebaseUID:{
        type:String,
        required:true
    },
    createdDate:{
        type:Date,
        default:Date.now()
    },
    Category:{
        type:String
    },
    sellerName:{
        type:String
    },
    buyerFirebaseUID:{
        type:String
    },
    buyerName:{
        type:String
    },
    shippingAddress:{
        type:String
    },
    imageLink:{
        type:String
    }
});
module.exports = mongoose.model('Orders', OrdersSchema);