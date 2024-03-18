require('dotenv').config();
const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Latestpost = require('../models/post');
const Toppost = require('../models/topnews')
const {conn} = require('../config/db')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const {GridFsStorage} = require('multer-gridfs-storage')
const Grid = require('gridfs-stream');
const e = require('express');


let gfs, gridfsBucket;

conn.once('open', ()=>{

    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

Toppost.createIndexes({createdAt:1})
.then(()=>{
    console.log('index created successfully')
})
.catch((err)=>{
    console.error('Error in creating index')
})

Latestpost.createIndexes({createdAt:1})
.then(()=>{
    console.log('index created successfully')
})
.catch((err)=>{
    console.error('Error in creating index')
})


 const uploadMiddleware = upload.fields([
    {name:'newsImage', maxCount: 2},
    {name:'newsVideo', maxCount: 1}
 ])

router.post('/uploadlatest', uploadMiddleware, async(req,res)=>{
    const str = req.body.link;
    const regexHttp = /https:/g;
    const regexHttp2 =/www/g;
    const regTest = regexHttp.test(str)
    const regTest2 = regexHttp2.test(str)
    var link;
    if(!regTest && !regTest2 && str!==''){
        link ="https://www."+str
    }
   else if(regTest){
        link = str
      }

    const { newsImage, newsVideo } = req.files;
    const { title, body, body2, category } = req.body;
    const newsLead_array =body.split(' ').splice(0,12);
    const finalLead = newsLead_array.join(' ');

    
    if(req.body.tpost=="toppost"){

        const imageRefs = newsImage.map(file => ({
        filename: file.filename,
        contentType: file.mimetype,
        bucketName: 'uploads'
          }));

          var videoRefs;

          if(newsVideo !== undefined){
            videoRefs = newsVideo.map(file => ({
            filename: file.filename,
            contentType: file.mimetype,
            bucketName: 'uploads' 
                }));
            }else{
            videoRefs = []
            }

        const newPost = new Latestpost({
        images: imageRefs,
        videos: videoRefs,
        link:link,
        title,
        lead: finalLead,
        body,
        body2,
        category
        });
      
          await newPost.save()
          .then(()=>{
            console.log("successfully saved in latest post")
          })

        const newPost2 = new Toppost({
        images: imageRefs,
        videos: videoRefs,
        link: link,
        title,
        lead: finalLead,
        body,
        body2,
        category
        });

        await newPost2.save()
        .then(()=>{
            console.log("post succesfully included in top post")
        })

    return res.redirect('/all_latest_posts')
    }
    else{

        const imageRefs = newsImage.map(file => ({
        filename: file.filename,
        contentType: file.mimetype,
        bucketName: 'uploads'
            }));
        if(newsVideo !== undefined){
        videoRefs = newsVideo.map(file => ({
        filename: file.filename,
        contentType: file.mimetype,
        bucketName: 'uploads' 
            }));
        }else{
        videoRefs = []
        }
        const newPost = new Latestpost({
        images: imageRefs,
        videos: videoRefs,
        link:link,
        title,
        lead: finalLead,
        body,
        body2,
        category
        });
        
        await newPost.save()
        .then(()=>{
        console.log("successfully saved in latest post")
        })
        return res.redirect('/all_latest_posts')
    }

})


router.get('/stream/:filename',  (req, res) => {
    

            const readStream = gridfsBucket.openDownloadStreamByName(req.params.filename);
            readStream.pipe(res);
        
 
});


router.post('/search',async(req,res)=>{
    const locals={
        text: 'No result found'
    }
    const searchTerm = req.body.searchValue
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 \s]/,"")
    let perPage=12
    let page= parseInt(req.query.page) || 1;
    let beforePage =page -1;
    let afterPage = page + 1;
    const data = await Latestpost.find({
        $or:[
            {title:{$regex: new RegExp(searchNoSpecialChar,'i')}},
            {body:{$regex: new RegExp(searchNoSpecialChar,'i')}}
        ]
    }).sort({createdAt:-1})
    .skip(perPage * page - perPage).limit(perPage).exec()
    let totalPost = await Latestpost.find({
        $or:[
            {title:{$regex: new RegExp(searchNoSpecialChar,'i')}},
            {body:{$regex: new RegExp(searchNoSpecialChar,'i')}}
        ]
    }).countDocuments();
    let totalPages = Math.ceil(totalPost/perPage)

    return res.render('allsearch',{data,
        beforePage,
        afterPage,
        totalPages,
        page,
        locals
    })
   
})


