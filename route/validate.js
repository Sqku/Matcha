let express = require('express');
let router = express.Router();
let User = require('../model/user');


router.route('/validate')
    .get((req, res) => {
        console.log(req.protocol+"://"+req.get('host'));
        console.log(req.query.user_name);

        User.validate(req.query.user_name, (result) => {
            console.log(result[0].token)
            console.log(result[0].activated)
            // if(result != null)
            // {
            //     console.log("allo");
            //     if(result[1] == 1)
            //         console.log("Your account is already active");
            //     else
            //     {
            //         if(req.query.token)
            //         {
            //             User.activation(req.query.user_name, () => {
            //                 console.log("You successfully activated your account")
            //             })
            //         }
            //         else
            //             console.log("no permission")
            //     }
            // }
        });



        res.render('validate');
    });

module.exports = router;