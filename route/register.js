let express = require('express');
let form_validator = require('../form_validator');
let db = require('../db_start');
let session = require('express-session');
let User = require('../model/user');


let router = express.Router();


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

    if (!form_validator.isNum(req.body.age))
    {
        errors.age = "Invalid Age";
    }

    if (!radioCheck())
    {
        errors.radio = "No Gender checked";
    }

    form_validator.isUnique("user_name", req.body.user_name, (count) => {
        console.log(count);
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
                        console.log(errors);
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
                    console.log(errors);
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


// let newUser = () => {
//     db.connect();
// };



router.route('/register')
    .get((req, res) => {
        if (req.session.errors){
            res.locals.errors = req.session.errors;
            req.session.errors = undefined;
        }
        res.locals.body = req.session.body;
        req.session.body = undefined;
        res.render('register');
    })

    .post(valid_form, (req, res) => {
        res.json(req.body);

    });


module.exports = router;