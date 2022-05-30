const User = require('../models/User')
const Activity = require('../models/ProfileActivity')
const Listings = require('../models/Listings')
const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
const handleSuccess= require('../HandleFunction/handleSuccess')

 app.get("/api/allUsers", (req, res) => {
    User.find({}, (err, sales) => {
        if (err) {
            res.json({
                message: "fail",

            })
        }
        res.json(sales)
    })
})



app.post('/api/addUser', (req, res) => {
    const user = req.body
    console.log(user)
    if (user.firebaseUID) {
        User.create(user, (err, doc) => {
            if (err) {
                console.log(err)
                res.json(err)
            }
            else {
                console.log(doc)
                Activity.create({ firebaseUID: doc.firebaseUID })
                res.json({
                    message: "Success",
                    user: doc
                })
            }
        })
    }
})
app.put('/api/updateUser', (req, res) => {
    User.findByIdAndUpdate(req.body.id, req.body, { new: true }, (err, doc) => {
        if (err) res.json({ message: "Failed", err })
        else res.json({
            message: 'Success',
            doc
        })
    })
})
app.get('/api/checkUsername:name', (req, res) => {
    User.findOne({ username: req.params.name }, (err, doc) => {
        if (err) return res.json({
            message: "Failed",
            err
        })
        else {
            return res.json({
                message: "Success",
                doc
            })
        }
    })
})
app.put('/api/addImage', (req, res) => {
    const user = req.body
    if (user.profilePic) {
        User.findOneAndUpdate({ firebaseUID: user.firebaseUID }, { $set: { profilePic: user.profilePic } },
            { new: true }, (err, doc) => {
                if (err) throw err
                res.json({
                    message: 'Success',
                    data: doc
                })
            })
    }
})
//block request
app.post("/api/bloclkuser", (req,res) => {
    User.findOneAndUpdate({firebaseUID:req.body.uid},
        {blocked:true},
        {new:true},
        (err,doc)=>{
        if(err){
        res.json(handleErr(err))
        } 
        else 
        {
            return res.json(handleSuccess(doc))
        }
    })
})


//unbllock id
app.post("/api/Unbloclkuser", (req,res) => {
    User.findOneAndUpdate({firebaseUID:req.body.uid},
        {blocked:false},
        {new:true},
        (err,doc)=>{
        if(err){
     res.json(handleErr(err))
        } 
        else 
        {
            return res.json(handleSuccess(doc))
        }
    })
})

app.post('/api/status', (req, res) => {
    User.findOne({ firebaseUID: req.body.firebaseUID }, 'isLoggedIn', (err, data) => {
        if (err) res.json(err)
        res.json({
            message: 'Success',
            data
        })
    })
})


app.put('/api/login', (req, res) => {
    console.log('API call', req.body)
    const firebaseUID = req.body
    User.findOneAndUpdate(firebaseUID, { $set: { isLoggedIn: true } }, { new: true }, (err, doc) => {
        if (err) res.json(err)
        console.log(doc)
        res.json({
            message: 'Success',
            user: doc
        })
    })
})
//become pro

app.put('/api/becomePRO', (req, res)=>{
    if(req.body.firebaseUID){
        let {firebaseUID} = req.body
        User.findOneAndUpdate({ firebaseUID},{isPRO:true},{ new: true}, (err, doc)=>{
            if(err)return res.json(handleErr(err))
            else{
                return res.json(handleSuccess(doc))
            }
        })
    }
})

//Cancel pro

