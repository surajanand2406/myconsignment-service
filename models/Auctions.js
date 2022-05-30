const mongoose = require("mongoose");
const Auction = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
  },
  image: {
    type: String
  },
  userId: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  status: {
    type: Number,
    default: 0
  },
  currentItem: {
    type: String,
  },
  generatedOn: {
    type: Number,
    default: new Date().getTime()
  },
  lastAuction: {
    type: Number,
  },
  streamId: {
    type: String,
  },
  playBackId: {
    type: String
  },
  bidTime: {
    type: Number,
    default: 10
  },
  type: {
    type: String,
    default: "Timed"
  }
});

module.exports = mongoose.model("auctions", Auction);
