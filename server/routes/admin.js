const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs');
const Latestpost = require('../models/post');
const Toppost = require('../models/topnews')
const Users = require('../models/users');
const { GridFsStorage } = require('multer-gridfs-storage');

const adminLayout='../views/layouts/admin'
const jwtSecret = process.env.JWT_SECRET
const authMiddleware = (req,res,next)=>{
    const token =req.cookies.token;
    if(!token){
       return res.status(401).json({message:"Unauthorized"})
    }
    try{
        const decoded =jwt.verify(token,jwtSecret);
        req.userId = decoded.userId;
        next()
    }
    catch(error){
       return res.status(401).json({message:"Unauthorized"})
    }
}

router.get('/admin', async(req,res)=>{
    const locals = {
        hide:"blank"
    }
  
    return res.render('admin/index',{locals, layout: adminLayout}
    )
   
})

router.post('/admin', async(req,res)=>{
    const locals = {
        hide:"blank"
    }
    try{
   
        const {username,password} = req.body;
        const user = await Users.findOne({username})
        if(!user){
            return res.render('admin/error',{locals, layout: adminLayout,username,password})
        }
        const isPasswordWord = await bcrypt.compare(password,user.password)
        if(!isPasswordWord){
            return res.render('admin/error',{locals, layout: adminLayout,username,password})
        }
        const token =jwt.sign({userId:user._id},jwtSecret)
        res.cookie('token',token,{httpOnly:true})
        res.redirect('/dashboard')

    }
    catch(error){
        console.log(error)
    }
})

router.post('/repost/:id',async(req,res)=>{
    
    try{
        const str = req.body.link;
        const regexHttp = /https:/g;
        const regexHttp2 =/www/g;
        const regTest = regexHttp.test(str)
        const regTest2 = regexHttp2.test(str)
        var link;
        const body = req.body.body
        const newsLead_array =body.split(' ').splice(0,12);
        const finalLead = newsLead_array.join(' ');
        
        if(!regTest && !regTest2){
            link ="https://www."+str
        }
       else if(regTest){
            link = str
          }

       const slug = req.params.id
       const data = await Latestpost.findById({_id:slug});
       const data2 = await Toppost.findById({_id: slug});
       if(data ){

      await Latestpost.findOneAndUpdate({title:data.title},{$set: {
           title:req.body.title,
           link:link,
           body:body,
           lead:finalLead,
           body2:req.body.body2
       }})
       await Toppost.findOneAndUpdate({title:data.title},{$set: {
        title:req.body.title,
        link:link,
        body:body,
        lead:finalLead,
        body2:req.body.body2
    }})
       .then(()=>{
           console.log('file is updated')
           res.redirect('/all_latest_posts');
       })
    }
    else if(data2){
        await Latestpost.findOneAndUpdate({title:data2.title},{$set: {
            title:req.body.title,
            link:link,
            lead:finalLead,
            body:req.body.body,
            body2:req.body.body2
        }})
        await Toppost.findOneAndUpdate({title:data2.title},{$set: {
         title:req.body.title,
         link:link,
         lead:finalLead,
         body:req.body.body,
         body2:req.body.body2
     }})
        .then(()=>{
            console.log('file is updated')
            res.redirect('/all_top_posts');
        })
    }
    else{
        return res.status(404).json({
            error:'page not found'
        })
    }
    }
    catch(error){
       console.log(error)
    }
       
   })

router.get('/dashboard',authMiddleware,async(req,res)=>{
    const locals = {
        hide2:"blank2",
        select:"aktive"
    }
  
    return res.render('admin/dashboard',{locals, layout: adminLayout})
   
})

router.get('/all_latest_posts', authMiddleware, async(req,res)=>{
    const locals = {
        hide2:"blank2",
        selects:"aktive"
    }
    try{
        const perPage=10;
        const page = Number(req.query.page) || 1;
        const beforePage= page -1;
        const afterPage = page + 1;
        const data = await Latestpost.find().sort({createdAt:-1})
        .skip(perPage * page -perPage).limit(perPage).exec()
        let totalPost = await Latestpost.countDocuments();
        let totalPages = Math.ceil(totalPost/perPage)
        return res.render('admin/alllatestposts',{locals,data,
        perPage,
        page,
        beforePage,
        afterPage,
        totalPages,
        totalPost,
        layout: adminLayout
    })
    }
    catch(error){
        console.log(error)
    }
})
router.get('/all_top_posts', authMiddleware, async(req,res)=>{
    const locals = {
        hide2:"blank2",
        selected:"aktive"
    }
    try{
        const perPage=10;
        const page = Number(req.query.page) || 1;
        const beforePage= page -1;
        const afterPage = page + 1;
        const data = await Toppost.find().sort({createdAt:-1})
        .skip(perPage * page -perPage).limit(perPage).exec()
        let totalPost = await Toppost.countDocuments();
        let totalPages = Math.ceil(totalPost/perPage)
        
        return res.render('admin/alltopposts',{locals,data,
        perPage,
        page,
        beforePage,
        afterPage,
        totalPages,
        totalPost,
        layout: adminLayout
    })
    }
    catch(error){
        console.log(error)
    }
})


router.get('/alllatestposts/:id',authMiddleware, async(req,res)=>{
    const locals = {
        hide2:"blank2"
    }
    const slug =req.params.id;
    const data = await Latestpost.findById({_id:slug});
    if(data){
    return res.render('admin/adminlatestposts',{data,
        layout: adminLayout,
    locals})
    }else{
        return res.status(404).json({
            error:"page not found"
        })
    }  
})
router.get('/edittop/:id',authMiddleware,async(req,res)=>{
    try{
        const locals = {
            hide2:"blank2"
        }
        const slug = req.params.id;
        const data = await Toppost.findById({_id:slug})
        if(data){
     return res.render('admin/edit',{data, layout: adminLayout,
        locals})
     }else{
        return res.status(404).json({
            error:"page not found"
        })
     }
    }
    catch(error){
        console.log(error)
    }
})
router.get('/edit/:id',authMiddleware,async(req,res)=>{
    try{
        const locals = {
            hide2:"blank2"
        }
        const slug = req.params.id;
        const data = await Latestpost.findById({_id:slug})
        if(data){
     return res.render('admin/edit',{data, layout: adminLayout,
        locals})
     }else{
        return res.status(404).json({
            error:"page not found"
        })
     }
    }
    catch(error){
        console.log(error)
    }
})
router.get('/alltopposts/:id', authMiddleware, async(req,res)=>{
    const locals = {
        hide2:"blank2"
    }
    const slug =req.params.id;
    const data = await Toppost.findById({_id:slug});
    if(data){
    return res.render('admin/admintopposts',{data,
        layout: adminLayout,
    locals})
    }else{
        return res.status(404).json({
            error:"page not found"
        })
    }   
})
router.get('/logout',async(req,res)=>{
 res.clearCookie('token')
 return res.redirect('/admin')
})











module.exports = router;