app.put('/api/cancelPro', (req, res)=>{
    if(req.body.firebaseUID){
        let {firebaseUID} = req.body
        User.findOneAndUpdate({ firebaseUID},{isPRO:false},{ new: true}, (err, doc)=>{
            if(err)return res.json(handleErr(err))
            else{
                return res.json(handleSuccess(doc))
            }
        })
    }
    else{
        return res.json(handleErr('User can not be null'))
    }
})
app.post('/api/checkgoogle', (req, res) => {
    let { displayName, email, photoURL, uid } = req.body
    let firebaseUID = uid
    let fName = displayName.split(' ')
    let data = {
        fName: displayName,
        email,
        firebaseUID,
        profilePic: photoURL,
        isLoggedIn: true,
        username: fName[0] + Math.round(Math.random() * 1000)
    }
    console.log(data)
    User.findOne({ firebaseUID }, (err, doc) => {
        if (err) return res.json({
            message: "Failed",
            err
        })
        else if (doc === null) {
            User.create(data, (error, user) => {
                if (error) {
                    console.log(error)
                    return res.json({
                        message: "Failed",
                        error
                    })
                }
                else if (user) {
                    console.log('created=>', doc)
                    Activity.create({ firebaseUID: user.firebaseUID })
                    res.json({
                        message: "Success",
                        doc: user
                    })
                }
            })
        }
        else {
            User.findOneAndUpdate({ firebaseUID }, { $set: { isLoggedIn: true } }, { new: true }, (err, doc) => {
                if (err) res.json(err)
                console.log('exists=>', doc)
                res.json({
                    message: 'Success',
                    doc
                })
            })
        }
    })
})
app.put('/api/fbLogin', (req, res) => {
    console.log(req.body)
    let { firebaseUID } = req.body
    User.findOne({ firebaseUID }, (err, doc) => {
        if (doc === null) {
            User.create(req.body, (error, user) => {
                if (error) {
                    console.log(error)
                    res.json(error)
                }
                if (user) {
                    console.log('created')
                    console.log(user)
                    res.json({
                        message: "Success",
                        doc: user
                    })
                    Activity.create({ firebaseUID: user.firebaseUID })
                }
            })
        }
        else {
            User.findOneAndUpdate({ firebaseUID }, { $set: { isLoggedIn: true } }, { new: true }, (err, doc) => {
                if (err) {
                    console.log(err)
                    res.json(err)
                }
                else {
                    console.log('updated')
                    console.log(doc)
                    res.json({
                        message: 'Success',
                        doc
                    })
                }
            })
        }
    })
})


app.put('/api/logout', (req, res) => {
    const { firebaseUID } = req.body
    User.findOneAndUpdate({ firebaseUID }, { isLoggedIn: false }, { new: true }, (err, doc) => {
        if (err) res.json(err)
        res.json({
            message: 'Success',
            user: doc
        })
    })
})

app.post('/api/replicateListing', (req, res) => {
    if (req.body.email) {
        let data = req.body
        let email = data.email
        User.findOne({ email: email }, (err, doc) => {
            if (err) return res.json({ err, message: "User Error" })
            else {
                if (doc !== null) {
                    let { firebaseUID } = doc
                    data.firebaseUID = firebaseUID
                    Listings.create(data, (err, listing) => {
                        if (err) res.json(err)
                        Activity.findOneAndUpdate({ firebaseUID: firebaseUID }, { $push: { onSale: doc._id } }, { new: true }, (err, docs) => {

                        })
                        res.json({
                            message: 'Success',
                            data: listing
                        })
                    })
                }
                else {
                    return res.json({ message: "User not found" })
                }
            }
        })
    } else {
        return res.json({ message: "User is required" })
    }
})
app.put('/api/addToken', (req, res) => {
    const { token } = req.body
    if (token) {
        User.findOneAndUpdate({ firebaseUID: req.body.firebaseUID }, { $push: { tokens: token } }, { new: true }, (err, doc) => {
            if (err) throw err
            res.json({
                message: "Success",
                doc
            })
        })
    }
    else {
        res.json({
            message: 'Error'
        })
    }
})

app.get('/api/getUserData:firebaseUID', (req, res) => {
    if (req.params.firebaseUID) {
        User.findOne({ firebaseUID: req.params.firebaseUID }, (err, doc) => {
            if (err) {
                res.json({
                    message: "Failed",
                    err
                })
            }
            else {
                res.json({
                    message: "Success",
                    doc
                })
            }
        })
    }
})

app.post('/api/UserStausUpdate', (req, res) => {
    User.findByIdAndUpdate(req.body.id, { $set: { status: req.body.status } }, (err, docs) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            data: docs
        })
    })
})

app.get('/api/getProfile:firebaseUID', (req, res) => {
    User.findOne({ firebaseUID: req.params.firebaseUID }, (err, doc) => {
        if (err) res.json(err)
        let data = doc
        Activity.findOne({ firebaseUID: req.body.firebaseUID }, (err, docs) => {
            if (err) res.json(err)
            let userData = {
                data, docs
            }
            res.json({
                message: 'Success',
                user: userData
            })
        })
    })
})

app.get('/api/getTokens:firebaseUID', (req, res) => {
    User.findOne({ firebaseUID: req.params.firebaseUID }, 'tokens', (err, doc) => {
        if (err) throw err
        res.json({
            message: 'Success',
            doc
        })
    })
})
app.delete('/api/deleteUser', (req, res) => {
    User.findByIdAndRemove(req.body.id, (err, doc) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            data: doc
        })
    })
})
app.delete('/api/deleteListingsUser', (req, res) => {
    User.findOneAndDelete(req.body.uid, (err, doc) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            data: doc
        })
    })
})


