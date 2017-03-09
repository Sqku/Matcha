let express = require('express');
let form_validator = require('../form_validator');
// let db = require('../db_start');
let session = require('express-session');
let User = require('../model/user');


let valid_form = (req, res, next) => {

    let radioCheck = () => {
        if (req.body.gender)
        {
            if (req.body.gender === "man") {
            }
            else if(req.body.gender === "woman") {
            }
            return true;
        }
        else
        {
            return false
        }
    };

    let errors = {};


    if (!form_validator.isName(req.body.first_name))
    {
        errors.first_name = "Invalid First name";
    }

    if (!form_validator.isName(req.body.last_name))
    {
        errors.last_name = "Invalid Last name";
    }

    if (!form_validator.isUserName(req.body.user_name))
    {
        errors.user_name = "Invalid User name";
    }

    if (!form_validator.isSafePass(req.body.password))
    {
        errors.password = "Invalid Password";
    }
    if (!form_validator.isSamePass(req.body.password, req.body.confirm_password))
    {
        errors.confirm_password = "Not same Password";
    }

    if (!form_validator.isEmail(req.body.email))
    {
        errors.email = "Invalid Email";
    }

    if (!form_validator.isDateofBirth(req.body.date_of_birth))
    {
        errors.date_of_birth = "Invalid date of birth (You have to be at least 18 years old and under 100 years old)";
    }

    if (!radioCheck())
    {
        errors.radio = "No Gender checked";
    }

    form_validator.isUnique("user_name", req.body.user_name, (count) => {
        if (count != 0)
        {
            errors.user_name = "User Name already taken";
            req.session.errors = errors;
            req.session.body = req.body;

            if(req.body.email)
            {
                form_validator.isUnique("email", req.body.email, (count) => {
                    if (count != 0)
                    {
                        errors.email = "Email already taken";
                        req.session.errors = errors;
                        req.session.body = req.body;
                        res.redirect('/register');
                    }
                });
            }
            else
            {
                res.redirect('/register');
            }
        }
        else
        {
            form_validator.isUnique("email", req.body.email, (count) => {
                if (count != 0)
                {
                    errors.email = "Email already taken";
                    req.session.errors = errors;
                    req.session.body = req.body;
                    // console.log("invalid form");
                    res.redirect('/register');
                }
                else
                {
                    if (Object.keys(errors).length == 0)
                    {
                        next();
                    }
                    else
                    {
                        req.session.errors = errors;
                        req.session.body = req.body;
                        res.redirect('/register');
                    }
                }
            });
        }
    });
};

module.exports = valid_form;