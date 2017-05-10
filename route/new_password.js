let express = require('express');
let router = express.Router();
let User = require('../model/user');
let sha256 = require("crypto-js/sha256");
let valid_password = require('../middleware/valid_password');



router.route('/new_password')
    .get((req, res) => {
        if (req.session.errors){
            res.locals.errors = req.session.errors;
            req.session.errors = undefined;
        }
        req.session.user_token = req.query.token;
        req.session.user_token_name = req.query.user_name;
        User.validate(req.query.user_name, (result) => {
            if(result)
            {
                if(req.query.token == result.token)
                {
                    res.render('new_password');
                }
                else
                {
                    res.locals.errors = "No permission";
                    console.log("no permission");
                    res.status(404).send('404 No Permission');
                }

            }
            else
            {
                res.locals.errors = "No permission";
                console.log("wrong user");
                res.status(404).send('404 No Permission');
            }
        });
    })

    .post(valid_password, (req, res) => {
        let salt = sha256(Math.random() + req.session.user_token_name).toString();
        let password = sha256(salt + req.body.password).toString();

        User.updatePassword(req.session.user_token_name, salt, password, () => {
            res.locals.success = "You have successfully changed your password";
            res.render('validate');
        });
        req.session.user_token_name = undefined;
    });

module.exports = router;
