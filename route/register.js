let express = require('express');
// let form_validator = require('../form_validator');
// let db = require('../db_start');
// let session = require('express-session');
let User = require('../model/user');
let sha256 = require("crypto-js/sha256");

let valid_form = require('../middleware/valid_form');

let router = express.Router();


router.route('/register')
    .get((req, res) => {
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
        res.render('register');
    })

    .post(valid_form, (req, res) => {

        let salt = sha256(Math.random() + req.body.user_name);
        let password = sha256(salt + req.body.password);
        let dateSplit = req.body.date_of_birth.split("/");
        let date_of_birth = new Date(Date.UTC(dateSplit[2], dateSplit[1] - 1, dateSplit[0]));
        let token = sha256(req.body.email + Date.now());

        User.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            user_name : req.body.user_name,
            password : password,
            email : req.body.email,
            date_of_birth : date_of_birth,
            gender : req.body.gender,
            salt : salt,
            token : token
        }, () => {
            User.sendEmail(req.body.email, token, req.get('host'), req.body.user_name);
            User.findUser(req.body.user_name, (result) => {
                User.defaultProfile(result.id);
                req.session.success = "true";
                req.session.user_name = req.body.user_name;

                res.redirect('register');
            });
        });
    });


module.exports = router;