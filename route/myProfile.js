let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let auth = require('../middleware/auth');
let where = require('node-where');
let form_validator = require('../form_validator');
let publicIp = require('public-ip');

router.route('/myProfile')
    .get(auth, (req, res) => {
        res.locals.profile = req.session.user;

        // var ip = req.headers['x-forwarded-for'] ||
        //     req.connection.remoteAddress ||
        //     req.socket.remoteAddress ||
        //     req.connection.socket.remoteAddress;
        // console.log(ip);


        let split = req.session.user.date_of_birth.split("-");
        let now = new Date();
        res.locals.profile.age = now.getFullYear() - split[0];

        User.findUserTags(req.session.user.id, (result) => {
            if(result)
            {
                res.locals.profile.tags = result;
            }
            User.findProfile(req.session.user.id, (profile) => {
                res.locals.profile.sex_orientation = profile.sex_orientation;
                res.locals.profile.bio = profile.bio;
                res.locals.profile.profile_picture = profile.profile_picture;

                res.locals.profile.ip = {
                    lat : profile.lat,
                    lng : profile.lng
                };
                res.locals.profile.user_location = "true";
                User.countUserNotification(req.session.user.id, (count) => {
                    res.locals.count_notif = count;
                    res.render('myProfile');
                });

            });
        });
    })


    .post(auth, (req, res) => {

        if((form_validator.notEmpty(req.body.lat) && req.body.lat !== '0') && (form_validator.notEmpty(req.body.lng) && req.body.lng !== '0'))
        {
            console.log("body not empty");
            console.log(req.body);
            User.updateUserLocation(req.body.lat, req.body.lng, req.body.city, req.body.departement, req.body.country, req.session.user.id);
            res.redirect('myProfile');
        }

        else if (req.body.lat === '0' && req.body.lng === '0')
        {
            console.log("reset location");
            console.log(req.body);
            publicIp.v4().then(ip => {
                console.log("my ip: ", ip);
                where.is(ip, function(err, result1) {
                    if (result1) {
                        console.log(result1);
                        User.updateUserLocation(result1.get('lat'), result1.get('lng'), result1.get('city'), result1.get('postalCode'), result1.get('country'), req.session.user.id);
                        res.redirect('myProfile');
                    }
                });
            });

        }
        else
        {
            res.redirect('myProfile');
        }
});

module.exports = router;
