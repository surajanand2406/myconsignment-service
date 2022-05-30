const mongo = require("mongoose");
const Schema = mongo.Schema;

const ExclusiveServiceModal =Schema({

   Name:String,
});

module.exports = mongo.model('ExclusiveServiceModal',ExclusiveServiceModal);