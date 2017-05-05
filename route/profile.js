let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let auth = require('../middleware/auth');


router.route('/profile')
    .get(auth, (req, res) => {

        let filter_tags = [ 'blue', 'yellow', 'black' ];
        let tags = "";
        for (k in filter_tags)
        {
            if(tags == "")
                tags = filter_tags[k].tag;
            else
                tags = tags + ", " + filter_tags[k].tag;
        }
        console.log(tags);

        User.getTags((result) => {
            if(result)
            {
                res.locals.tags = result;
            }
            User.findProfile(req.session.user.id, (result) => {
                User.suggestedProfiles(req.session.user.id, result.lat, result.lng, 15000, result.sex_orientation, req.session.user.gender, "all", (result) => {
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
        console.log("body :",req.body.tags);
        // console.log("body :",req.body.tags[0]);

        let tags = "";
        for (k in req.body.tags)
        {
            if(tags == "")
                tags = req.body.tags[k];
            else
                tags = tags + ", " + req.body.tags[k];
        }
        console.log("SELECTED TAGS :", tags);

        res.redirect('profile');
});

module.exports = router;
