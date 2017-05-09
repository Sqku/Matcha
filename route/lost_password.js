let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let sha256 = require("crypto-js/sha256");
let logged_in = require('../middleware/logged_in');
let form_validator = require('../form_validator');


router.route('/lost_password')
    .get((req, res) => {
        if (req.session.errors){
            res.locals.errors = req.session.errors;
            req.session.errors = undefined;
        }
        res.locals.body = req.session.body;
        req.session.body = undefined;
        if (req.session.success_pass !== undefined)
        {
            res.locals.success_pass = req.session.success_pass;
            req.session.success_pass = undefined
        }
        res.render('lost_password');
    })

    .post((req, res) => {
        if(form_validator.notEmpty(req.body.user_name))
        {
            User.findUser(req.body.user_name, (result) => {
                if(result)
                {
                    if(result.activated === 1)
                    {
                        let token = sha256(result.email + Date.now()).toString();

                        User.sendEmailPassword(result.email, token, req.get('host'), req.body.user_name);
                        User.updateUserToken(token, result.id, () => {
                            req.session.success_pass = "An email has been sent to "+req.body.user_name+". Follow email's instructions to reset your password.";
                            res.redirect('lost_password');
                        });
                    }
                    else
                    {
                        errors = "Your can't reset your password if your account is not activated yet";
                        req.session.body = req.body;
                        req.session.errors = errors;
                        res.redirect('lost_password');
                    }
                }
                else
                {
                    errors = "Wrong User";
                    req.session.body = req.body;
                    req.session.errors = errors;
                    res.redirect('lost_password');
                }
            });
        }
        else
        {
            errors = "Empty User name";
            req.session.body = req.body;
            req.session.errors = errors;
            res.redirect('lost_password');
        }
    });

module.exports = router;