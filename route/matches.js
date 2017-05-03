let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let auth = require('../middleware/auth');


router.route('/matches')
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


        let matche = new Promise((resolve, reject) => {
            for(k in result)
            {
                User.isMatch(req.session.user.id, result[k].user_id, (count) => {
                    console.log("count : ", count);
                    if (count == 2)
                    {
                        res.locals.profile.push(result[k]);
                    }
                });
            }
        });

        User.getAllprofiles((result) => {
            res.locals.profile = [];
            if(result)
            {
                let counter = 0;
                for(let k = 0; k < result.length; k++)
                {
                    User.isMatch(req.session.user.id, result[k].user_id, (count) => {
                        console.log("count : ", count);
                        if (count == 2)
                        {
                            res.locals.profile.push(result[k]);
                        }
                        if (counter == result.length - 1)
                        {
                            req.session.user_profile = res.locals.profile;
                            console.log("res.locals.profile : ", res.locals.profile);
                            res.render('matches');
                        }
                        counter++;
                    });
                }
                // req.session.user_profile = res.locals.profile;
                // console.log("res.locals.profile : ", res.locals.profile);
                // res.render('matches');
            }
            else
                res.render('matches');
        });
    })

    .post(auth, (req, res) => {
        console.log("body :",req.body);
        res.redirect('matches');
    });

module.exports = router;

