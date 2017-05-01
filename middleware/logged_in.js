let express = require('express');
let session = require('express-session');
let User = require('../model/user');
let sha256 = require("crypto-js/sha256");
let form_validator = require('../form_validator');


let logged_in = (req, res, next) => {

    let errors = "";

    if(form_validator.notEmpty(req.body.user_name) && form_validator.notEmpty(req.body.password))
    {
        User.findUser(req.body.user_name, (result) => {
            if(result)
            {
                if(sha256(result.salt + req.body.password) == result.password)
                {
                    if(result.activated == 1)
                    {
                        // req.session.user_id = result.id;
                        User.userStatus(result.id, "online");
                        req.session.user = result;
                        next();
                    }
                    else
                    {
                        errors = "Please activate your account";
                        req.session.body = req.body;
                        req.session.errors = errors;
                        res.redirect('signin');
                    }
                }
                else
                {
                    errors = "Wrong combination of User name and Password";
                    req.session.body = req.body;
                    req.session.errors = errors;
                    res.redirect('signin');
                }
            }
            else
            {
                errors = "Wrong combination of User name and Password";
                req.session.body = req.body;
                req.session.errors = errors;
                res.redirect('signin');
            }
        });
    }
    else
    {

        errors = "Empty User name or Password";
        req.session.body = req.body;
        req.session.errors = errors;
        res.redirect('signin');
    }
};



module.exports = logged_in;