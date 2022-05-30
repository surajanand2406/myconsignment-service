const express = require('express')
const app = express()
const stripe = require("stripe")('sk_test_HoPdfcNw4Z50hxhA5wbEeT62002SCwGUWP');
const PaymentInfo = require('../models/PaymentInfo')
const ExternalAccount = require('../models/ExternalAccounts')



app.get('/api/getPaymentInfo:firebaseUID', (req, res) => {
    PaymentInfo.findOne({ firebaseUID: req.params.firebaseUID }, (err, doc) => {
        if (doc !== null) {
            console.log(doc)
            res.json({
                message: "Success",
                doc
            })
        }

        else {
            res.json({ message: "Failed" })
        }
    })
})


app.post('/paym', (req, res) => {
    var collfeefloat = req.body.Category === 'Jobs & Services' ? req.body.amount * 0.2 : req.body.amount * 0.1
    var collfee = Math.ceil(collfeefloat)
    stripe.customers.create({
        email: req.body.token.email,   //khareed rha hai..
    }).then((customer) => {
        return stripe.charges.create({
            amount: req.body.amount,
            currency: "usd",
            source: req.body.token.id,
            application_fee_amount: collfee,   //platform pese
        }, {
            stripe_account: req.body.accountID,  //jis ko bhej rahe hain...
        }).then(function (charge) {
            let data = Object.assign({}, req.body)
            delete data.token
            Orders.create(data, (err, doc) => {
                if (err) {
                    console.log(err)
                    res.json({ message: "Failed", err })
                }
                else {
                    console.log(doc)
                    Activity.findOneAndUpdate({ firebaseUID: req.body.buyerFirebaseUID }, { $push: { Purchases: doc._id } }, { new: true }, (err, res) => console.log('Buyer DOne...', res))
                    Activity.findOneAndUpdate({ firebaseUID: req.body.sellerFirebaseUID }, { $push: { Orders: doc._id } }, { new: true }, (err, res) => console.log('Seller DOne...', res))
                    res.json({
                        message: "Success",
                        doc,
                        charge
                    })
                }
            })
        });
    });
})



