//Imports
const express = require('express')
var http = require('http')
// require('./models/User')
const app = express()
var server = http.createServer(app);
const process = require('process')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const fileUpload = require("express-fileupload");
const Chats = require('./models/Chats')
const Activity = require('./models/ProfileActivity')
const states = require('./AllStates.json')
// const url = 'mongodb://demo:demo123@ds133137.mlab.com:33137/puroartisan'
const url = 'mongodb://artisancongisgnment:nc48ebQnsxttnycidpqMconsignmenttt03@199.192.25.52:25173/myconsignment'
const port = process.env.PORT || 5000
// auction stuff
const EbayAuthToken = require('ebay-oauth-nodejs-client');
const cors = require('cors')
var request = require('request');
const client = require('socket.io').listen(server).sockets;
var ExclusiveMessegesSchema = require("./models/ExclusiveMessegesModel");
var messegeSchema = require("./models/ChatModal");
// Creating an environment
let clientId = "AebZVgTaxE1-E1ACZ-q5lAqMWoNyM7oIdrqswPk8QVR52TdnfqpZ21xHmkxYnMnrFjvDNiKKgD05OPgB";
let clientSecret = "EFhgAq05cpKqUFVhtM0DG6ccDpPBdmhubjw2h4krMsH-UkG3syNyqnTsUXa2Sk1SMNaXTqmWk7QOoHB-";

// let clientt = new paypal.core.PayPalHttpClient(environment);
app.use(bodyParser.json())  //Body Parser MiddleWare
app.use(express.json())
app.use(cors())
// const admin = require("firebase-admin");
const serviceAccount = require('./myconsignmentlive-firebase-adminsdk-8gptn-c3d511be3b.json');
app.use(express.static("public"));
app.use(
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024123 }
    })
);
var admin = require("firebase-admin");
const fs = require('fs');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});





//PAYPAL CLIENT ID: AebZVgTaxE1-E1ACZ-q5lAqMWoNyM7oIdrqswPk8QVR52TdnfqpZ21xHmkxYnMnrFjvDNiKKgD05OPgB

// stripe.oauth.token({
//     grant_type: 'authorization_code',
//     code: 'ac_GmvHvlusr8MVHY60QuHDMWjuF968yoF6',
//   }).then(function(response) {
//     // asynchronously called
//     var connected_account_id = response.stripe_user_id;
//     console.log(connected_account_id)
//   });
mongoose.connect(url, { useNewUrlParser: true }) //MongoDB connection using Mongoose
var db = mongoose.connection //Mongo Connection Instance
let access_token = ''
async function generateToken() {
    await request.post({
        uri: "https://api.sandbox.paypal.com/v1/oauth2/token",
        headers: {
            "Accept": "application/json",
            "Accept-Language": "en_US",
            "content-type": "application/x-www-form-urlencoded"
        },
        auth: {
            'user': 'AebZVgTaxE1-E1ACZ-q5lAqMWoNyM7oIdrqswPk8QVR52TdnfqpZ21xHmkxYnMnrFjvDNiKKgD05OPgB',
            'pass': 'EFhgAq05cpKqUFVhtM0DG6ccDpPBdmhubjw2h4krMsH-UkG3syNyqnTsUXa2Sk1SMNaXTqmWk7QOoHB-',
        },
        form: {
            "grant_type": "client_credentials"
        }
    }, (error, response, body) => {
        let data = JSON.parse(body)
        access_token = data.access_token
        console.log(access_token)
    });
}
db.on('open', () => {
    console.log('database connected')
    generateToken()
})
function handleErr(err) {
    if (err) return {
        message: "Failed",
        err
    }
}
function handleSuccess(data) {
    if (data) return {
        message: "Success",
        doc: data
    }
}


setInterval(() => {
    generateToken()
}, 14000 * 1000);


//   yahan takk
app.post('/api/sendNotification', (req, res) => {
    let data = req.body
    const message = {
        notification: {
            body: data.notification.message,
            title: data.notification.fName
        },
        tokens: data.tokens
    }
    admin.messaging().sendMulticast(message)
        .then((response) => {
            // Response is a message ID string.
            res.json({ message: 'Success' })
            if (response.failureCount > 0) {
                const failedTokens = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(data.tokens[idx]);
                    }
                });
                console.log('List of tokens that caused failures: ' + failedTokens);
            }
        })
})



app.get('/', function (req, res) {  //HomePage for API
    res.json({ message: 'Welcome' })
})


