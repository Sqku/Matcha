let express = require('express');
let session = require('express-session');

let auth = (req, res, next) => {

    if (req.session && req.session.user_id)
    {
        next();
    }
    else
    {
        req.session.redirectTo = req.path;
        res.render('auth');
    }
};

module.exports = auth;