app.get('/tos', (req, res) => {

    stripe.accounts.update('acct_1Eat1XIMeTEWEPkW', {
        tos_acceptance: {
            ip: req.connection.remoteAddress,
            date: Math.floor(Date.now() / 1000)
        }
    })
    res.json({
        message: "Success"
    })
})
app.post('/payoutexample', (req, res) => {
    // let requestBody = {
    //     "sender_batch_header": {
    //       "recipient_type": "EMAIL",
    //       "email_message": "SDK payouts test txn",
    //       "note": "Enjoy your Payout!!",
    //       "sender_batch_id": "Test_sdk_1",
    //       "email_subject": "This is a test transaction from SDK"
    //     },
    //     "items": [{
    //       "note": "Your Payment!",
    //       "amount": {
    //         "currency": "USD",
    //         "value": "1.00"
    //       },
    //       "receiver": "hamxa1331@gmail.com",
    //       "sender_item_id": "Test_txn_1"
    //     }]
    //   }

    // // Construct a request object and set desired parameters
    // // Here, PayoutsPostRequest() creates a POST request to /v1/payments/payouts
    // let request = new paypal.payouts.PayoutsPostRequest();
    // request.requestBody(requestBody);

    // // Call API with your client and get a response for your call
    // let createPayouts  = async ()=>{
    //         let response = await clientt.execute(request);

    //         console.log(`Response: ${JSON.stringify(response)}`);
    //         res.json({message:"Success"})
    //         // If call returns body in response, you can get the deserialized version from the result attribute of the response.
    //        console.log(`Payouts Create Response: ${JSON.stringify(response.result)}`);
    // }
    // createPayouts();
    request.post({
        uri: "https://api.sandbox.paypal.com/v1/payments/payouts",
        headers: {
            "Accept": "application/json",
            "Accept-Language": "en_US",
            "content-type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer "
        },
        form: {
            "grant_type": "client_credentials"
        }
    }, function (error, response, body) {
        console.log(JSON.parse(body));
        res.json({ body: JSON.parse(body) })
    });
})
app.post('/createacc', (req, res) => {
    let data = req.body
    for (let c in data) {
        if (data[c] === '') {
            res.json({
                message: "Failed",
            })
            return
        }
    }
    let dateofbirth = data.dob.split('/')
    if (data.type === 'Individual') {
        let account = {
            default_currency: "usd",
            type: "custom",
            country: data.country,
            requested_capabilities: ["card_payments"],
            business_type: "individual",
            individual: {
                first_name: data.first_name,
                last_name: data.last_name,
                gender: data.gender,
                id_number: data.ssn,
                email: data.email,
                phone: data.phone,
                dob: {
                    month: dateofbirth[0],
                    day: dateofbirth[1],
                    year: dateofbirth[2]
                },
                address: {
                    line1: data.line1,
                    state: data.state,
                    postal_code: data.postal_code,
                    city: data.city,
                    country: data.country
                }
            },
            business_profile: {
                url: data.businesweb,
                mcc: data.mcc
            },
            tos_acceptance: {
                ip: req.connection.remoteAddress,
                date: Math.floor(Date.now() / 1000)
            }
        }
        stripe.accounts.create(account, function (err, response) {
            if (err) {
                console.log(err)
                res.json({
                    message: "Failed"
                })
            }
            else {
                let profile = {
                    businessType: "individual",
                    first_name: data.first_name,
                    last_name: data.last_name,
                    gender: data.gender,
                    ssn: data.ssn,
                    email: data.email,
                    phone: data.phone,
                    address: {
                        line1: data.line1,
                        state: data.state,
                        postal_code: data.postal_code,
                        city: data.city,
                        country: data.country,
                        mcc: data.mcc
                    },
                    dob: {
                        month: dateofbirth[0],
                        day: dateofbirth[1],
                        year: dateofbirth[2]
                    },
                    firebaseUID: data.firebaseUID,
                    accountID: response.id,
                    businesweb: data.businesweb
                }
                PaymentInfo.create(profile, (err, doc) => {
                    if (err) throw err
                    console.log(doc)
                    res.json({
                        message: "Success",
                        doc
                    })
                })
            }
        });
    }
})
app.post('/person', (req, res) => {
    stripe.accounts.createPerson(
        'acct_1EaXXRCEW9pT8D0d',
        req.body,
        function (err, person) {
            if (err) throw err
            res.json({
                message: "Success",
                person
            })
        }
    );
})
app.post('/createexternalacc', (req, res) => {
    /*
        country: '',
        currency: '',
        account_holder_name: '',
        account_holder_type: '',
        routing_number: '',
        account_number:''
    */
    let data = {
        routing_number: req.body.routing_number,
        account_holder_name: req.body.account_holder_name,
        account_holder_type: req.body.account_holder_type,
        currency: "usd",
        country: 'US',
        account_number: req.body.account_number
    }
    stripe.tokens.create({
        bank_account: data
    }, function (err, token) {
        if (err) console.log(err)
        else {
            stripe.accounts.createExternalAccount(
                req.body.accountID,
                {
                    external_account: token.id,
                },
                function (err, bank_account) {
                    // asynchronously called
                    if (err) res.json({ message: "Falied" })
                    else {
                        console.log(bank_account)
                        let acct = {
                            ...data,
                            firebaseUID: req.body.firebaseUID
                        }
                        ExternalAccount.create(acct, (err, doc) => {
                            res.json({
                                message: "Success",
                                doc
                            })
                        })
                    }
                }
            );
        }
    });
})

app.delete('/api/deletePaymentInfoUID', (req, res) => {
    PaymentInfo.findOneAndDelete(req.body.uid, (err, doc) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            data: doc
        })
    })
})


module.exports =app;