router.get('', async(req,res)=>{
    const locals = {
        title:"Grid News",
        description: "Timeless news",
        select:"aktive"
    }

    try{

        const data = await Latestpost.aggregate([{$sort:{createdAt:-1}}, {$skip: 0}, {$limit: 8}])
        const topP = await Toppost.aggregate([{$sort:{createdAt:-1}}, {$skip: 0}, {$limit: 6}])
        const politicS = await Latestpost.aggregate([{$match: {category:"politics"}}, {$sort:{createdAt:-1}}, {$skip: 0}, {$limit: 8}])
        const educatioN = await Latestpost.aggregate([{$match: {category:"education"}},{$sort:{createdAt:-1}}, {$skip: 0}, {$limit: 8}])
        const entertainmenT = await Latestpost.aggregate([{$match: {category:"entertainment"}}, {$sort:{createdAt:-1}}, {$skip: 0}, {$limit: 8}])
        const sportS = await Latestpost.aggregate([{$match: {category:"sports"}}, {$sort:{createdAt:-1}}, {$skip: 0}, {$limit: 8}])
        
        return res.render('index',{locals, data,topP, politicS, educatioN, entertainmenT, sportS});
    }catch(error){
        console.log(error)
    }
})


router.get('/latestpost/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Latestpost.findById({_id:slug});
    if(data){
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('latestpost',{data,result})
        }
        else{
            return res.status(404).json({
                error:"page no found"
            })  
        }
})


router.get('/toppost/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Toppost.findById({_id:slug});
    if(data){
    const related = data.category;
    const result = await Toppost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('toppost',{data,result})
        }
        else{
            return res.status(404).json({
                error:"page no found"
            })
        }
   
})


router.get('/more_latestnews', async(req,res)=>{
    let perPage=8
    let page= parseInt(req.query.page) || 2;
    let beforePage =page -1;
    let afterPage = page + 1;
    const data = await Latestpost.aggregate([{$sort:{createdAt:-1}}])
    .skip(perPage * page - perPage).limit(perPage).exec()

    let totalPost = await Latestpost.countDocuments() - 8;
    let totalPages = Math.ceil(totalPost/perPage)
    return res.render('morelatest',{data,
    page,
    perPage,
    totalPages,
    beforePage,
    afterPage
    })
   
})

router.get('/more_education', async(req,res)=>{
    let perPage=8
    let page= parseInt(req.query.page) || 2;
    let beforePage =page -1;
    let afterPage = page + 1;
    const data = await Latestpost.find({category:"education"}).sort({createdAt:-1})
    .skip(perPage * page - perPage).limit(perPage).exec()

    let totalPost = await Latestpost.find({category:"education"}).countDocuments() - 8;
    let totalPages = Math.ceil(totalPost/perPage)
  
    return res.render('moreeducation',{data,
    page,
    perPage,
    totalPages,
    beforePage,
    afterPage
    })
   
})
router.get('/more_entertainment', async(req,res)=>{
    let perPage=8
    let page= parseInt(req.query.page) || 2;
    let beforePage =page -1;
    let afterPage = page + 1;
    const data = await Latestpost.find({category:"entertainment"}).sort({createdAt:-1})
    .skip(perPage * page - perPage).limit(perPage).exec()

    let totalPost = await Latestpost.find({category:"entertainment"}).countDocuments() - 8;
    let totalPages = Math.ceil(totalPost/perPage)
  
    return res.render('moreentertainment',{data,
    page,
    perPage,
    totalPages,
    beforePage,
    afterPage
    })
   
})

router.get('/more_politics', async(req,res)=>{
    let perPage=8
    let page= parseInt(req.query.page) || 2;
    let beforePage =page -1;
    let afterPage = page + 1;
    const data = await Latestpost.find({category:"politics"}).sort({createdAt:-1})
    .skip(perPage * page - perPage).limit(perPage).exec()

    let totalPost = await Latestpost.find({category:"politics"}).countDocuments() - 8;
    let totalPages = Math.ceil(totalPost/perPage)
  
    return res.render('morepolitics',{data,
    page,
    perPage,
    totalPages,
    beforePage,
    afterPage
    })
   
})

