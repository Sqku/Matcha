let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let auth = require('../middleware/auth');


router.route('/myProfile')
    .get(auth, (req, res) => {
        res.locals.profile = req.session.user;
        res.render('myProfile');
    });

module.exports = router;
