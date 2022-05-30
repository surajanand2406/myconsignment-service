
const AuctionItems = require("../models/AuctionItems");
const Auction = require("../models/Auctions");
const express = require('express')
const app = express()
const handleErr = require('../HandleFunction/HandleErr')
const CronJob = require("cron").CronJob;


app.post("/api/addAuction", (req, res) => {

    const Auctions = new Auction(req.body);
    Auctions.save()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log("err", err);
            res.json(err);
        });
});

app.get("/api/getAuction", (req, res) => {
    console.log("auction working");
    Auction.findOne({ _id: req.query.id }, (err, doc) => {
        console.log(err, "ERROR ERROR");
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

app.get("/api/getAuctionById", (req, res) => {
    Auction.findById(req.query.id , (err, doc) => {
        console.log('sdhafoi')
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
app.get("/api/getAuctionByUserId", (req, res) => {
    Auction.findOne({userId:req.query.id} , (err, doc) => {
        console.log('sdhafoi')
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


app.get("/api/getItemById", (req, res) => {
    AuctionItems.findOne({ _id: req.query.id }, (err, doc) => {
        console.log(doc, req.query.id);
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

app.get("/api/getItemsWon", (req, res) => {
    console.log(req.query.id);
    AuctionItems.find({ used: true, "finalBid.userId": req.query.id })
        .populate("auctionID")
        .exec((err, doc) => {
            // let arr =
            if (err) {
                res.json({
                    message: "Failed",
                    err
                });
            } else {
                res.json({
                    message: "Success",
                    // doc
                    doc: doc.filter(v => v.finalBid && v.finalBid.userId === req.query.id)
                });
            }
        });
});

app.get("/api/getAllAuctions", (req, res) => {
    // var perPage = 10;
    // var page = req.params.page || 1;
    // let date = new Date();
    // var startTime = new Date(date.getTime() - 10 * 60 * 1000);
    // var nextWeek = new Date(date.getTime() + 10 * 24 * 60 * 60 * 1000);

    // let filter_str =
    //     startTime.getFullYear() +
    //     "-" +
    //     ((startTime.getMonth() + 1).toString().length === 1
    //         ? "0" + (startTime.getMonth() + 1)
    //         : startTime.getMonth() + 1) +
    //     "-" +
    //     (startTime.getDate().toString().length === 1
    //         ? "0" + startTime.getDate()
    //         : startTime.getDate()) +
    //     " " +
    //     startTime.getHours() +
    //     ":" +
    //     (startTime.getMinutes().toString().length === 1
    //         ? "0" + startTime.getMinutes()
    //         : startTime.getMinutes());
    // let filter_str_limit =
    //     nextWeek.getFullYear() +
    //     "-" +
    //     ((nextWeek.getMonth() + 1).toString().length === 1
    //         ? "0" + (nextWeek.getMonth() + 1)
    //         : nextWeek.getMonth() + 1) +
    //     "-" +
    //     (nextWeek.getDate().toString().length === 1
    //         ? "0" + nextWeek.getDate()
    //         : nextWeek.getDate()) +
    //     " " +
    //     nextWeek.getHours() +
    //     ":" +
    //     (nextWeek.getMinutes().toString().length === 1
    //         ? "0" + nextWeek.getMinutes()
    //         : nextWeek.getMinutes());
    // console.log("yare yare des", filter_str, filter_str_limit);

    // Auction.count({}, (err, count) => {
    //     return Auction.find()
    //         .populate("userId")
    //         .and([
    //             {
    //                 $or: [
    //                     { startTime: { $gte: filter_str, $lte: filter_str_limit } },
    //                     { status: 1 }
    //                 ]
    //             }
    //         ])
    //         .exec((err, doc) => {
    //             console.log(doc, err);
    //             if (err) {
    //                 res.json({
    //                     message: "Failed",
    //                     err
    //                 });
    //             } else {
    //                 res.json({
    //                     message: "Success",
    //                     doc,
    //                     count
    //                 });
    //             }
    //         });
    // });
    let date = new Date();
    var startTime = new Date(date.getTime() - 10 * 60 * 1000);
    var nextWeek = new Date(date.getTime() + 10 * 24 * 60 * 60 * 1000);
  
    let filter_str =
      startTime.getFullYear() +
      "-" +
      ((startTime.getMonth() + 1).toString().length === 1
        ? "0" + (startTime.getMonth() + 1)
        : startTime.getMonth() + 1) +
      "-" +
      (startTime.getDate().toString().length === 1
        ? "0" + startTime.getDate()
        : startTime.getDate()) +
      " " +
      startTime.getHours() +
      ":" +
      (startTime.getMinutes().toString().length === 1
        ? "0" + startTime.getMinutes()
        : startTime.getMinutes());
    let filter_str_limit =
      nextWeek.getFullYear() +
      "-" +
      ((nextWeek.getMonth() + 1).toString().length === 1
        ? "0" + (nextWeek.getMonth() + 1)
        : nextWeek.getMonth() + 1) +
      "-" +
      (nextWeek.getDate().toString().length === 1
        ? "0" + nextWeek.getDate()
        : nextWeek.getDate()) +
      " " +
      nextWeek.getHours() +
      ":" +
      (nextWeek.getMinutes().toString().length === 1
        ? "0" + nextWeek.getMinutes()
        : nextWeek.getMinutes());
    // console.log("yare yare des", filter_str, filter_str_limit);
  
    Auction.count({}, (err, count) => {
      return Auction.find({
      //   $and: [
      //     {
      //       $or: [
      //         // {startTime:  { $gte: filter_str, $lte: filter_str_limit }},
      //         // { status: 0 }
      //       ]
      //     }
      //   ]
      })
        .populate("userId")
      //   .and([
      //     { startTime: { $gte: filter_str, $lte: filter_str_limit } }
      //     // { status: 1 }
      //   ])
        .exec((err, doc) => {
          if (err) {
            res.json({
              message: "Failed",
              err
            });
          } else {
            res.json({
              message: "Success",
              doc,
              count
            });
          }
        });
    });
});

app.get("/api/getItems", (req, res) => {
    AuctionItems.find(
        { auctionID: req.query.id, used: req.query.used },
        (err, doc) => {
            console.log("auction Items", req.query, doc);
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
        }
    );
});

app.get("/api/deleteItem", (req, res) => {
    AuctionItems.findByIdAndRemove(req.query.id, (err, todo) => {
        // As always, handle any potential errors:
        if (err) return res.status(500).send(err);
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        const response = {
            message: "Todo successfully deleted",
            id: todo._id
        };
        return res.status(200).send(response);
    });
});

app.post("/api/updateAuction", (req, res) => {
    let { title, details, startTime, _id, image, bidTime, type } = req.body;

    Auction.findOne({ _id: _id }, (err, doc) => {
        doc.title = title;
        doc.details = details;
        doc.startTime = startTime;
        doc.image = image;
        doc.bidTime = bidTime;
        doc.type = type;
        doc.save().then(data => {
            if (err) {
                res.json({
                    message: "Failed",
                    err
                });
            } else {
                res.json({
                    message: "Success",
                    doc: data
                });
            }
        });
    });
});

app.post("/api/addItem", (req, res) => {

    const item = new AuctionItems({
        ...req.body
    });
    item
        .save()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log("err", err);
            res.json(err);
        });
});

app.post("/api/updateItems", (req, res) => {
    let { images, title, description, _id, startingBid } = req.body;

    AuctionItems.findOne({ _id: _id }, (err, doc) => {
        doc.title = title;
        doc.description = description;
        doc.images = images;
        doc.startingBid = startingBid;

        doc.save().then(data => {
            console.log("ok yar", data);

            if (err) {
                res.json({
                    message: "Failed",
                    err
                });
            } else {
                res.json({
                    message: "Success",
                    doc: data
                });
            }
        });



    });
});

app.post("/api/updateItemLive", (req, res) => {
    let { finalBid, _id, close } = req.body;
    console.log(req.body.close, "des", _id);

    AuctionItems.findOne({ _id: _id }, (err, doc) => {
        // if (close == true) {
        // console.log(req.body.close, "desu");
        // doc.used = true;
        // } else {
        // console.log(parseInt(bid), bid)
        doc.finalBid = finalBid;
        // }
        doc.save().then(data => {
            // console.log("ok yar", data)

            if (err) {
                res.json({
                    message: "Failed",
                    err
                });
            } else {
                res.json({
                    message: "Success",
                    doc: data
                });
            }
        });
    });
});

app.post("/api/closeItemLive", (req, res) => {
    let { _id } = req.body;
    AuctionItems.findOne({ _id: _id }, (err, doc) => {
        console.log(req.body.close, "desu");
        doc.used = true;
        doc.save().then(data => {
            if (err) {
                res.json({
                    message: "Failed",
                    err
                });
            } else {
                res.json({
                    message: "Success",
                    doc: data
                });
            }
        });
    });
});

app.post("/api/updateAuctionLive", (req, res) => {
    let { _id, status, streamId, playBackId } = req.body;
    console.log("something desu");
    Auction.findOne({ _id: _id }, (err, doc) => {
        doc.status = status;
        var date = doc.startTime.split(" ");
        var finalDateArr = date[0].split("-");
        let createdAt = +new Date(
            finalDateArr[0] + "-" + finalDateArr[1] + "-" + finalDateArr[2]
        );
        doc.lastAuction = createdAt;
        doc.streamId = streamId;
        doc.playBackId = playBackId;
        doc.save().then(data => {
            // console.log("ok yar", data)

            if (err) {
                res.json({
                    message: "Failed",
                    err
                });
            } else {
                console.log(data);
                res.json({
                    message: "Success",
                    doc: data
                });
            }
        });
    });
});

app.get("/api/countItems", (req, res) => {
    let { auctionID, status } = req.query;
    console.log("count here");
    AuctionItems.count({ auctionID, used: false }, (err, doc) => {
        if (err) {
            res.json({
                message: "Failed",
                err
            });
        } else {
            res.json({
                message: "Success",
                doc: doc
            });
        }
    });
});
const job = new CronJob("0 */1 * * * *", function () {
    let date = new Date();
    let minus_10_min = new Date(date.getTime() - 1 * 60 * 1000);
    var nextWeek = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    console.log(minus_10_min, nextWeek);

    let filter_str =
        minus_10_min.getFullYear() +
        "-" +
        ((minus_10_min.getMonth() + 1).toString().length === 1
            ? "0" + (minus_10_min.getMonth() + 1)
            : minus_10_min.getMonth() + 1) +
        "-" +
        (minus_10_min.getDate().toString().length === 1
            ? "0" + minus_10_min.getDate()
            : minus_10_min.getDate()) +
        " " +
        minus_10_min.getHours() +
        ":" +
        (minus_10_min.getMinutes().toString().length === 1
            ? "0" + minus_10_min.getMinutes()
            : minus_10_min.getMinutes());
    console.log("yare yare");
    let filter_str_limit =
        nextWeek.getFullYear() +
        "-" +
        ((nextWeek.getMonth() + 1).toString().length === 1
            ? "0" + (nextWeek.getMonth() + 1)
            : nextWeek.getMonth() + 1) +
        "-" +
        (nextWeek.getDate().toString().length === 1
            ? "0" + nextWeek.getDate()
            : nextWeek.getDate()) +
        " " +
        nextWeek.getHours() +
        ":" +
        (nextWeek.getMinutes().toString().length === 1
            ? "0" + nextWeek.getMinutes()
            : nextWeek.getMinutes());

    console.log(filter_str, filter_str_limit);

    Auction.find({ type: "Timed" })
        .and([
            { startTime: { $gte: filter_str, $lte: filter_str_limit } },
            { status: 0 }
        ])
        .exec((err, doc) => {
            if (doc.length > 0) {
                doc.map((v, i) => {
                    doc[i].status = 1;

                    doc[i].save().then(data => {
                        console.log("updated", data);
                    });
                });
            }
            else {

            }
        });

});
job.start();


module.exports=app;
