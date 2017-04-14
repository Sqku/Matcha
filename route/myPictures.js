let express = require('express');
let path = require('path');
let form_validator = require('../form_validator');
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
        cb(null, req.session.user.user_name + '-' + Date.now() + path.extname(file.originalname).toLowerCase());
    }
});


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
        cb("Only images filetypes are allowed");
    }
}).single('img');


let valid_editProfile = require('../middleware/valid_editProfile');
let auth = require('../middleware/auth');


let router = express.Router();


router.route('/myPictures')
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
            res.locals.profile.profile_picture = result.profile_picture;

            User.getUserImages(req.session.user.id, (result) => {
                if (result)
                {
                    // console.log("result :", result);
                    res.locals.profile.images = result;
                    res.render('myPictures');
                }
                else
                    res.render('myPictures');
            });

        });

        // User.getUserImages(req.session.user.id, (result) => {
        //     if (result)
        //     {
        //         // console.log("result :", result);
        //         res.locals.profile.images = result;
        //         res.render('myPictures');
        //     }
        //     else
        //         res.render('myPictures');
        // });




    })

    .post((req, res) => {

        let errors = {};

        console.log(req.body)
        upload(req, res, (err) => {
            if(err)
            {
                errors.file = err;
                req.session.errors = errors;
                res.redirect('myPictures');
            }

            else if(req.file === undefined)
            {
                console.log("req.body :", req.body);
                if(form_validator.notEmpty(req.body.profile_picture))
                {
                    let split = req.body.delete.split("/");
                    User.findProfile(req.session.user.id, (result) => {
                       if (result.profile_picture == split[2])
                       {
                           User.updateProfilePicture("", req.session.user.id);
                       }
                    }); // TO DO : DELETE PICTURE

                }
                if(form_validator.notEmpty(req.body.profile_picture))
                {
                    let split = req.body.profile_picture.split("/");

                    User.updateProfilePicture(split[2], req.session.user.id);
                }
                errors.file = "Please select a image to upload";
                req.session.errors = errors;
                res.redirect('myPictures');
            }
            else
            {
                console.log(req.body)
                User.countUserImages(req.session.user.id, (result) => {
                    console.log(result);
                    if (result < 5)
                    {
                        User.addUserImages(req.file.filename, req.session.user.id, () => {
                            req.session.success = "true";
                            res.redirect('myPictures');
                        });
                    }
                    else
                    {
                        errors.file = "You cant have more than 5 photos";
                        req.session.errors = errors;
                        res.redirect('myPictures');
                    }
                });
            }


        });
    });


module.exports = router;


