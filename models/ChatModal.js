const mongo = require('mongoose');
const Schema = mongo.Schema;

const MessageSchema =Schema({
    Text:String,
    Image:String,
    Proposal:{
      Price:String,
      Shipping:String,
      proposalDetail:String,
      jobId:String
    },
    senderAvatarLink:String,
    senderID:{
        type:String,
        required:true
    }
},{timestamps:true})

const ChatsSchema = Schema({
    messages:{
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
    isRead:{
      type:Boolean
    }
});

module.exports = mongo.model('ChatsData', ChatsSchema);