router.get('/more_sports', async(req,res)=>{
    let perPage=8
    let page= parseInt(req.query.page) || 2;
    let beforePage =page -1;
    let afterPage = page + 1;
    const data = await Latestpost.find({category:"sports"}).sort({createdAt:-1})
    .skip(perPage * page - perPage).limit(perPage).exec()

    let totalPost = await Latestpost.find({category:"sports"}).countDocuments() - 8;
    let totalPages = Math.ceil(totalPost/perPage)
  
    return res.render('moresports',{data,
    page,
    perPage,
    totalPages,
    beforePage,
    afterPage
    })
   
})




router.get('/allsports', async(req,res)=>{
    const locals = {
        selects:"aktive"
    }

    let perPage=12
    let page= parseInt(req.query.page) || 1;
    let beforePage =page -1;
    let afterPage = page + 1;
    const data = await Latestpost.find({category:"sports"}).sort({createdAt:-1})
    .skip(perPage * page - perPage).limit(perPage).exec()

    let totalPost = await Latestpost.find({category:"sports"}).countDocuments();
    let totalPages = Math.ceil(totalPost/perPage)
  
    return res.render('allsports',{data,
    page,
    perPage,
    totalPages,
    beforePage,
    afterPage,
    locals
    })
   
})

router.get('/alltechnology', async(req,res)=>{

    let perPage=12
    let page= parseInt(req.query.page) || 1;
    let beforePage =page -1;
    let afterPage = page + 1;
    const data = await Latestpost.find({category:"technology"}).sort({createdAt:-1})
    .skip(perPage * page - perPage).limit(perPage).exec()

    let totalPost = await Latestpost.find({category:"technology"}).countDocuments();
    let totalPages = Math.ceil(totalPost/perPage)
  
    return res.render('alltechnology',{data,
    page,
    perPage,
    totalPages,
    beforePage,
    afterPage
    })
   
})

router.get('/allbusiness', async(req,res)=>{
    const locals = {
        selects:"aktive"
    }

    let perPage=12
    let page= parseInt(req.query.page) || 1;
    let beforePage =page -1;
    let afterPage = page + 1;
    const data = await Latestpost.find({category:"business"}).sort({createdAt:-1})
    .skip(perPage * page - perPage).limit(perPage).exec()

    let totalPost = await Latestpost.find({category:"business"}).countDocuments();
    let totalPages = Math.ceil(totalPost/perPage)
  
    return res.render('allbusiness',{data,
    page,
    perPage,
    totalPages,
    beforePage,
    afterPage,
    locals
    })
   
})

router.get('/alleconomy', async(req,res)=>{
    const locals = {
        selects:"aktive"
    }

    let perPage=12
    let page= parseInt(req.query.page) || 1;
    let beforePage =page -1;
    let afterPage = page + 1;
    const data = await Latestpost.find({category:"economy"}).sort({createdAt:-1})
    .skip(perPage * page - perPage).limit(perPage).exec()

    let totalPost = await Latestpost.find({category:"economy"}).countDocuments();
    let totalPages = Math.ceil(totalPost/perPage)
  
    return res.render('alleconomy',{data,
    page,
    perPage,
    totalPages,
    beforePage,
    afterPage,
    locals
    })
   
})


router.get('/allentertainment', async(req,res)=>{
    const locals = {
        selecten:"aktive"
    }
    let perPage=12
    let page= parseInt(req.query.page) || 1;
    let beforePage =page -1;
    let afterPage = page + 1;
    const data = await Latestpost.find({category:"entertainment"}).sort({createdAt:-1})
    .skip(perPage * page - perPage).limit(perPage).exec()

    let totalPost = await Latestpost.find({category:"entertainment"}).countDocuments();
    let totalPages = Math.ceil(totalPost/perPage)
  
    return res.render('allentertainment',{data,
    page,
    perPage,
    totalPages,
    beforePage,
    afterPage,
    locals
    })
   
})


router.get('/allpolitics', async(req,res)=>{
    const locals = {
        selectp:"aktive"
    }
    let perPage=12
    let page= parseInt(req.query.page) || 1;
    let beforePage =page -1;
    let afterPage = page + 1;
    const data = await Latestpost.find({category:"politics"}).sort({createdAt:-1})
    .skip(perPage * page - perPage).limit(perPage).exec()

    let totalPost = await Latestpost.find({category:"politics"}).countDocuments();
    let totalPages = Math.ceil(totalPost/perPage)
  
    return res.render('allpolitics',{data,
    page,
    perPage,
    totalPages,
    beforePage,
    afterPage,
    locals
    })
   
})


