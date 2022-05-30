const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
  Name:{
    type:String,
    required:true
  },
  Email:{
      type:String,
      required:true
  },
  Password:
  {
      type:String,
      required:true,
  },
  userType:
  {
      type:String,
      required:true
  }

});

module.exports = mongoose.model('Admin', AdminSchema);