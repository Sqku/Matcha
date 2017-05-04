let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let auth = require('../middleware/auth');


router.route('/profile')
    .get(auth, (req, res) => {

        User.getTags((result) => {
            if(result)
            {
                res.locals.tags = result;
            }
            User.findProfile(req.session.user.id, (result) => {
                User.suggestedProfiles(req.session.user.id, result.sex_orientation, req.session.user.gender, (result) => {
                    console.log("QQQQQ", result);
                    res.locals.profile = [];
                    if(result)
                    {
                        for(k in result)
                        {
                            res.locals.profile.push(result[k]);
                        }
                        req.session.user_profile = res.locals.profile;
                        User.countUserNotification(req.session.user.id, (count) => {
                            res.locals.count_notif = count;
                            res.locals.user_name = req.session.user.user_name;
                            res.render('profile');
                        });
                    }
                    else
                        User.countUserNotification(req.session.user.id, (count) => {
                            res.locals.count_notif = count;
                            res.locals.user_name = req.session.user.user_name;
                            res.render('profile');
                        });
                });
            });
        });
    })

    .post(auth, (req, res) => {
        console.log("body :",req.body);
        res.redirect('profile');
});

module.exports = router;
