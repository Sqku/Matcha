let express = require('express');
let router = express.Router();
let session = require('express-session');
let auth = require('../middleware/auth');


router.route('/profile')
    .get(auth, (req, res) => {
        if (req.session.errors){
            res.locals.errors = req.session.errors;
            req.session.errors = undefined;
        }
        res.locals.body = req.session.body;
        req.session.body = undefined;

        // req.session.redirectTo = req.path;
        res.render('profile');
    });

module.exports = router;
