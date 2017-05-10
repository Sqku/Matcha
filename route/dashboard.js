let express = require('express');
let router = express.Router();
let session = require('express-session');
let auth = require('../middleware/auth');
let User = require('../model/user');
let form_validator = require('../form_validator');


router.route('/dashboard')
    .get(auth, (req, res) => {
        if (req.session.errors){
            res.locals.errors = req.session.errors;
            req.session.errors = undefined;
        }
        res.locals.body = req.session.body;
        req.session.body = undefined;

        res.locals.user_name = req.session.user.user_name;

        User.getUserNotification(req.session.user.id, (result) => {
            if(result)
            {
                res.locals.notif = [];
                for(k in result)
                {
                    res.locals.notif.push(result[k]);
                }
                User.countUserNotification(req.session.user.id, (count) => {
                    res.locals.count_notif = count;
                    res.render('dashboard');
                });
            }
            else
                User.countUserNotification(req.session.user.id, (count) => {
                    res.locals.count_notif = count;
                    res.render('dashboard');
                });
        });



})

    .post(auth, (req, res) => {
        if(form_validator.notEmpty(req.body.clear_notif) && req.body.clear_notif == "clear")
        {
            User.getUserNotification(req.session.user.id, (result) => {
               if(result)
               {
                   User.clearUserNotification(req.session.user.id, () => {
                       res.redirect('dashboard');
                   });
               }
               else
                   res.redirect('dashboard');
            });

        }
        else
            res.redirect('dashboard');

});

module.exports = router;
