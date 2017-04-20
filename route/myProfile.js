let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let auth = require('../middleware/auth');
let where = require('node-where');
let form_validator = require('../form_validator');

router.route('/myProfile')
    .get(auth, (req, res) => {
        res.locals.profile = req.session.user;

        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        console.log(ip);


        let split = req.session.user.date_of_birth.split("-");
        let now = new Date();
        res.locals.profile.age = now.getFullYear() - split[0];

        User.findUserTags(req.session.user.id, (result) => {
            if(result)
            {
                res.locals.profile.tags = result;
            }
        });

        where.is(ip, function(err, result) {
            if (result) {

                User.findProfile(req.session.user.id, (profile) => {
                    res.locals.profile.sex_orientation = profile.sex_orientation;
                    res.locals.profile.bio = profile.bio;
                    res.locals.profile.profile_picture = profile.profile_picture;

                    if (profile.lat !== 0 && profile.lng !== 0)
                    {
                        res.locals.profile.ip = {
                            lat : profile.lat,
                            lng : profile.lng
                        };
                        res.locals.profile.user_location = "true";
                        res.render('myProfile');
                    }
                    else
                    {
                        res.locals.profile.ip = {
                            lat : result.get('lat'),
                            lng : result.get('lng')
                        };
                        res.locals.profile.user_location = "false";
                        res.render('myProfile');
                    }
                });


            }
            else
            {
                User.findProfile(req.session.user.id, (profile) => {
                    res.locals.profile.sex_orientation = profile.sex_orientation;
                    res.locals.profile.bio = profile.bio;
                    res.locals.profile.profile_picture = profile.profile_picture;

                    if (profile.lat !== 0 && profile.lng !== 0)
                    {
                        res.locals.profile.ip = {
                            lat : profile.lat,
                            lng : profile.lng
                        };
                        res.locals.profile.user_location = "true";
                        res.render('myProfile');
                    }
                    else
                    {
                        res.locals.profile.ip = {
                            lat : result.get('lat'),
                            lng : result.get('lng')
                        };
                        res.locals.profile.user_location = "false";
                        res.render('myProfile');
                    }
                });
            }
        });

    })

    .post(auth, (req, res) => {

        if(form_validator.notEmpty(req.body.lat) && form_validator.notEmpty(req.body.lng))
        {
            User.updateUserLocation(req.body.lat, req.body.lng, req.session.user.id);
        }

        res.redirect('myProfile');
});

module.exports = router;
