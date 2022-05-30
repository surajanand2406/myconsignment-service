const mongo = require('mongoose');
const Schema = mongo.Schema;

const QuestionSchema =Schema({
    question:String,
    description:String
},{timestamps:true})


const HelpCenterSchema = Schema({
    Topic:String,
    Questions:[QuestionSchema]
});

module.exports = mongo.model('HelpCenterData', HelpCenterSchema);