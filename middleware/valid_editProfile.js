let express = require('express');
let form_validator = require('../form_validator');
// let db = require('../db_start');
let session = require('express-session');
let User = require('../model/user');


let valid_editProfile = (req, res, next) => {

    let radioCheck = () => {
        if (req.body.sex_orientation)
        {
            return true;
        }
        else
        {
            return false
        }
    };

    let bioCheck = (input) => {
        if(input.length <= 500)
            return true;
        else
            return false;
    };

    let tagsCheck = (input) => {
        let split = input.split(",");
        for (k in split)
        {
            let trim = split[k].trim();
            if (!form_validator.isUserName(trim))
                return false;
        }
        return true;
    };

    let errors = {};

    // if(Object.keys(req.body).length == 0)
    // {
    //     errors.err = "an error occured, please reload the page";
    //     req.session.errors = errors;
    //     // req.session.body = req.body;
    //     res.redirect('/editProfile');
    // }

    if (!form_validator.isName(req.body.first_name))
    {
        errors.first_name = "Invalid First name";
    }

    if (!form_validator.isName(req.body.last_name))
    {
        errors.last_name = "Invalid Last name";
    }

    // if (!form_validator.isUserName(req.body.user_name))
    // {
    //     errors.user_name = "Invalid User name";
    // }


    if (!form_validator.isEmail(req.body.email))
    {
        errors.email = "Invalid Email";
    }


    if (!radioCheck())
    {
        errors.sex_orientation = "No sex orientation checked";
    }

    if (!bioCheck(req.body.bio))
    {
        errors.bio = "Maximum 500 characters"
    }

    if (!tagsCheck(req.body.tags))
    {
        errors.tags = "Tags cannot contain special char except '_' and '-' and cannot exceed 20 char"
    }

    console.log("errors :", errors);
    if(req.body.email != req.session.user.email)
    {
        form_validator.isUnique("email", req.body.email, (count) => {
        if (count != 0)
        {
            errors.email = "Email already taken";
            req.session.errors = errors;
            req.session.body = req.body;
            // console.log("invalid form");
            res.redirect('/editProfile');
        }
        else
        {
            if (Object.keys(errors).length == 0)
            {
                req.session.body = req.body;
                next();
            }
            else
            {
                req.session.errors = errors;
                req.session.body = req.body;
                res.redirect('/editProfile');
            }
        }
        });
    }
    else
    {
        if (Object.keys(errors).length == 0)
        {
            req.session.body = req.body;
            next();
        }
        else
        {
            req.session.errors = errors;
            req.session.body = req.body;
            res.redirect('/editProfile');
        }
    }
};

module.exports = valid_editProfile;