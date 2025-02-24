const mongoose = require('mongoose');
const Schema = mongoose.Schema


const locationSchema = new mongoose.Schema({
    type:{
        type:String,
        default:"Point"
    },
    coordinates:{
        type:[Number],
        index:'2dsphere'
    }
 })
 
const PaidListing= new mongoose.Schema({

        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            default:'USD'
        },
        trade:{
            type:Boolean,
            default:false
        },
        
        //shipping National = true => Domestic
        // shipping international = true => International
        // Both = true => Both
        // both = false = > Pickup only
        shippingNational:{
            type:Boolean,
            default:false
        },
        shippingInternational:{
            type:Boolean,
            default:false
        },
        imageLinks:{
            type:[String]
        },
        geometry:{
            type:locationSchema
        },
        firebaseUID:{
            type:String,
            required:true
        },
        createdDate:{
            type:Date,
            default:Date.now()
        },
        Category:{
            type:String,
            required:true
        },
        subCategory:{
            type:String,
            required:true
        },
        accountID:{
            type:String
        },
        listingID:{
            type:String,
            default:"listing"+Math.round(Math.random()*10000000)
        },
      shippingID:{
        type:Schema.Types.ObjectId,
        ref:"shippings"
    },
    isPRO:{
        type:Boolean,
        default:false
    },
    Status:
{
    type:String
}


});

module.exports = mongoose.model('PaidListing',PaidListing);