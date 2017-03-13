let express = require('express');
let router = express.Router();
let User = require('../model/user');
let sha256 = require("crypto-js/sha256");
let form_validator = require('../form_validator');

router.route('/signin')
    .get((req, res) => {
        res.render('signin');
})

    .post((req, res) => {
        console.log("1");
        console.log(req.body.user_name);
        if(form_validator.notEmpty(req.body.user_name) && form_validator.notEmpty(req.body.password))
        {
            console.log("2");
            User.findUser(req.body.user_name, (result) => {
                if(result)
                {
                    if(sha256(result.salt + req.body.password) == result.password)
                    {
                        console.log("you are logged in");
                    }
                    else
                    {
                        // locals.errors = "Wrong Password";
                        res.render('signin');
                    }
                }
            });
        }
        else
        {

            console.log("3");
            // locals.errors = "User name or Password empty";
            res.render('signin');
        }
});


module.exports = router;