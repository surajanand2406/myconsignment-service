const mongo = require('mongoose');
const Schema = mongo.Schema;

const MessageSchema =Schema({
    Text:String,
    Image:String,
    File:String,
    Proposal:{
      Price:Number,
      Shipping:String,
      proposalDetail:String,
    },
    senderAvatarLink:String,
    senderID:String,
    senderName:String,
    isRead:Boolean,
    chatId:String
},{timestamps:true})

const ExclusiveMessegesModel = Schema({
    messeges:{
    type:[MessageSchema]
    },
    sellerID:{
        type:String
    },
    sellerProfilePic:{
        type:String,
        default:'https://placeimg.com/140/140/any'
    },
    sellerName:{       
        type:String
    },
    buyerID:{
      type:String,
      default:'https://placeimg.com/140/140/any'
    },
    buyerProfilePic:{
        type:String,
        default:'https://placeimg.com/140/140/any'
    },
    buyerName:{         
        type:String
    },
    ServiceId:String
});

module.exports = mongo.model('ExclusiveMessegesData', ExclusiveMessegesModel);