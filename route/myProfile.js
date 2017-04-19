let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let auth = require('../middleware/auth');
let where = require('node-where');

router.route('/myProfile')
    .get(auth, (req, res) => {
        res.locals.profile = req.session.user;

        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        console.log(ip);

        where.is(ip, function(err, result) {
            if (result) {
                // console.log('City: ' + result.get('city'));
                // console.log('State / Region: ' + result.get('region'));
                // console.log('State / Region Code: ' + result.get('regionCode'));
                // console.log('Zip: ' + result.get('postalCode'));
                // console.log('Country: ' + result.get('country'));
                // console.log('Country Code: ' + result.get('countryCode'));
                // console.log('Lat: ' + result.get('lat'));
                // console.log('Lng: ' + result.get('lng'));

                res.locals.profile.ip = {
                    lat : result.get('lat'),
                    lng : result.get('lng')
                };
                res.render('myProfile');
            }
            else
                res.render('myProfile');
        });

        // res.render('myProfile');
        // console.log(req.ip);
        // console.log(req.ips);
        // console.log(req.headers['x-forwarded-for']);
    });

module.exports = router;
