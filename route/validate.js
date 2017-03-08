let express = require('express');
let router = express.Router();


router.route('/validate')
    .get((req, res) => {
        // verifier token validation
        res.render('validate');
    });

