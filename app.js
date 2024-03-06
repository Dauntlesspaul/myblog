require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cors = require('cors')
const connectDB = require('./server/config/db')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const session = require('express-session')
const app = express();
const PORT = process.env.PORT || 8000;
connectDB();

app.use(cookieParser());
app.use(session({
    secret:"keyboard mouse",
    resave:false,
    saveUninitialized:true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
})

)
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout',"./layouts/main");
app.set('view engine',"ejs");

app.use('/',require('./server/routes/main'))
app.use('/',require('./server/routes/admin'))

app.listen(PORT,()=>{
console.log(`app is running at port ${PORT}`)
})