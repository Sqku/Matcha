let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let auth = require('../middleware/auth');



// let port = 3000;
// let app = express();
// let http = require('http').Server(app);
// let io = require('socket.io')(http);


router.route('/logout')
    .get(auth, (req, res) => {
        res.locals.user = req.session.user;

        User.userStatus(req.session.user.id, "offline", () => {
            let now = new Date();
            User.lastOnline(req.session.user.id, now, () => {
                req.session.user = undefined;
                req.session.destroy();
                console.log("logout");
                res.render('logout');
            });
        });
    });





module.exports = router;
