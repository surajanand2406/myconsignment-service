const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email:{
      type:String,
      default:"no_email@app.com"
  },
  fName:{
      type:String,
      required:[true,'Full Name is required']
  },
  profilePic:{
      type:String
  },
  firebaseUID:{
      type:String,
      unique:true
  },
  isLoggedIn:{
      type:Boolean,
      default:false
  },
  createdDate:{
      type:Date,
      default:Date.now()
  },
  tokens:{
      type:[String]
  },
  country:{
      type:String
  },
  username:{
      type:String,
      unique:true
  },
  isPRO:{
      type:Boolean,
      default:false
  },
  blocked:{
      type:Boolean,
      default:false
  },
  signinMethod:{        //custom, google, facebook, apple
      type:String,
      default:"custom"
  }

});
UserSchema.index({name:'text','fName':"text"})
module.exports = mongoose.model('Users', UserSchema);