const express = require('express');
const mongoose = require('mongoose');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const authRoute = require('./routes/Auth');
const pageRoute = require('./routes/pages');
const passport = require('passport');

//passport config
require('./config/passport')(passport);

//view engine
app.set('view engine','ejs');

// BodyParser
app.use(express.urlencoded({extended:false}));


//Assets
app.use('/assets', express.static('assets'));

// Dotenv
const dotenv = require('dotenv');
dotenv.config();
const Url = process.env.Db_Url;
const Port = process.env.PORT || 5000;

//connect Register to DB
mongoose.connect(Url, {
     useNewUrlParser: true,
})
     .then(() => console.log("Database connected"))
     .catch((err) => console.log(err));


//Middleware
app.use(express.json());

//express session
app.use(session({
     secret:'secret',
     resave:true,
     saveUninitialized:true
 }));

 // Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

// global vars
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Route Middleware
app.use('/', pageRoute)
app.use('/user', authRoute)

app.listen(Port, () => console.log(`server Running at port ${Port}`));

