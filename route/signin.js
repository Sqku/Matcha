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
               if (req.session.query_string)
               {
                   let redirectTo = (req.session.redirectTo !== undefined || req.session.redirectTo == 'logout') ? req.session.redirectTo+"?user_name="+req.session.query_string.user_name : 'myProfile';
                   req.session.redirectTo = undefined;
                   req.session.query_string = undefined;
                   res.redirect(redirectTo);
               }
               else
               {
                   let redirectTo = (req.session.redirectTo !== undefined || req.session.redirectTo == 'logout') ? req.session.redirectTo : 'myProfile';
                   req.session.redirectTo = undefined;
                   res.redirect(redirectTo);
               }
           }
           else
           {
               if(form_validator.notEmpty(req.body.lat) && form_validator.notEmpty(req.body.lng))
               {
                   User.updateUserLocation(req.body.lat, req.body.lng, req.body.city, req.body.departement, req.body.country, req.session.user.id, () => {
                       if (req.session.query_string)
                       {
                           let redirectTo = (req.session.redirectTo !== undefined || req.session.redirectTo == 'logout') ? req.session.redirectTo+"?user_name="+req.session.query_string.user_name : 'myProfile';
                           req.session.redirectTo = undefined;
                           req.session.query_string = undefined;
                           res.redirect(redirectTo);
                       }
                       else
                       {
                           let redirectTo = (req.session.redirectTo !== undefined || req.session.redirectTo == 'logout') ? req.session.redirectTo : 'myProfile';
                           req.session.redirectTo = undefined;
                           res.redirect(redirectTo);
                       }
                   });
               }
               else
               {
                   publicIp.v4().then(ip => {
                       console.log("my ip: ", ip);
                       where.is(ip, function(err, result1) {
                           if (result1) {
                               User.updateUserLocation(result1.get('lat'), result1.get('lng'), result1.get('city'), result1.get('postalCode'), result1.get('country'), req.session.user.id, () => {
                                   if (req.session.query_string)
                                   {
                                       let redirectTo = (req.session.redirectTo !== undefined || req.session.redirectTo == 'logout') ? req.session.redirectTo+"?user_name="+req.session.query_string.user_name : 'myProfile';
                                       req.session.redirectTo = undefined;
                                       req.session.query_string = undefined;
                                       res.redirect(redirectTo);
                                   }
                                   else
                                   {
                                       let redirectTo = (req.session.redirectTo !== undefined || req.session.redirectTo == 'logout') ? req.session.redirectTo : 'myProfile';
                                       req.session.redirectTo = undefined;
                                       res.redirect(redirectTo);
                                   }
                               });
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