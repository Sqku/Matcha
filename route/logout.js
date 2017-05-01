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
        res.locals.user = req.session.user;

        console.log(req.session.user.id);
        User.userStatus(req.session.user.id, "offline");
        // req.session.user = undefined;
        // req.session.destroy();
        console.log("logout");
        res.render('logout');

        // http.listen(port, function(){
        //     console.log('listening on localhost:3000');
        // });



    });





module.exports = router;
