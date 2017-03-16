let express = require('express');
let router = express.Router();
let session = require('express-session');
let auth = require('../middleware/auth');


router.route('/dashboard')
    .get(auth, (req, res) => {
        if (req.session.errors){
            res.locals.errors = req.session.errors;
            req.session.errors = undefined;
        }
        res.locals.body = req.session.body;
        req.session.body = undefined;
        res.render('dashboard');
});

module.exports = router;
