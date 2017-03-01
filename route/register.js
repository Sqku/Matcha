let express = require('express');
let form_validator = require('../form_validator');
let db = require('../db_start');
let session = require('express-session');


let router = express.Router();

let valid_form = (req, res, next) => {

    let radioCheck = () => {
        if (req.body.gender)
        {
            if (req.body.gender === "man") {
                console.log("man")
            }
            else if(req.body.gender === "woman") {
                console.log("woman")
            }
            return true;
        }
        else
        {
            console.log("no radio checked");
            return false
        }
    };

    let i = 0;

    if (form_validator.isName(req.body.first_name))
    {
        console.log("valid first name");
        i++;
    }
    else
    {
        req.session.first_name_err = "invalid First name !";
        // res.redirect('/register');
        // return
    }

    if (form_validator.isName(req.body.last_name))
    {
        console.log("valid last name");
        i++;
    }

    if (form_validator.isUserName(req.body.user_name))
    {
        console.log("valid user name");
        i++;
    }

    if (form_validator.isSafePass(req.body.password))
    {
        console.log("safe password");
        i++;
    }
    if (form_validator.isSamePass(req.body.password, req.body.confirm_password))
    {
        console.log("same password");
        i++;
    }

    if (form_validator.isEmail(req.body.email))
    {
        console.log("valid email");
        i++;
    }

    if (form_validator.isNum(req.body.age))
    {
        console.log("valid age");
        i++;
    }

    if (radioCheck())
    {
        i++;
        console.log(i);
    }

    console.log(i);

    if (i === 8)
    {
        return next();
    }
    else
    {
        console.log("invalid form");
        res.redirect('/register')
    }
};


let newUser = () => {
    db.connect();
};



router.route('/register')
    .get((req, res) => {
        if (req.session.first_name_err){
            console.log("err");
            res.locals.first_name_err = req.session.first_name_err;
            req.session.first_name_err = undefined;
        }
        res.render('register');
    })

    .post(valid_form, (req, res) => {
        res.json(req.body);


        // if (form_validator.isName(req.body.first_name))
        // {
        //     console.log("valid first name");
        // }
        //
        // if (form_validator.isName(req.body.last_name))
        // {
        //     console.log("valid last name");
        // }
        //
        // if (form_validator.isUserName(req.body.user_name))
        // {
        //     console.log("valid user name")
        // }
        //
        // if (form_validator.isSafePass(req.body.password))
        // {
        //     console.log("safe password")
        // }
        // if (form_validator.isSamePass(req.body.password, req.body.confirm_password))
        // {
        //     console.log("same password")
        // }
        //
        // if (form_validator.isEmail(req.body.email))
        // {
        //     console.log("valid email")
        // }
        //
        // if (form_validator.isNum(req.body.age))
        // {
        //     console.log("valid age")
        // }
        //
        // let radioCheck = () => {
        //     if (req.body.gender)
        //     {
        //         if (req.body.gender === "man") {
        //             console.log("man")
        //         }
        //         else if(req.body.gender === "woman") {
        //             console.log("woman")
        //         }
        //     }
        //     else
        //     {
        //         console.log("no radio checked")
        //     }
        // };
        // radioCheck();

        // else
        // {
        //     console.log("password must contain at least 8 characters, at least 1 Alphabet and 1 Number")
        // }
    });


module.exports = router;