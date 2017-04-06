let express = require('express');
let path = require('path');
// let form_validator = require('../form_validator');
// let db = require('../db_start');
// let session = require('express-session');
let User = require('../model/user');
let sha256 = require("crypto-js/sha256");
let multer = require('multer');
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname).toLowerCase());
    }
});




// fileFilter : function(req, file, cb){
//     let filetypes = /jpeg|jpg/;
//     let mimetype = filetypes.test(file.mimetype);
//     let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//
//     if (mimetype && extname) {
//         return cb(null, true);
//     }
//     cb("Error: File upload only supports the following filetypes - " + filetypes);
// }



// let upload = multer({ destination: '../public/images/' });
let upload = multer({
    storage : storage,
    limits : {fileSize : 8000000, files : 1},
    fileFilter : function(req, file, cb){
    let filetypes = /jpeg|jpg|gif|png/;
    let mimetype = filetypes.test(file.mimetype);
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb("Error: only images filetypes are allowed");
    }
    }).single('img');


let valid_editProfile = require('../middleware/valid_editProfile');
let auth = require('../middleware/auth');


let router = express.Router();

router.route('/editProfile')
    .get(auth, (req, res) => {
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

        User.findProfile(req.session.user.id, (result) => {
            console.log(res.locals.profile);
            res.locals.profile.sex_orientation = result.orientation;
            res.locals.profile.bio = result.bio;
            console.log(res.locals.profile);
            console.log(res.locals.body);

            res.render('editProfile');
        });

        //to do : check condition pour les radio si woman dans db


    })

    .post(valid_editProfile, (req, res) => {

        User.findUser(req.session.user.user_name, (result) => {
            req.session.user = result;
            res.redirect('editProfile');
        });
        // upload(req, res, (err) => {
        //     console.log("req.file :", req.file);
        //     console.log("req.files :", req.files);
        //     console.log(req.body);
        //     if(err)
        //     {
        //         res.send(err);
        //     }
        //     else
        //         res.redirect('editProfile');
        // });

    });


module.exports = router;

