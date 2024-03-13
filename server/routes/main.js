require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Latestpost = require('../models/post');
const Toppost = require('../models/topnews')
const fs = require('fs')


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


const storage = multer.diskStorage({ 
    destination:(req,file,cb)=>{
        cb(null, 'uploads');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
const upload =multer({storage:storage});



router.post('/uploadlatest',upload.fields([{ name: 'newsImage', maxCount: 1 },  { name: 'newsVideo', maxCount: 1 }, { name: 'addnewsImage', maxCount: 1 }]),async(req,res)=>{
    const str = req.body.link;
    const regexHttp = /https:/g;
    const regexHttp2 =/www/g;
    const regTest = regexHttp.test(str)
    const regTest2 = regexHttp2.test(str)
    var link;
    
    if(!regTest && !regTest){
        link ="https://www."+str
    }
   else if(regTest){
        link = str
      }
    const newsLead = req.body.body;
    const newsLead_array =newsLead.split(' ').splice(0,12);
    const finalLead = newsLead_array.join(' ')
 if(req.body.tpost=="toppost"){
    if(req.files['newsVideo'] !== undefined && req.files['addnewsImage'] !== undefined ){
    const saveToppost = new Toppost({
        img:{
        data: fs.readFileSync('uploads/' + req.files['newsImage'][0].filename),
        contentType:"image/png"
        },
        img2:{
            data: fs.readFileSync('uploads/' + req.files['addnewsImage'][0].filename),
            contentType:"image/png"
            },
        vid:{
            data: fs.readFileSync('uploads/' + req.files['newsVideo'][0].filename),
            contentType:"image/png"
            },
        title:req.body.title,
        body:req.body.body,
        body2:req.body.body2,
        category:req.body.category,
        link:link,
        lead:finalLead
    })
    saveToppost.save()
   console.log('post is included in top news')
   const saveLatestpost = new Latestpost({
    img:{
        data: fs.readFileSync('uploads/' + req.files['newsImage'][0].filename),
        contentType:"image/png"
        },
        img2:{
            data: fs.readFileSync('uploads/' + req.files['addnewsImage'][0].filename),
            contentType:"image/png"
            },
        vid:{
            data: fs.readFileSync('uploads/' + req.files['newsVideo'][0].filename),
            contentType:"image/png"
            },
        title:req.body.title,
        body:req.body.body,
        body2:req.body.body2,
        category:req.body.category,
        link:link,
        lead:finalLead
})
saveLatestpost.save()
.then(()=>{
    const filesToBeDeleted = Object.keys(req.files)
    for(var i = 0; i<filesToBeDeleted.length;i++){
    const path = req.files[filesToBeDeleted[i]][0].path
    fs.unlink(path, (err) => {
        if (err) {
          console.error(err)
          return;
        }
        console.log('image and video removed')
      })
    console.log('file is saved')
    }
    res.redirect('/all_latest_posts')
})
.catch((err)=>{
    console.log(err)
})
    }
else if (req.files['newsVideo'] !== undefined && req.files['addnewsImage'] == undefined){
    const saveToppost = new Toppost({
        img:{
        data: fs.readFileSync('uploads/' + req.files['newsImage'][0].filename),
        contentType:"image/png"
        },
        vid:{
            data: fs.readFileSync('uploads/' + req.files['newsVideo'][0].filename),
            contentType:"image/png"
            },
        title:req.body.title,
        body:req.body.body,
        body2:req.body.body2,
        category:req.body.category,
        link:link,
        lead:finalLead
    })
    saveToppost.save()
   console.log('post is included in top news')
   const saveLatestpost = new Latestpost({
    img:{
        data: fs.readFileSync('uploads/' + req.files['newsImage'][0].filename),
        contentType:"image/png"
        },
        vid:{
            data: fs.readFileSync('uploads/' + req.files['newsVideo'][0].filename),
            contentType:"image/png"
            },
        title:req.body.title,
        body:req.body.body,
        body2:req.body.body2,
        category:req.body.category,
        link:link,
        lead:finalLead
})
saveLatestpost.save()
.then(()=>{
    const filesToBeDeleted = Object.keys(req.files)
    for(var i = 0; i<filesToBeDeleted.length;i++){
    const path = req.files[filesToBeDeleted[i]][0].path
    fs.unlink(path, (err) => {
        if (err) {
          console.error(err)
          return;
        }
        console.log('image and video removed')
      })
    console.log('file is saved')
    }
    res.redirect('/all_latest_posts')
})
.catch((err)=>{
    console.log(err)
})
}
 else if(req.files['newsVideo'] == undefined && req.files['addnewsImage'] !== undefined){
    const saveToppost = new Toppost({
        img:{
        data: fs.readFileSync('uploads/' + req.files['newsImage'][0].filename),
        contentType:"image/png"
        },
        img2:{
            data: fs.readFileSync('uploads/' + req.files['addnewsImage'][0].filename),
            contentType:"image/png"
            },
        title:req.body.title,
        body:req.body.body,
        body2:req.body.body2,
        category:req.body.category,
        link:link,
        lead:finalLead
    })
    saveToppost.save()
   console.log('post is included in top news')
   const saveLatestpost = new Latestpost({
    img:{
        data: fs.readFileSync('uploads/' + req.files['newsImage'][0].filename),
        contentType:"image/png"
        },
        img2:{
            data: fs.readFileSync('uploads/' + req.files['addnewsImage'][0].filename),
            contentType:"image/png"
            },
        title:req.body.title,
        body:req.body.body,
        body2:req.body.body2,
        category:req.body.category,
        link:link,
        lead:finalLead
})
saveLatestpost.save()
.then(()=>{
    const filesToBeDeleted = Object.keys(req.files)
    for(var i = 0; i<filesToBeDeleted.length;i++){
    const path = req.files[filesToBeDeleted[i]][0].path
    fs.unlink(path, (err) => {
        if (err) {
          console.error(err)
          return;
        }
        console.log('image and video removed')
      })
    console.log('file is saved')
    }
    res.redirect('/all_latest_posts')
})
.catch((err)=>{
    console.log(err)
})
}
else{ 

    const saveToppost = new Toppost({
        img:{
        data: fs.readFileSync('uploads/' + req.files['newsImage'][0].filename),
        contentType:"image/png"
        },
        title:req.body.title,
        body:req.body.body,
        body2:req.body.body2,
        category:req.body.category,
        link:link,
        lead:finalLead
    })
    saveToppost.save()
   console.log('post is included in top news')
   const saveLatestpost = new Latestpost({
    img:{
        data: fs.readFileSync('uploads/' + req.files['newsImage'][0].filename),
        contentType:"image/png"
        },
        title:req.body.title,
        body:req.body.body,
        body2:req.body.body2,
        category:req.body.category,
        link:link,
        lead:finalLead
})
saveLatestpost.save()
.then(()=>{
    
    const filesToBeDeleted = Object.keys(req.files)
    for(var i = 0; i<filesToBeDeleted.length;i++){
    const path = req.files[filesToBeDeleted[i]][0].path
    fs.unlink(path, (err) => {
        if (err) {
          console.error(err)
          return;
        }
        console.log('image and video removed')
      })
    }
    console.log('file is saved')
    res.redirect('/all_latest_posts')
})
.catch((err)=>{
    console.log(err)
})

}

}
else{
     
    if(req.files['newsVideo'] !== undefined && req.files['addnewsImage'] !== undefined ){
    const saveLatestpost = new Latestpost({
        img:{
            data: fs.readFileSync('uploads/' + req.files['newsImage'][0].filename),
            contentType:"image/png"
            },
            img2:{
                data: fs.readFileSync('uploads/' + req.files['addnewsImage'][0].filename),
                contentType:"image/png"
                },
            vid:{
                data: fs.readFileSync('uploads/' + req.files['newsVideo'][0].filename),
                contentType:"image/png"
                },
            title:req.body.title,
            body:req.body.body,
            body2:req.body.body2,
            category:req.body.category,
            link:link,
            lead:finalLead
    })
    saveLatestpost.save()
    .then(()=>{
        const filesToBeDeleted = Object.keys(req.files)
    for(var i = 0; i<filesToBeDeleted.length;i++){
    const path = req.files[filesToBeDeleted[i]][0].path
    fs.unlink(path, (err) => {
        if (err) {
          console.error(err)
          return;
        }
        console.log('image and video removed')
      })
    }
        console.log('file is saved')
        res.redirect('/all_latest_posts')
        
    })
    .catch((err)=>{
        console.log(err)
    })
}
else if(req.files['newsVideo'] !== undefined && req.files['addnewsImage'] == undefined){
    const saveLatestpost = new Latestpost({
        img:{
            data: fs.readFileSync('uploads/' + req.files['newsImage'][0].filename),
            contentType:"image/png"
            },
            vid:{
                data: fs.readFileSync('uploads/' + req.files['newsVideo'][0].filename),
                contentType:"image/png"
                },
            title:req.body.title,
            body:req.body.body,
            body2:req.body.body2,
            category:req.body.category,
            link:link,
            lead:finalLead
    })
    saveLatestpost.save()
    .then(()=>{
        const filesToBeDeleted = Object.keys(req.files)
    for(var i = 0; i<filesToBeDeleted.length;i++){
    const path = req.files[filesToBeDeleted[i]][0].path
    fs.unlink(path, (err) => {
        if (err) {
          console.error(err)
          return;
        }
        console.log('image and video removed')
      })
    }
        console.log('file is saved')
        res.redirect('/all_latest_posts')
        
    })
    .catch((err)=>{
        console.log(err)
    })
}
else if(req.files['newsVideo'] == undefined && req.files['addnewsImage'] !== undefined){
    const saveLatestpost = new Latestpost({
        img:{
            data: fs.readFileSync('uploads/' + req.files['newsImage'][0].filename),
            contentType:"image/png"
            },
            img2:{
                data: fs.readFileSync('uploads/' + req.files['addnewsImage'][0].filename),
                contentType:"image/png"
                },
            title:req.body.title,
            body:req.body.body,
            body2:req.body.body2,
            category:req.body.category,
            link:link,
            lead:finalLead
    })
    saveLatestpost.save()
    .then(()=>{
        const filesToBeDeleted = Object.keys(req.files)
    for(var i = 0; i<filesToBeDeleted.length;i++){
    const path = req.files[filesToBeDeleted[i]][0].path
    fs.unlink(path, (err) => {
        if (err) {
          console.error(err)
          return;
        }
        console.log('image and video removed')
      })
    }
        console.log('file is saved')
        res.redirect('/all_latest_posts')
        
    })
    .catch((err)=>{
        console.log(err)
    })
}
else{

    const saveLatestpost = new Latestpost({
        img:{
            data: fs.readFileSync('uploads/' + req.files['newsImage'][0].filename),
            contentType:"image/png"
            },
            title:req.body.title,
            body:req.body.body,
            body2:req.body.body2,
            category:req.body.category,
            link:link,
            lead:finalLead
    })
    saveLatestpost.save()
    .then(()=>{
        const filesToBeDeleted = Object.keys(req.files)
    for(var i = 0; i<filesToBeDeleted.length;i++){
    const path = req.files[filesToBeDeleted[i]][0].path
    fs.unlink(path, (err) => {
        if (err) {
          console.error(err)
          return;
        }
        console.log('image and video removed')
      })
    }
        console.log('file is saved')
        res.redirect('/all_latest_posts');
    })
    .catch((err)=>{
        console.log(err)
    })
}
}
})






           










router.post('/search',async(req,res)=>{
    const searchTerm = req.body.searchValue
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/,"")
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
        page
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
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('latestpost',{data,result})
   
})


router.get('/toppost/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Toppost.findById({_id:slug});
    const related = data.category;
    const result = await Toppost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('toppost',{data,result})
   
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
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('entertainment',{data,result})
   
})
router.get('/technology/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Latestpost.findById({_id:slug});
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('technology',{data,result})
   
})
router.get('/business/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Latestpost.findById({_id:slug});
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('business',{data,result})
   
})
router.get('/economy/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Latestpost.findById({_id:slug});
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('economy',{data,result})
   
})

router.get('/education/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Latestpost.findById({_id:slug});
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('education',{data,result})
   
})

router.get('/politics/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Latestpost.findById({_id:slug});
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('politics',{data,result})
   
})

router.get('/sports/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Latestpost.findById({_id:slug});
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('sports',{data,result})
   
})
router.get('/search/:id', async(req,res)=>{
    const slug =req.params.id;
    const data = await Latestpost.findById({_id:slug});
    const related = data.category;
    const result = await Latestpost.find({$and:
        [{category:related},
         { _id: { $ne: slug } }]}).sort({createdAt:-1}).skip(0).limit(4).exec();

    return res.render('search',{data,result})
   
})
router.get('/about', async(req,res)=>{
   
    return res.render('about')
   
})
router.get('/contact', async(req,res)=>{
   
    return res.render('contact')
   
})





module.exports = router;
