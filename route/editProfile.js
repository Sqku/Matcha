let express = require('express');
// let form_validator = require('../form_validator');
// let db = require('../db_start');
// let session = require('express-session');
let User = require('../model/user');
let sha256 = require("crypto-js/sha256");
let multer = require('multer');
let upload = multer({ destination: '../public/images/' });
// let upload = multer();

let valid_editProfile = require('../middleware/valid_editProfile');
let auth = require('../middleware/auth');


// let upload = multer({
//     dest: __dirname + '../public/images/',
// });


let router = express.Router();


router.get('/editProfile', auth, (req, res) => {
    if (req.session.success){
        res.locals.success = req.session.success;
        req.session.success = undefined;

        res.locals.user_name = req.session.user_name;
        req.session.user_name = undefined;
    }
    if (req.session.errors){
        res.locals.errors = req.session.errors;
        req.session.errors = undefined;
    }
    res.locals.body = req.session.body;
    req.session.body = undefined;

    res.locals.profile = req.session.user;

    // console.log("res.locals.body :", res.locals.body)

    res.render('editProfile');
});


router.post('/editProfile', upload.single('img'), function(req, res) {
    console.log("req.file :", req.file);
    console.log("req.files :", req.files);
    console.log(req.body);


    res.redirect('editProfile');
});

// router.route('/editProfile')
//     .get(auth, (req, res) => {
//         if (req.session.success){
//             res.locals.success = req.session.success;
//             req.session.success = undefined;
//
//             res.locals.user_name = req.session.user_name;
//             req.session.user_name = undefined;
//         }
//         if (req.session.errors){
//             res.locals.errors = req.session.errors;
//             req.session.errors = undefined;
//         }
//         res.locals.body = req.session.body;
//         req.session.body = undefined;
//
//         res.locals.profile = req.session.user;
//
//
//         res.render('editProfile');
//     })
//
//     .post(upload, (req, res) => {
//
//         console.log("req.file :", req.file);
//         console.log("req.files :", req.files);
//         console.log(req.body);
//
//
//         res.redirect('editProfile');
//
//     });


module.exports = router;
