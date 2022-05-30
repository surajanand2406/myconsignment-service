// const Chats = require('../models/Chats')
// const express = require('express')
// const app = express()
// const handleErr = require('../HandleFunction/HandleErr')

// app.put('/api/getBusiness', (req, res) => {
//     if (req.body.firebaseUID) {
//         Chats.find({
//             firebaseUID: req.body.firebaseUID
//         })
//     }
// })

// // app.get('/api/getChats',(req,res)=>{
// //     const chatIds = req.body
// //     let chats = []
// //     chatIds.forEach(id=>{
// //         Chats.findById(id,(err,docs)=>{
// //             if(err)return err
// //             chats.push(docs)
// //         })
// //     })
// //     if(chats.length>0){
// //         res.json({
// //             message:"Success",
// //             data:chats
// //         })
// //     }
// //     else{
// //         res.json({
// //             message:"No chat found"
// //         })
// //     }

// // })



// // app.post('/api/getChatMessages',(req,res)=>{
// //     Chats.findById(req.body.chatId,(err,doc)=>{
// //         if(err)throw err
// //         res.json({
// //             message:"Success",
// //             data:doc
// //         })
// //     })
// // })

// app.put('/api/getMessages', (req, res) => {         //get messages of a chat from listing
//     Chats.findOne({ sellerUserID: req.body.sellerUserID, firebaseUID: req.body.firebaseUID }, (err, docs) => {
//         if (err) res.json(err)
//         console.log(docs)
//         if (docs !== null) {
//             res.json({
//                 message: "Success",
//                 data: docs
//             })
//         }
//         else {
//             let data = req.body
//             Chats.create(data, (err, doc) => {
//                 if (err) res.json(err)
//                 if (doc !== null) {
//                     Activity.findOneAndUpdate({ firebaseUID: req.body.firebaseUID }, { $push: { Conversations: doc._id } }, { new: true }, (err, res) => console.log('Buyer DOne...', res))
//                     Activity.findOneAndUpdate({ firebaseUID: req.body.sellerUserID }, { $push: { Conversations: doc._id } }, { new: true }, (err, res) => console.log('Seller DOne...', res))
//                     res.json({
//                         message: "Chat created",
//                         data: doc
//                     })

//                 }

//             })
//         }
//     })
// })
