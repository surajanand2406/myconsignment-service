const mongo = require("mongoose");
const Schema = mongo.Schema;

const SponsorModel =Schema({

    Title:String,
    TargetedAmount:Number,
    Donation:Number,
    RequiredAmount:Number,
    GraphData:Array,
    Comments:Array,
    Date:String

});

module.exports = mongo.model('SponsorData',SponsorModel);