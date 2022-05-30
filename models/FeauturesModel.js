const mongoose = require('mongoose');
const FeatureModelSchema = new mongoose.Schema({
  
  Name:{
      type:String
  },
  ListingId:
  {
      type:String,
  },
 

});

module.exports = mongoose.model('FeatureModelSchema', FeatureModelSchema);