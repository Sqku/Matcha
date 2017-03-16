let express = require('express');
let session = require('express-session');

let auth = (req, res, next) => {

    if (req.session && req.session.user_id)
    {
        console.log("auth");
        next();
    }
    else
    {
        console.log("not auth");
        res.render('auth');
    }
};

module.exports = auth;
