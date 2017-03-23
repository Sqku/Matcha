let express = require('express');
let router = express.Router();
let User = require('../model/user');



router.route('/validate')
    .get((req, res) => {
        User.validate(req.query.user_name, (result) => {
            if(result)
            {
                if(result.activated == 1) {
                    res.locals.errors = "Your account is already active";
                    res.render('validate');
                }
                else
                {
                    if(req.query.token == result.token)
                    {
                        User.activation(req.query.user_name, () => {
                            res.locals.success = "You successfully activated your account";
                            res.render('validate');
                        })
                    }
                    else
                    {
                        res.locals.errors = "No permission";
                        console.log("no permission");
                        res.send('404 No Permission', 404);
                    }
                }
            }
            else
            {
                res.locals.errors = "No permission";
                console.log("wrong user");
                res.send('404 No Permission', 404);
            }
        });




    });

module.exports = router;