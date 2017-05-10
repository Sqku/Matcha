let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let auth = require('../middleware/auth');


router.route('/profile')
    .get(auth, (req, res) => {

        let filter_sort = "all";
        let filter_dist = 15000;
        let filter_age_left = 18;
        let filter_age_right = 100;
        let filter_popularity_left = 0;
        let filter_popularity_right = 1000;
        if (req.session.filter_age_left !== undefined && req.session.filter_age_right !== undefined)
        {
            filter_age_left = req.session.filter_age_left;
            filter_age_right = req.session.filter_age_right;
            res.locals.filter_age_left = req.session.filter_age_left;
            res.locals.filter_age_right = req.session.filter_age_right;
            req.session.filter_age_left = undefined;
            req.session.filter_age_right = undefined;
        }
        if(req.session.filter_popularity_left !== undefined && req.session.filter_popularity_right !== undefined)
        {
            filter_popularity_left = req.session.filter_popularity_left;
            filter_popularity_right = req.session.filter_popularity_right;
            res.locals.filter_popularity_left = req.session.filter_popularity_left;
            res.locals.filter_popularity_right = req.session.filter_popularity_right;
            req.session.filter_popularity_left = undefined;
            req.session.filter_popularity_right = undefined;
        }
        if (req.session.location_filter !== undefined)
        {
            filter_dist = req.session.location_filter;
            res.locals.filter_dist = req.session.location_filter;
            req.session.location_filter = undefined;
        }
        if (req.session.filter_sort !== undefined)
        {
            filter_sort = req.session.filter_sort;
            res.locals.filter_sort = req.session.filter_sort;
            req.session.filter_sort = undefined;
        }

        let filter_tags = [];
        let search_tags = 0;

        User.getTags((result) => {
            if(result)
            {
                res.locals.tags = result;
                if (req.session.filter_tags === undefined)
                {
                    for (k in result)
                    {
                        filter_tags.push(result[k].tag);
                    }
                }
                else
                {
                    filter_tags = req.session.filter_tags;
                    res.locals.filter_tags = "";
                    if (Array.isArray(filter_tags))
                    {
                        for(k in filter_tags)
                        {
                            if(res.locals.filter_tags == "")
                                res.locals.filter_tags = filter_tags[k];
                            else
                                res.locals.filter_tags = res.locals.filter_tags + "," + filter_tags[k];
                        }
                    }
                    else
                    {
                        res.locals.filter_tags = req.session.filter_tags;
                    }
                    search_tags = 1;
                    req.session.filter_tags = undefined;
                }
            }
            User.findProfile(req.session.user.id, (result) => {
                User.suggestedProfiles(req.session.user.id, result.lat, result.lng, filter_dist, result.sex_orientation, req.session.user.gender, filter_tags, search_tags, filter_age_left, filter_age_right, filter_popularity_left, filter_popularity_right, filter_sort, (result) => {
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

        if(req.body.age !== undefined)
        {
            let split_age = req.body.age.trim().split("-");
            if (split_age !== undefined && (split_age[0] !== undefined && split_age[1] !== undefined))
            {
                req.session.filter_age_left = parseInt(split_age[0]);
                req.session.filter_age_right = parseInt(split_age[1]);
            }
        }
        if(req.body.score !== undefined)
        {
            let split_score = req.body.score.trim().split("-");
            if (split_score !== undefined && (split_score[0] !== undefined && split_score[1] !== undefined))
            {
                req.session.filter_popularity_left = parseInt(split_score[0]);
                req.session.filter_popularity_right = parseInt(split_score[1]);
            }
        }
        if(req.body.tags !== undefined)
        {
            req.session.filter_tags = req.body.tags;
        }

        if (req.body.location !== undefined)
            req.session.location_filter = parseInt(req.body.location);

        if (req.body.sort !== undefined)
            req.session.filter_sort = req.body.sort;


        res.redirect('profile');
});

module.exports = router;
