const mongoose = require('mongoose');
const Schema = mongoose.Schema
const payoutSchema = new mongoose.Schema({
  receiver:{
      type:Schema.Types.ObjectId,
      ref:"Users"
  },
  sender:{
      type:Schema.Types.ObjectId,
      ref:"Users"
  },
  amount:{
      type:Number
  },
  payoutDate:{
      type:Date,
      require:true
  },
  status:{
      type:Boolean,
      default:false
  }

});
module.exports = mongoose.model('payouts', payoutSchema);