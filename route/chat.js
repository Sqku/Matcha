let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let auth = require('../middleware/auth');



// let port = 3000;
// let app = express();
// let http = require('http').Server(app);
// let io = require('socket.io')(http);


router.route('/chat')
    .get(auth, (req, res) => {
        // if (req.session.errors){
        //     res.locals.errors = req.session.errors;
        //     req.session.errors = undefined;
        // }
        // res.locals.body = req.session.body;
        // req.session.body = undefined;

        User.findUser(req.query.user_name, (result) => {
            if(result)
            {
                User.isMatch(req.session.user.id, result.id, (count) => {
                    if(count == 2)
                    {
                        res.locals.profile = result;
                        res.locals.user = req.session.user;
                        req.session.receiver_id = result.id;
                        req.session.sender_user = result.user_name;
                        res.locals.profile = result;
                        res.locals.profile.receiver_user_name = result.user_name;
                        res.locals.profile.receiver_user_id = result.id;
                        res.locals.profile.sender_user_name = req.session.user.user_name;
                        res.locals.profile.sender_user_id = req.session.user.id;

                        User.countUserNotification(req.session.user.id, (count) => {
                            res.locals.count_notif = count;
                            res.locals.user_name = req.session.user.user_name;
                            req.session.query = req.query.user_name;
                            res.render('chat');
                        });
                    }
                    else
                    {
                        res.locals.errors = "This user doesnt exist";
                        console.log("you dont match this user");
                        res.status(404).send('404 No Permission');
                    }
                });
            }
            else
            {
                res.locals.errors = "This user doesnt exist";
                console.log("This user doesnt exist");
                res.status(404).send('404 No Permission');
            }
        });
    })

    .post(auth, (req, res) => {
        res.redirect('chat?user_name='+req.session.query);
        req.session.query = undefined;
});

module.exports = router;