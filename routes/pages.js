const Router = require('express').Router();
const { ensureAuthenenticated } = require('../config/index')
const eduModal = require('../modal/UserDetail');
const ContactModal = require('../modal/contact');
const user = require('../config/passport');

Router.get('/', (req, res) => {
    var user = req.user;
    res.render('Home',{cuser:user});
})

Router.get('/dashboard', (req, res) => {
    var user = req.user;
    eduModal.find({}, function (err, data) {
        if (!err) {
            res.render('Dashboard', { title: "Teachers Records", records: data, cuser:user });
        } else {
            throw err;
        }
    }).clone().catch(function (err) { console.log(err) })
})

Router.get('/profile', ensureAuthenenticated, (req, res) => {
    var user = req.user;
    res.render('Profile',{cuser:user});
})

Router.get('/contact', (req, res) => {
    var user = req.user;
    res.render('Contact',{cuser:user})
})

Router.post('/contact', (req, res) => {
    const CUser = new ContactModal({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
    })
    console.log(CUser);
    CUser.save();
    res.redirect('/');
})

Router.post('/search', (req, res) => {
    var user = req.user;
    var fgender = req.body.gender;
    var fcity = req.body.city;
    var fsubject = req.body.subject;
    var fpincode = req.body.pincode;

    if (fgender != '' && fcity != '' && fsubject != '' && fpincode != '') {
        var filterParameter = {
            $and: [{ gender: fgender }, { $and: [{ city: fcity }, { $and: [{ subject: fsubject }, { pincode: fpincode }] }] }]
        }
    }
    else {
        var filterParameter = {};
    }

    var eduFilter = eduModal.find(filterParameter);
    eduFilter.find({}, function (err, data) {
        if (!err) {
            res.render('Dashboard', { title: "Teachers Records", records: data,cuser:user });
        } else {
            throw err;
        }
    }).clone().catch(function (err) { console.log(err) })

})

module.exports = Router;