app.post('/api/getUsers:page', (req, res) => {
    const query = Object.assign({}, req.body)
    var perPage = 20
    var page = req.params.page || 1
    console.log(query)
    if (query.hasOwnProperty("minPrice")) {
        delete query.minPrice
        delete query.maxPrice
        if (query.hasOwnProperty('last')) {
            let startDate = new Date()
            startDate.setDate(startDate.getDate() - query.last)
            startDate.setHours(0)   // Set the hour, minute and second components to 0
            startDate.setMinutes(0)
            startDate.setSeconds(0)
            User.find({
                trade: query.trade, $or: [{ shippingNational: query.deliverable }, { shippingInternational: query.deliverable }], price: {
                    $lte: req.body.maxPrice,
                    $gte: req.body.minPrice
                },
                createdDate: { $gte: startDate }
            }).skip((perPage * page) - perPage).limit(perPage).exec((err, data) => {

                User.estimatedDocumentCount().exec((err, count) => {
                    if (err) return res.json({ message: err })
                    res.json({
                        data,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            })
        }
        else {
            User.find({
                trade: req.body.trade, $or: [{ shippingNational: req.body.deliverable }, { shippingInternational: req.body.deliverable }], price: {
                    $lte: req.body.maxPrice,
                    $gte: req.body.minPrice
                }
            }).skip((perPage * page) - perPage).limit(perPage).exec((err, data) => {

                User.estimatedDocumentCount().exec((err, count) => {
                    if (err) return res.json({ message: err })
                    res.json({
                        data,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            })
        }
    }
    else {
        User.find(query).skip((perPage * page) - perPage).limit(perPage).exec((err, data) => {
            User.estimatedDocumentCount().exec((err, count) => {
                if (err) return res.json({ message: err })
                res.json({
                    data,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
    }
})

app.post('/api/userSearch', (req, res) => {
    User.find({ fName: { $regex: req.body.name } })
        .limit(20)
        .exec((err, docs) => {
            if (err) res.json({message:"Failed",err})
            res.json({message:"Success",doc:docs})
        });
})


app.get('/api/update', (req, res)=>{
    User.updateMany({},{isPRO:false},{ new: true}, (err, doc)=>{
        if(err)return res.json(handleErr(err))
        return res.json(handleSuccess(doc))
    })
})

app.get("/api/getUser", (req, res) => {
    User.findOne({ _id: req.query.id }, "fName userName", (err, doc) => {
        console.log(doc, req.query.id, "user");
        if (err) {
            res.json({
                message: "Failed",
                err
            });
        } else {
            res.json({
                message: "Success",
                doc
            });
        }
    });
});

//User Signup
// app.post('/api/userSignup',(req,res)=>{
//     if(req.body.email && req.body.firebaseUID && req.body.fName){
//         let data = req.body
//         User.create(data,(err,doc)=>{
//             if(err)return res.json(handleErr(err))
//             else{
//                 return res.json(handleSuccess(doc))
//             }
//         })
//     }
// })

// //Add user profile pic
// app.post('/api/addProfilePic', upload.single('fileData'), (req, res) => {
//     //tested
//     //below code will read the data from the upload folder. Multer will automatically upload the file in that folder with an  autogenerated name
//     fs.readFile(req.file.path, (err, contents) => {
//       if (err) {
//         return res.json(handleErr(err));
//       } else {
//         let { filename} = req.file
//         let {id} = req.body
//         if(id!==undefined && filename!==undefined){
//             User.findByIdAndUpdate(id,{$set:{profilePic:filename}},{new:true}).exec((err,doc)=>{
//                 if(err)return res.json(handleErr(err))
//                 else{
//                     return res.json(handleSuccess(doc))
//                 }
//             })
//         }else{
//             return res.json(handleErr('User details are required'))
//         }

//       }
//     });
//   });

//   //Update User
//   app.put('/api/updateUser',(req,res)=>{
//       if(req.body.id){
//         let {id} = req.body
//         User.findByIdAndUpdate(id,req.body,{new:true}).exec((err,doc)=>{
//             if(err)return res.json(handleErr(err))
//             else{
//                 return res.json(handleSuccess(doc))
//             }
//         })
//       }else{
//           return res.json(handleErr('User can not be null'))
//       }
//   })

  ////
module.exports = app;

































