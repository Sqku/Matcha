let express = require('express');
let form_validator = require('../form_validator');
// let db = require('../db_start');
let session = require('express-session');
let User = require('../model/user');

let valid_password = (req, res, next) => {

    let errors = {};

    if (!form_validator.isSafePass(req.body.password))
    {
        errors.password = "Password must contain at least 8 characters and at least 1 alphabet and 1 number";
    }
    if (!form_validator.isSamePass(req.body.password, req.body.confirm_password))
    {
        errors.confirm_password = "Not same Password";
    }

    if (Object.keys(errors).length == 0)
    {
        next();
    }
    else
    {
        req.session.errors = errors;
        res.redirect('new_password?token='+req.session.user_token+'&user_name='+req.session.user_token_name);
        req.session.user_token = undefined;
    }

};

module.exports = valid_password;