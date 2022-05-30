const mongo = require("mongoose");
const Schema = mongo.Schema;

const JobCategoryModal =Schema({

   Name:String,
   Image:String


});

module.exports = mongo.model('JobCategoryData',JobCategoryModal);