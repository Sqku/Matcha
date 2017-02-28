let express = require('express');

let router = express.Router();

router.route('/register')
    .get((req, res) => {
        res.render('register');
    })

    .post((req, res) => {
        res.json(req.body);
        if (req.body.first_name === 'undefined' || req.body.first_name === '')
        {
            console.log("ok");
        }
    });


module.exports = router;