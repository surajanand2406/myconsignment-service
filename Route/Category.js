const express = require('express')
const app = express();
const Category = require('../models/Categories')
const handleErr = require('../HandleFunction/HandleErr')
const fs = require('fs')

app.get('/api/getCategories', (req, res) => {
    Category.find({}, (err, docs) => {
        if (err) return res.json(handleErr(err))
        else{
            // console.log('categoooriieees->',docs[0])
            let categories = docs.map((cat)=>{
                return {
                    name:cat._doc.name,
                    subCategories:cat._doc.subCategories.map((subCat)=>subCat.name)
                }
            })
            // console.log('categoriess-->',categories[0])
            fs.writeFile(__dirname+'/categories.json',JSON.stringify(categories),'utf16le',(err,success)=>{
                if(err)return res.json(handleErr(err))
                else{
                    console.log('succcc->',success)
                }
            })
            return res.json({
                message: "Success",
                docs
            })
        }
    })
})

app.get("/api/AllCatigories", (req, res) => {
    Category.find({}, (err, sales) => {
        if (err) {
            res.json({
                message: "failed",

            })
        }
        res.json(sales)
    })
})


app.post('/api/addCategory', (req, res) => {
    Category.create(req.body, (err, docs) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            category: docs
        })
    })
})

app.post('/api/updateSubCat', (req, res) => {
    Category.findByIdAndUpdate(req.body.id, { $set: { subCategories: req.body.subCategories } },{new:true}, (err, docs) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            data: docs
        })
    })
})
app.post('/api/updateCat', (req, res) => {
    console.log(req)
    Category.findOneAndUpdate({ _id: req.body.id }, {
        $set: {
            subCategories: req.body.subCategories,
            name: req.body.name,
            color: req.body.color,
            iconType: req.body.iconType,
            iconName: req.body.iconName,
        }
    }, (err, docs) => {

        if (err) res.json(err)
        res.json({
            message: "Success",
            data: docs
        })
    })
})

app.post('/api/addSubCategory', (req, res) => {
    Category.findByIdAndUpdate(req.body.id,
        { $push: { subCategories: req.body } }, { new: true }, (err, docs) => {
            if (err) res.json(err)
            res.json({
                message: "Success",
                data: docs
            })
        })
})
app.delete('/api/deleteCategory', (req, res) => {
    Category.findByIdAndRemove(req.body.id, (err, doc) => {
        if (err) res.json(err)
        res.json({
            message: "Success",
            data: doc
        })
    })
})

app.put('/api/deleteSubCategory', (req, res) => {
    Category.findByIdAndUpdate(req.body.id, { $set: { subCategories: req.body.subCategories } }, {new:true}, (err, docs) => {
        if (err) return res.json(err)
        res.json({
            message: "Success",
            data: docs
        })
    })
})
module.exports = app;