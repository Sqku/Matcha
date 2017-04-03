let express = require('express');
let form_validator = require('../form_validator');
// let db = require('../db_start');
let session = require('express-session');
let User = require('../model/user');


let valid_editProfile = (req, res, next) => {

    let radioCheck = () => {
        if (req.body.sex_orientation)
        {
            // if (req.body.gender === "man") {
            // }
            // else if(req.body.gender === "woman") {
            // }
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

    // if (!form_validator.isSafePass(req.body.password))
    // {
    //     errors.password = "Password must contain at least 8 characters and at least 1 alphabet and 1 number";
    // }
    // if (!form_validator.isSamePass(req.body.password, req.body.confirm_password))
    // {
    //     errors.confirm_password = "Not same Password";
    // }

    if (!form_validator.isEmail(req.body.email))
    {
        errors.email = "Invalid Email";
    }

    // if (!form_validator.isDateofBirth(req.body.date_of_birth))
    // {
    //     errors.date_of_birth = "Invalid date of birth (You have to be at least 18 years old and under 100 years old)";
    // }

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