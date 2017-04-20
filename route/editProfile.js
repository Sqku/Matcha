let express = require('express');
let path = require('path');
// let form_validator = require('../form_validator');
// let db = require('../db_start');
// let session = require('express-session');
let functions = require('../middleware/functions');
let User = require('../model/user');
let form_validator = require('../form_validator');
let sha256 = require("crypto-js/sha256");
let valid_editProfile = require('../middleware/valid_editProfile');
let auth = require('../middleware/auth');


let router = express.Router();

router.route('/editProfile')
    .get(auth, (req, res) => {
        if (req.session.success){
            res.locals.success = req.session.success;
            req.session.success = undefined;
        }
        if (req.session.errors){
            res.locals.errors = req.session.errors;
            req.session.errors = undefined;
        }
        res.locals.body = req.session.body;
        req.session.body = undefined;

        res.locals.profile = req.session.user;

        User.getTags((result) => {
            if(result)
            {
                let tags = [];
                console.log("tags :",result);
                for (k in result){
                    tags.push(result[k].tag);
                    // if(tags == "")
                    //     tags = result[k].tag;
                    // else
                    //     tags = tags + "," + result[k].tag;
                }
                res.locals.tags = tags;
            }
            else
                res.locals.tags = "";
        });

        User.findUserTags(req.session.user.id, (result) => {
            if(result)
            {
                let tags = "";
                for (k in result){
                    if(tags == "")
                        tags = result[k].tag;
                    else
                        tags = tags + "," + result[k].tag;
                }
                res.locals.profile.tags = tags;
            }
        });

        User.findProfile(req.session.user.id, (result) => {
            res.locals.profile.sex_orientation = result.sex_orientation;
            res.locals.profile.bio = result.bio;

            res.render('editProfile');
        });
    })

    .post(auth, valid_editProfile, (req, res) => {
        // console.log("DELETED TAGS",req.body.deleted_tags);

        String.prototype.replaceAll = function(search, replacement) {
            let target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };

        let profile = {
            sex_orientation : req.body.sex_orientation,
            bio : functions.newLineInP(functions.escapeHtml(req.body.bio)),
            // bio : req.body.bio,
            user_id : req.session.user.id,
        };
        let user = {
            id : req.session.user.id,
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            email : req.body.email,
            gender : req.body.gender
        };

        if(form_validator.notEmpty(req.body.tags))
        {
            let split = req.body.tags.split(",");
            for (k in split) {
                let trim = split[k].trim();
                User.isUniqueTag("tag", trim, (count) => {
                    if(count == 0)
                    {
                        User.createTags(trim);
                    }
                    User.getTagid(trim, (result) => {
                        User.addUserTags(result.id, req.session.user.id);
                    });
                });
            }
        }

        if(form_validator.notEmpty(req.body.deleted_tags))
        {
            let split = req.body.deleted_tags.split(",");
            for (k in split) {
                let trim = split[k].trim();
                User.getTagid(trim, (result) => {
                    if (result)
                        User.deleteUserTags(result.id, req.session.user.id);
                })
            }
        }

        User.updateProfil(profile);

        User.updateUser(user);

        User.findUser(req.session.user.user_name, (result) => {
            req.session.user = result;
            req.session.success = "true";

            res.redirect('editProfile');
        });
    });

module.exports = router;

