var ExclusiveMessegesSchema = require("../models/ExclusiveMessegesModel");
const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')



app.post('/createexclusivechat', (req, res) => {

    var Chats = [];

    ExclusiveMessegesSchema.find({}).then(data => {
        Chats = data.filter(chat => {
            return chat.buyerID === req.body.buyerID && chat.sellerID === req.body.sellerID
        })
    }).then(() => {
        if (Chats.length > 0) {
            res.send(Chats);
        }
        else {
            var newExclusiveChatData = new ExclusiveMessegesSchema({

                messeges: req.body.messeges,
                sellerID: req.body.sellerID,
                sellerProfilePic: req.body.sellerProfilePic,
                sellerName: req.body.sellerName,
                buyerID: req.body.buyerID,
                buyerProfilePic: req.body.buyerProfilePic,
                buyerName: req.body.buyerName,
                ServiceId: req.body.ServiceId
            })

            newExclusiveChatData.save().then(newChat => {
                res.send(newChat)
            })

        }
    })

})

app.get('/readexclusivechat', (req, res) => {
    ExclusiveMessegesSchema.find({}).then(chats => {
        res.send(chats)
    })
})

app.put('/readnewmesseges', (req, res) => {

    const data = ExclusiveMessegesSchema.findById({ _id: req.body.Id })

    var updateMesseges = [];

    data.then(chat => {
        updateMesseges = chat.messeges.map(message => {
            if (message.senderID !== req.body.userID) {
                Object.assign(message, { isRead: true })

                return message
            }

            return message
        })
    }).then(() => {

        ExclusiveMessegesSchema.findByIdAndUpdate(req.body.Id, {
            messeges: updateMesseges
        }, { new: true }).then(data => res.send(data))
    })



})

/////// End Exclusiver Service Chat Routes/////

/////// End Exclusiver Service Order Routes/////
module.exports=app;