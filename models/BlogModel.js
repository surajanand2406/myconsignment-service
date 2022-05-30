const mongo = require('mongoose');
const Schema = mongo.Schema;

const BlogDetailSchema =Schema({
    Title:String,
    Image:String,
    description:String,
    date:String,
    comments:[{
        userName:String,
        userImage:String,
        comment:String
    }]
})


const BlogSchema = Schema({
    Category:String,
    Blog:[BlogDetailSchema]
});

module.exports = mongo.model('BlogData', BlogSchema);