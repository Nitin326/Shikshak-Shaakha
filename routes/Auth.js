const Router = require('express').Router();
const User = require('../modal/UserDetail');
const bcrypt = require('bcrypt');
const passport = require('passport');
const authUser = require('../config/passport');

Router.get('/login',(req,res) => {
    res.render('Login');
})

Router.get('/register',(req,res) => {
    res.render('Register');
})

Router.post('/register',(req,res) => {
     
     const {name,email,gender,phone,facebook,instagram,subject,qualification,address,city,pincode,password,password2} = req.body;

     let errors = [];
     
     if(!name || !email || !gender || !phone || !facebook || !instagram || !subject || !qualification || !address || !city || !pincode || !password || !password2) {
        errors.push({ msg: 'please fill the all fields' });
    }
    
    //check password match
    if (password != password2) {
        errors.push({ msg: 'password do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'password should be least 6 characteres' });
    }

    if (errors.length > 0) {
        res.render('Register', {
            errors,
            name,
            email,
            gender,
            phone,
            facebook,
            instagram,
            subject,
            qualification,
            address,
            city,
            pincode,
            password,
            password2
        })
    }
    else{
        // validation passed
        User.findOne({email:email})
        .then(user => {
            if(user){
                //user exist
                errors.push({ msg: 'Email is already Registered' })
                res.render('Register', {
                    errors,
                    name,
                    email,
                    gender,
                    phone,
                    facebook,
                    instagram,
                    subject,
                    qualification,
                    address,
                    city,
                    pincode,
                    password,
                    password2
                })
            }
            else{
                const newUser = new User({
                    name,email,gender,phone,facebook,instagram,subject,qualification,address,city,pincode,password
                })

               //Hash Password
               bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash) {
                    if (err) throw err;
                    //set password to hashed
                     newUser.password = hash;
                     //save user
                     newUser.save()
                     .then(user => {
                        req.flash('success_msg', 'You are now registered and can log-in');
                        res.redirect('/user/login')
                    })
                    .catch(err => console.log(err))
                });
            });

            }
        })
    }
})

Router.post('/login', (req, res,next) => {
    passport.authenticate('local', { 
        failureRedirect: '/user/login',
        successRedirect:'/profile',
        failureFlash: true
    })(req,res,next);
})

Router.post('/edit/:id', (req, res) => {
    var userid = req.params.id;
    var update = User.findByIdAndUpdate(userid,{
        name:req.body.name,
        email:req.body.email,
        gender:req.body.gender,
        phone:req.body.phone,
        facebook:req.body.facebook,
        instagram:req.body.instagram,
        subject:req.body.subject,
        qualification:req.body.qualification,
        address:req.body.address,
        city:req.body.city,
        pincode:req.body.pincode
    })
    update.exec(function(err,data){
        if(err) throw err;
        res.redirect('/profile');
    })
})

//Logout

Router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg','You are logged out')
    res.redirect('/user/login');
  });


module.exports = Router;