app.post('/api/googleError', (req, res) => {
    console.log(req.body)
    res.json({
        message: "OK"
    })
})


app.put('/api/getBusiness', (req, res) => {
    if (req.body.firebaseUID) {
        Chats.find({
            firebaseUID: req.body.firebaseUID
        })
    }
})



app.get('/getAcc', (req, res) => {
    stripe.accounts.list(
        { limit: 5 },
        function (err, accounts) {
            // asynchronously called
            res.json({ message: "Success", accounts })
        }
    );
})


app.put('/api/getMessages', (req, res) => {         //get messages of a chat from listing
    Chats.findOne({ sellerUserID: req.body.sellerUserID, firebaseUID: req.body.firebaseUID }, (err, docs) => {
        if (err) res.json(err)
        console.log(docs)
        if (docs !== null) {
            res.json({
                message: "Success",
                data: docs
            })
        }
        else {
            let data = req.body
            Chats.create(data, (err, doc) => {
                if (err) res.json(err)
                if (doc !== null) {
                    Activity.findOneAndUpdate({ firebaseUID: req.body.firebaseUID }, { $push: { Conversations: doc._id } }, { new: true }, (err, res) => console.log('Buyer DOne...', res))
                    Activity.findOneAndUpdate({ firebaseUID: req.body.sellerUserID }, { $push: { Conversations: doc._id } }, { new: true }, (err, res) => console.log('Seller DOne...', res))
                    res.json({
                        message: "Chat created",
                        data: doc
                    })

                }

            })
        }
    })
})

app.put('/api/updatePassword', (req, res) => {
    if (req.body.firebaseUID) {
        admin.auth().updateUser(req.body.firebaseUID, {
            password: req.body.newPassword
        }).then(function (userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            // console.log('Successfully updated user', userRecord.toJSON());
            res.json({
                message: "Success"
            })
        })
            .catch((error) => {
                console.log(error)
                return res.json({
                    message: "Failed",
                    error
                })
            });
    } else {
        return res.json({ message: "Valid FirebaseUID is required" })
    }
})

client.on('connection', (socket) => {
    console.log('Client connected')
    //Exclusive Service


    socket.on('exclusive-new-messege', (message) => {
        ExclusiveMessegesSchema.findByIdAndUpdate(message.chatId, { $push: { messeges: message } }, { new: true }, (err, res) => {
            var length = res.messeges.length;
            var newMess = res.messeges[length - 1];
            client.emit('Exclusive-New-Messege', newMess)
        })



    })
    //Custom Made

    socket.on('new-messege', (data) => {
        console.log('newww msg-->',data)
        messegeSchema.findByIdAndUpdate(data.ChatID, { $push: { messages: data.messages } }, { new: true }, (err, res) => {
            var length = res.messages.length;
            var newMess = res.messages[length - 1]
            console.log('new Messs--->',newMess)
            client.emit('new-Messege', newMess)
        })
    })
    // console.log("made socket connection", socket.id);

    socket.on("count" + socket.handshake.query.auctionID, function (data) {
        client.emit("count" + socket.handshake.query.auctionID, {
            message: "Failed",
            count: socket.client.conn.server.clientsCount
        });
    });
    socket.on("start" + socket.handshake.query.auctionID, function (data) {
        Auction.findOne({ _id: socket.handshake.query.auctionID })
            .populate("userId")
            .exec((err, doc) => {
                if (err) {
                    client.emit("startAuction" + socket.handshake.query.auctionID, {
                        message: "Failed",
                        err
                    });
                } else {
                    console.log("Auction Socket", doc);
                    client.emit("startAuction" + socket.handshake.query.auctionID, {
                        message: "success",
                        doc
                    });
                }
            });
    });

    socket.on("itemDetails" + socket.handshake.query.auctionID, function (data) {
        console.log("item details", socket.handshake.query.auctionID);
        AuctionItems.findOne(
            { used: false, auctionID: socket.handshake.query.auctionID },
            (err, doc) => {
                if (err) {
                    client.emit("item" + socket.handshake.query.auctionID, {
                        message: "Failed",
                        err
                    });
                } else {
                    // console.log("itemDetails else", doc);
                    client.emit("item" + socket.handshake.query.auctionID, {
                        message: "success",
                        doc
                    });
                }
            }
        );
    });

    socket.on("warning" + socket.handshake.query.auctionID, function (data) {
        // console.log("warning");
        client.emit(
            "warning" + socket.handshake.query.auctionID,
            "This Item is About to close"
        );
    });

    socket.on("close" + socket.handshake.query.auctionID, function (data) {
        client.emit(
            "close" + socket.handshake.query.auctionID,
            "Auction Has Ended for Today"
        );
    });

    socket.on("chat" + socket.handshake.query.auctionID, function (data) {
        console.log("chat des", data);
        client.emit("chat" + socket.handshake.query.auctionID, data);
    });

    socket.on("disconnect", function () {
        client.emit("count" + socket.handshake.query.auctionID, {
            message: "Failed",
            count: socket.client.conn.server.clientsCount
        });
    });
    // Create function to send status
    sendStatus = function (s) {
        socket.emit('status', s);
    }

    // Get chats from mongo collection
    // Handle input events
    socket.on('input', (response) => {

        let data = JSON.parse(response)
        let { chatId } = data
        let message = {}
        if (data.hasOwnProperty('text')) {
            message = {
                createdAt: data.createdAt,
                text: data.text,
                senderAvatarLink: data.senderAvatarLink,
                senderID: data.senderID
            }
        }
        else if (data.hasOwnProperty('image')) {
            message = {
                createdAt: data.createdAt,
                image: data.image,
                senderAvatarLink: data.senderAvatarLink,
                senderID: data.senderID
            }
        }
        let firebaseUID = data.senderID
        // Check for name and message
        if (firebaseUID == '' || message == undefined) {
            // Send error status
            return
        } else {
            // Insert message
            Chats.findByIdAndUpdate(chatId, { $push: { messages: message } }, { new: true }, (err, docs) => {
                if (err) console.log('Error: ' + err)
                let newmsg = docs.messages[docs.messages.length - 1]
                newmsg.fName = docs.fName
                let emitter = socket.broadcast
                emitter.emit('Sent', JSON.stringify(newmsg))
            })
        }
    });

    // Handle clear
    socket.on('clear', function (data) {
        // Remove all chats from collection
        Chats.remove({}, function () {
            // Emit cleared
            socket.emit('cleared');
        });
    });
});



