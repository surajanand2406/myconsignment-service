const mongoose = require("mongoose");

const Images = new mongoose.Schema({
  path: {
    type: String
  }
});

const finalBid = new mongoose.Schema({
  userId: {
    type: String
  },
  bid: {
    type: String
  }
});

const AuctionItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startingBid: {
    type: String,
    required: true
  },
  finalBid: {
    type: finalBid
  },
  images: {
    type: [Images]
  },
  auctionID: {
    type: String,
    required: true
  },
  generatedOn: {
    type: Number,
    default: new Date().getTime()
  },
  used: {
    type: Boolean,
    default:false
  }
});

module.exports = mongoose.model("auctionItem", AuctionItemSchema);