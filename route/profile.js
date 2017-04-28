let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let auth = require('../middleware/auth');


router.route('/profile')
    .get(auth, (req, res) => {
        // if (req.session.errors){
        //     res.locals.errors = req.session.errors;
        //     req.session.errors = undefined;
        // }
        // res.locals.body = req.session.body;
        // req.session.body = undefined;

        // User.findUser(req.query.user_name, (result) => {
        //     console.log(req.query.user_name);
        //     if(result)
        //     {
        //         res.locals.profile = result;
        //         console.log(res.locals.profile);
        //         res.render('profile');
        //     }
        //     else
        //     {
        //         res.locals.errors = "This user doesnt exist";
        //         console.log("This user doesnt exist");
        //         res.status(404).send('404 No Permission');
        //     }
        // });
        User.getTags((result) => {
            if(result)
            {
                res.locals.tags = result;
            }
        });

        User.findProfile(req.session.user.id, (result) => {
            User.suggestedProfiles(req.session.user.id, result.sex_orientation, req.session.user.gender, (result) => {
                console.log("QQQQQ", result);
            });
        });


        // User.locationProfiles(result.user_id, result.lat, result.lng, 30, (result1) => {
        //     if (result1)
        //     {
        //         // console.log("SUGGESTION :",result1);
        //     }
        // })



        User.getAllprofiles((result) => {
            res.locals.profile = [];
            if(result)
            {
                for(k in result)
                {
                    res.locals.profile.push(result[k]);
                }
                req.session.user_profile = res.locals.profile;
                res.render('profile');
            }
            else
                res.render('profile');
        });
    })

    .post(auth, (req, res) => {
        console.log("body :",req.body);
        res.redirect('profile');
});

module.exports = router;
