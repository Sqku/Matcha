let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let sha256 = require("crypto-js/sha256");
let logged_in = require('../middleware/logged_in');

router.route('/signin')
    .get((req, res) => {
        if (req.session.errors){
            res.locals.errors = req.session.errors;
            req.session.errors = undefined;
        }
        res.locals.body = req.session.body;
        req.session.body = undefined;
        res.render('signin');
})

    .post(logged_in, (req, res) => {
        console.log("welcome");

        res.render('dashboard');
        // creer token csrf
});


module.exports = router;