app.post('/api/generateToken', (req, res) => {
    request.post({
        uri: "https://api.sandbox.paypal.com/v1/oauth2/token",
        headers: {
            "Accept": "application/json",
            "Accept-Language": "en_US",
            "content-type": "application/x-www-form-urlencoded"
        },
        auth: {
            'user': 'AebZVgTaxE1-E1ACZ-q5lAqMWoNyM7oIdrqswPk8QVR52TdnfqpZ21xHmkxYnMnrFjvDNiKKgD05OPgB',
            'pass': 'EFhgAq05cpKqUFVhtM0DG6ccDpPBdmhubjw2h4krMsH-UkG3syNyqnTsUXa2Sk1SMNaXTqmWk7QOoHB-',
        },
        form: {
            "grant_type": "client_credentials"
        }
    }, function (error, response, body) {
        console.log(JSON.parse(body));
        res.json({ body: JSON.parse(body) })
    });
})

// Auction starts here
// Auction starts here


////////////////////////  Connect Store Routes ///////////////////////

app.get('/openurl', (req, res) => {

    const scopes = ['https://api.ebay.com/oauth/api_scope',
        'https://api.ebay.com/oauth/api_scope/sell.marketing.readonly',
        'https://api.ebay.com/oauth/api_scope/sell.marketing',
        'https://api.ebay.com/oauth/api_scope/sell.inventory.readonly',
        'https://api.ebay.com/oauth/api_scope/sell.inventory',
        'https://api.ebay.com/oauth/api_scope/sell.account.readonly',
        'https://api.ebay.com/oauth/api_scope/sell.account',
        'https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly',
        'https://api.ebay.com/oauth/api_scope/sell.fulfillment',
        'https://api.ebay.com/oauth/api_scope/commerce.identity.readonly',
    ];

    const ebayAuthToken = new EbayAuthToken({
        filePath: 'config.json'
    });


    const url = ebayAuthToken.generateUserAuthorizationUrl('PRODUCTION', scopes);

    res.send(url)

})


