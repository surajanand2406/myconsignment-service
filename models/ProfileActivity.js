const mongoose = require('mongoose');
const Schema = mongoose.Schema
const ActivitySchema = new mongoose.Schema({
onSale:[{type:Schema.Types.ObjectId,ref:"Listings"}],
Favorites:[{type:Schema.Types.ObjectId,ref:"Listings"}],
Conversations:[{type:Schema.Types.ObjectId,ref:"Chats"}],
firebaseUID:{
    type:String,
    required:true
},
Orders:[{type:Schema.Types.ObjectId,ref:"Listings"}],
Purchases:[{type:Schema.Types.ObjectId,ref:"Listings"}]
});

module.exports = mongoose.model('Activity', ActivitySchema);