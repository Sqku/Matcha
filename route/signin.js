let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let sha256 = require("crypto-js/sha256");
let logged_in = require('../middleware/logged_in');
let form_validator = require('../form_validator');
let publicIp = require('public-ip');
let where = require('node-where');

router.route('/signin')
    .get((req, res) => {
        if (req.session.errors){
            res.locals.errors = req.session.errors;
            req.session.errors = undefined;
        }
        res.locals.body = req.session.body;
        req.session.body = undefined;
        res.render('signin');
})

    .post(logged_in, (req, res) => {
        console.log(req.body);

        User.findProfile(req.session.user.id, (profile) => {
           if (profile.lat !== 0 && profile.lng !== 0)
           {
               let redirectTo = req.session.redirectTo !== undefined ? req.session.redirectTo : 'dashboard';
               req.session.redirectTo = undefined;
               res.redirect(redirectTo);
           }
           else
           {
               if(form_validator.notEmpty(req.body.lat) && form_validator.notEmpty(req.body.lng))
               {
                   User.updateUserLocation(req.body.lat, req.body.lng, req.session.user.id);
                   let redirectTo = req.session.redirectTo !== undefined ? req.session.redirectTo : 'dashboard';
                   req.session.redirectTo = undefined;
                   res.redirect(redirectTo);
               }
               else
               {
                   publicIp.v4().then(ip => {
                       console.log("my ip: ", ip);
                       where.is(ip, function(err, result) {
                           if (result) {
                               User.updateUserLocation(result.get('lat'), result.get('lng'), req.session.user.id);
                               let redirectTo = req.session.redirectTo !== undefined ? req.session.redirectTo : 'dashboard';
                               req.session.redirectTo = undefined;
                               res.redirect(redirectTo);
                           }
                       });
                   });
               }
           }
        });

        // if(req.session.query_string)
        // {
        //     let redirectTo = req.session.redirectTo !== undefined ? req.session.redirectTo : 'dashboard';
        //     redirectTo = redirectTo+"?user_name="+req.session.query_string.user_name;
        //     req.session.query_string.user_name = undefined;
        //     res.redirect(redirectTo);
        // }
        // let redirectTo = req.session.redirectTo !== undefined ? req.session.redirectTo : 'dashboard';
        // req.session.redirectTo = undefined;
        // res.redirect(redirectTo);
        // creer token csrf
});


module.exports = router;