router.get('/alleducation', async(req,res)=>{
    const locals = {
        selected:"aktive"
    }
    let perPage=12
    let page= parseInt(req.query.page) || 1;
    let beforePage =page -1;
    let afterPage = page + 1;
    const data = await Latestpost.find({category:"education"}).sort({createdAt:-1})
    .skip(perPage * page - perPage).limit(perPage).exec()

    let totalPost = await Latestpost.find({category:"education"}).countDocuments();
    let totalPages = Math.ceil(totalPost/perPage)
  
  
    return res.render('alleducation',{data,
    page,
    perPage,
    totalPages,
    beforePage,
    afterPage,
    locals
    })
   
})



router.get('/more_topnews', async(req,res)=>{
    let perPage=6
    let page= parseInt(req.query.page) || 2;
    let beforePage =page -1;
    let afterPage = page + 1;
    const data = await Toppost.aggregate([{$sort:{createdAt:-1}}])
    .skip(perPage * page - perPage).limit(perPage).exec()

    let totalPost = await Toppost.countDocuments() - 6;
    let totalPages = Math.ceil(totalPost/perPage)
  
    return res.render('moretop',{data,
    page,
    perPage,
    totalPages,
    beforePage,
    afterPage
    })
   
})




router.get('/entertainment/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Latestpost.findById({_id:slug});
    if(data){
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('entertainment',{data,result})
    }
    else{
        return res.status(404).json({
            error:"page no found"
        })
    }
})
router.get('/technology/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Latestpost.findById({_id:slug});
    if(data){
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('technology',{data,result})
        }
        else{
            return res.status(404).json({
                error:"page no found"
            })
        }
})
router.get('/business/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Latestpost.findById({_id:slug});
    if(data){
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('business',{data,result})
        }
        else{
            return res.status(404).json({
                error:"page no found"
            })
        }
})
router.get('/economy/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Latestpost.findById({_id:slug});
    if(data){
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('economy',{data,result})
        }
        else{
            return res.status(404).json({
                error:"page no found"
            })
        }
})

router.get('/education/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Latestpost.findById({_id:slug});
    if(data){
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('education',{data,result})
        }
        else{
            return res.status(404).json({
                error:"page no found"
            })
        }
})

router.get('/politics/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Latestpost.findById({_id:slug});
    if(data){
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('politics',{data,result})
        }
        else{
            return res.status(404).json({
                error:"page no found"
            })
        }
})

router.get('/sports/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Latestpost.findById({_id:slug});
    if(data){
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('sports',{data,result})
    }
    else{
        return res.status(404).json({
            error:"page no found"
        })
    }
   
})
router.get('/search/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Latestpost.findById({_id:slug});
    if(data){
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('search',{data,result})
        }
        else{
            return res.status(404).json({
                error:"page no found"
            })
        }
   
})
router.get('/about', async(req,res)=>{
   
    return res.render('about')
   
})
router.get('/contact', async(req,res)=>{
   
    return res.render('contact')
   
})

router.get('/deletetop/:id', async(req,res)=>{
    try{
 
        const slug = req.params.id;
        const data = await Toppost.findOne({_id : slug})
        if(data){
        const gfname = data.images[0].filename
        const compareData = await Latestpost.findOne({title: data.title})
        if(!compareData){
        const fmatch = await gfs.files.findOne({filename : gfname})
        gridfsBucket.delete(fmatch._id)
        .then(()=>{
           console.log('file deleted')
        })
        } 
       
       await Toppost.deleteOne({_id:slug});
       res.redirect('/all_top_posts')
    }
    }
    catch(err){
        console.log(err)
    }
})
router.get('/delete/:id',async(req,res)=>{
    try{
 
 const slug = req.params.id;
 const data = await Latestpost.findOne({_id : slug})
 if(data){
 const gfname = data.images[0].filename
 const compareData = await Toppost.findOne({title: data.title})
 if(!compareData){
 const fmatch = await gfs.files.findOne({filename : gfname})
 gridfsBucket.delete(fmatch._id)
 .then(()=>{
    console.log('file deleted')
 })
 } 

await Latestpost.deleteOne({_id:slug});
    res.redirect('/all_latest_posts')
    }
}
    catch(error){
        console.log(error)
    }
})





module.exports = router;
