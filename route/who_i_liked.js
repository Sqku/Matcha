let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let auth = require('../middleware/auth');


router.route('/who_i_liked')
    .get(auth, (req, res) => {

        User.getAllprofiles((result) => {
            res.locals.profile = [];
            if(result)
            {
                let counter = 0;
                for(let k = 0; k < result.length; k++)
                {
                    User.isLiked(req.session.user.id, result[k].user_id, (count) => {
                        console.log("count : ", count);
                        if (count == 1)
                        {
                            res.locals.profile.push(result[k]);
                        }
                        if (counter == result.length - 1)
                        {
                            req.session.user_profile = res.locals.profile;
                            console.log("res.locals.profile : ", res.locals.profile);
                            User.countUserNotification(req.session.user.id, (count) => {
                                res.locals.count_notif = count;
                                res.locals.user_name = req.session.user.user_name;
                                res.render('who_i_liked');
                            });
                        }
                        counter++;
                    });
                }
                // req.session.user_profile = res.locals.profile;
                // console.log("res.locals.profile : ", res.locals.profile);
                // res.render('matches');
            }
            else
                User.countUserNotification(req.session.user.id, (count) => {
                    res.locals.count_notif = count;
                    res.render('who_i_liked');
                });
        });
    })

    .post(auth, (req, res) => {
        res.redirect('who_i_liked');
    });

module.exports = router;


