
const express = require('express')
const app = express();
const Admin = require('../models/AdminModel')
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess= require('../HandleFunction/handleSuccess')
var crypto = require('crypto');
const hashKey = 'oeihfug3gewuhklnsf3wmqd'
const encrypt = (pass)=>{
    var mykey = crypto.createCipher('aes-128-cbc', hashKey);
    var mystr = mykey.update(pass, 'utf8', 'hex')
    mystr += mykey.final('hex');
    return mystr
}

const decrypt = (pass) => {
    var mykey = crypto.createDecipher('aes-128-cbc', hashKey);
    var mystr = mykey.update(pass, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    return mystr
}

app.get('/getAllAdmin', (req, res) => {

    Admin.find({}, (err, docs) => {
        if (err) 
        { 
            res.send(res.json(handleErr(err)))
       
        }

        else {
            res.send({
                message:"Success",
                doc:docs
            })
      
        }
    })
})


app.post('/CreateAdmin',(req,res) =>{

    var encrypString = encrypt(req.body.password);
    

    var AdminData =new Admin({
    
        Name:req.body.name,
        Email:req.body.email,
        Password:encrypString,
        userType:req.body.usertype

    })
        
    try {
        
    AdminData.save().then(data => {
        res.send(handleSuccess(data))
    })
        
    } catch (error) {
        res.send(handleErr(error))
        
    }
    

})




app.delete('/deleteAdmin', (req, res) => {
    Admin.findByIdAndRemove(req.body.id, (err, doc) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            data: doc
        })
    })
})

 

app.post('/Login',(req,res) =>{
    const encrypString = encrypt(req.body.password)
    Admin.findOne({Email:req.body.email,Password:encrypString},(err,doc)=>{
      if(err)return res.json(handleErr(err))
      else{
          if(doc!==null){
            return res.json(handleSuccess(doc))
          }else{
              return res.json(handleErr('Invalid Password'))
          }
      }

    })

})

module.exports= app;

