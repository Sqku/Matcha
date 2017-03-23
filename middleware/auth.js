let express = require('express');
let session = require('express-session');

let auth = (req, res, next) => {

    if (req.session && req.session.user)
    {
        next();
    }
    else
    {
        if(Object.keys(req.query).length != 0)
        {
            req.session.redirectTo = req.path;
            req.session.query_string = req.query;
        }
        else
            req.session.redirectTo = req.path;

        res.render('auth');
    }
};

module.exports = auth;
