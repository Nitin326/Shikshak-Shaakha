const Router = require('express').Router();
const { ensureAuthenenticated } = require('../config/index')
const eduModal = require('../modal/Users');
const ContactModal = require('../modal/contact');

Router.get('/', (req, res) => {
    res.render('Home');
})

Router.get('/dashboard', (req, res) => {
    eduModal.find({}, function (err, data) {
        if (!err) {
            res.render('Dashboard', { title: "Teachers Records", records: data });
        } else {
            throw err;
        }
    }).clone().catch(function (err) { console.log(err) })
})

Router.get('/profile', ensureAuthenenticated, (req, res) => {
    const user = req.user;
    res.render('Profile',{cuser:user});
})

Router.get('/contact', (req, res) => {
    res.render('Contact')
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
            res.render('Dashboard', { title: "Teachers Records", records: data });
        } else {
            throw err;
        }
    }).clone().catch(function (err) { console.log(err) })

})

module.exports = Router;