app.post('/gettoken', (req, res) => {

    var token = '';
    var refreshToken = '';

    const ebayAuthToken = new EbayAuthToken({
        filePath: 'config.json'
    });

    ebayAuthToken.exchangeCodeForAccessToken('PRODUCTION', req.body.code)
        .then(data => JSON.parse(data))
        .then(data1 => {
            token = data1.access_token;
            refreshToken = data1.refresh_token;
        })
        .then(() => {

            var myDate = new Date();
            var newdate = myDate.toISOString();


            var d = new Date();
            d.setDate(d.getDate() - 80);
            var oldDate = d.toISOString();


            ////listing
            const obj = {
                '@': {
                    'xmlns': 'urn:ebay:apis:eBLBaseComponents'
                },
                'ErrorLanguage': 'en_US',
                'WarningLevel': 'High',
                'StartTimeFrom': oldDate,
                'StartTimeTo': newdate,
                'DetailLevel': 'ItemReturnDescription',
                'Pagination': {
                    'EntriesPerPage': 300
                }
            };



            var content = js2xmlparser.parse('GetSellerListRequest', obj, { declaration: { encoding: 'UTF-8' } });

            var dataInXML = '';

            fetch('https://api.ebay.com/ws/api.dll', {
                method: "Post",
                body: content,
                headers: {
                    'X-EBAY-API-SITEID': 0,
                    'X-EBAY-API-COMPATIBILITY-LEVEL': 967,
                    'X-EBAY-API-CALL-NAME': 'GetSellerList',
                    'X-EBAY-API-IAF-TOKEN': token
                }
            })
                .then(res => res.text())
                .then(res2 => dataInXML = res2)
                .then(() => {
                    const dataInJSON = xml2json.toJson(dataInXML);
                    const dataObj = JSON.parse(dataInJSON);

                    const items = dataObj.GetSellerListResponse.ItemArray.Item;


                    res.send(items);


                })


        })

})


//get my Auctions

app.post('/api/getMyAuctions', (req, res) => {
    console.log(req.body)
    if (req.body.id) {
        Auction.count({}, (err, count) => {
            if (err) return res.json(handleErr(err))
            return Auction.find({
                userId: req.body.id
            })
                .populate("userId")
                .exec((err, docs) => {
                    if (err) {
                        res.json({
                            message: "Failed",
                            err
                        });
                    } else {
                        res.json({
                            message: "Success",
                            docs,
                            count
                        });
                    }
                });
        });
    } else {
        return res.json(handleErr('Valid user _id is required'))
    }
})

//Create states file
app.get('/api/createStates',(req,res)=>{
    let allStates = states.map(state=>{
        return {
            name:state.name,
            states:state.states
        }
    })
    fs.writeFile(__dirname+'/AllStates.json',JSON.stringify(allStates),'utf16le',(err,succ)=>{
        if(err)return res.json(handleErr(err))
        else return res.json(handleSuccess('done'))
    })
    
})

app.use('', require('./Route/UserApi'))
app.use('', require('./Route/PaidListingApi'))
app.use('', require('./Route/AdminApi'))
app.use('', require('./Route/UserApi'))
app.use('', require('./Route/Category'))
app.use('', require('./Route/ListingApi'))
app.use('', require('./Route/ActivityApi'))
app.use('', require('./Route/ListingReport'))
app.use('', require('./Route/DraftApi'))
app.use('', require('./Route/InActiveApi'))
app.use('', require('./Route/ShippingApi'))
app.use('', require('./Route/ExclusiveCategoryApi'))
app.use('', require('./Route/ReportsApi'))
app.use('', require('./Route/FeatureData'))
app.use('', require('./Route/PaymentInfoApi'))
app.use('', require('./Route/IconApi'))
app.use('', require('./Route/OrderApi'))
app.use('', require('./Route/ORderSchemaApi'))
app.use('', require('./Route/ExclusiveUserApi'))
app.use('', require('./Route/ExclusiveServiceApi'))
app.use('', require('./Route/ExclusiveOrderApi'))
app.use('', require('./Route/ExclusiveMessegesApi'))
app.use('', require('./Route/JobBoard'))
app.use('', require('./Route/JobCategoryApi'))
app.use('', require('./Route/MessageApi'))
app.use('', require('./Route/HelpCenterApi'))
app.use('', require('./Route/BlogApi'))
app.use('', require('./Route/SponserApi'))
app.use('', require('./Route/AuctionItemsApi'))
app.use('', require('./Route/PayoutsApi'))
app.use('', require('./Route/NewOrderAPI'))

//Server
server.listen(port, () => {
    console.log('Server listening on PORT: ', port)
})



