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
        User.getAllprofiles((result) => {
            res.locals.profile = [];
            if(result)
            {
                console.log(result);
                for(k in result)
                {
                    res.locals.profile.push(result[k]);
                }
                console.log(res.locals.profile);
                req.session.user_profile = res.locals.profile;
                res.render('profile');
            }
            else
                res.render('profile');
        });
    })

    .post(auth, (req, res) => {

});

module.exports = router;
