const express = require('express')
const app = express()
var BlogSchema = require("../models/BlogModel");
const handleErr = require('../HandleFunction/HandleErr')



app.get('/readblogs',(req,res)=>{
    BlogSchema.find({}).then(data=>{
        res.send(data)
    })
    })
    
    app.post('/addblogcategory',(req,res)=>{
    
    console.log(req.body)
    var newBlogSchema =new BlogSchema({
        Category:req.body.Category,
        Blog:[]
    })
    
    newBlogSchema.save().then(data=>{
        res.send(data)
    })
    })
    
    app.put('/addnewblog',(req,res)=>{
    BlogSchema.findByIdAndUpdate(req.body.Id,{
        $push:{Blog:req.body.blog},
    },{new:true}).then(data=>      
        res.send(data)
    )
    })
    
    app.put('/addblogcomment',(req,res)=>{
    
    var data = BlogSchema.findById({_id:req.body.CateId})
    
    var myblog=null;
    
    data.then(blog=>{
    
            ///Getting commplete data
           var Blogs=blog;
    
            /// finding blog by Id
            blog.Blog.map(bl=>{
                if(bl._id == req.body.blogId)
                {
                    myblog = bl;
                }
            })
    
        
            ///adding comment data into particular comments
            var newCom = myblog.comments.concat(req.body.comment)
            
            //// adding new comment into that blog
            myblog.comments = newCom;
    
            /// new blog into blogs
            var newBlog  =  Blogs.Blog.map(data=>{
                if(data._id===myblog._id)
                {
                    data = myblog;
                    return data
                }
                return data
            })
    
           
            BlogSchema.findByIdAndUpdate(req.body.CateId,{
                $set:{Blog:newBlog},
            },{new:true}).then(data=>      
                res.send(data)
            )
    })
    })

module.exports=app;
