let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let auth = require('../middleware/auth');
let where = require('node-where');
let form_validator = require('../form_validator');
let publicIp = require('public-ip');


    router.route('/user_profile')
        .get(auth, (req, res) => {

            User.findUser(req.query.user_name, (result) => {
                if(req.query.user_name == req.session.user.user_name)
                    res.redirect('myProfile');

                console.log(req.query.user_name);
                if(result)
                {
                    // if (result.id == req.session.user.id)
                    // {
                    //     res.redirect('myProfile');
                    // }
                    req.session.liked_id = result.id;
                    req.session.liked_user = result.user_name;
                    res.locals.profile = result;
                    res.locals.profile.liked_user_name = result.user_name;
                    res.locals.profile.liked_user_id = result.id;
                    res.locals.profile.like_user_name = req.session.user.user_name;
                    res.locals.profile.like_user_id = req.session.user.id;

                    User.isBlocked(req.session.user.id, req.session.liked_id, (count) => {
                        if (count == 0)
                        {
                            res.locals.profile.blocked = "true";
                        }
                        User.isLiked(req.session.user.id, req.session.liked_id, (count) => {
                            if (count == 0)
                            {
                                res.locals.profile.like = "true";
                            }
                            User.isReported(req.session.user.id, req.session.liked_id, (count) => {
                                if (count == 0)
                                {
                                    res.locals.profile.reported = "true";
                                }
                                User.countLike(req.session.liked_id, (count) => {
                                    res.locals.profile.count_like = count;

                                    let split = result.date_of_birth.toString().split(" ");
                                    let now = new Date();
                                    res.locals.profile.age = now.getFullYear() - split[3];

                                    User.findUserTags(result.id, (result1) => {
                                        if(result1)
                                        {
                                            res.locals.profile.tags = result1;
                                        }
                                        User.findProfile(result.id, (profile) => {
                                            res.locals.profile.sex_orientation = profile.sex_orientation;
                                            res.locals.profile.bio = profile.bio;
                                            res.locals.profile.profile_picture = profile.profile_picture;
                                            res.locals.profile.online = profile.online;

                                            res.locals.profile.ip = {
                                                lat : profile.lat,
                                                lng : profile.lng
                                            };
                                            User.findProfile(req.session.user.id, (profile1) => {
                                                User.isVisited(req.session.user.id, req.session.liked_id, (count) => {
                                                    console.log("VISIT :", req.session.liked_id)
                                                    if (count == 0)
                                                    {
                                                        res.locals.profile.visited = "false";
                                                        User.setVisit(req.session.user.id, req.session.liked_id, () => {
                                                            res.locals.profile.liker_profile_picture = profile1.profile_picture;
                                                            User.countUserNotification(req.session.user.id, (count) => {
                                                                res.locals.count_notif = count;
                                                                User.updateUserScore(5, req.session.liked_id, () => {
                                                                    User.countVisit(req.session.liked_id, (count) => {
                                                                        res.locals.count_visit = count;
                                                                        res.render('user_profile');
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    }
                                                    else
                                                    {
                                                        res.locals.profile.visited = "true";
                                                        res.locals.profile.liker_profile_picture = profile1.profile_picture;
                                                        User.countUserNotification(req.session.user.id, (count) => {
                                                            res.locals.count_notif = count;
                                                            User.countVisit(req.session.liked_id, (count) => {
                                                                res.locals.count_visit = count;
                                                                res.render('user_profile');
                                                            });
                                                        });
                                                    }
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
                else
                {
                    res.locals.errors = "This user doesnt exist";
                    console.log("This user doesnt exist");
                    res.status(404).send('404 No Permission');
                }
            });

        })


        .post(auth, (req, res) => {
            console.log(req.session.user.id);
            console.log(req.session.liked_id);

            if(form_validator.notEmpty(req.body.report) && req.body.report == "report")
            {
                User.isReported(req.session.user.id, req.session.liked_id, (count) => {
                    if (count == 0)
                    {
                        User.setReport(req.session.user.id, req.session.liked_id);
                    }
                })
            }

            if(form_validator.notEmpty(req.body.block) && req.body.block == "block")
            {
                User.isBlocked(req.session.user.id, req.session.liked_id, (count) => {
                    if (count == 0)
                    {
                        User.setBlock(req.session.user.id, req.session.liked_id);
                    }
                })
            }
            if(form_validator.notEmpty(req.body.unblock) && req.body.unblock == "unblock")
            {
                User.isBlocked(req.session.user.id, req.session.liked_id, (count) => {
                    if (count != 0) {
                        User.unBlock(req.session.user.id, req.session.liked_id);
                    }
                })
            }

            if (form_validator.notEmpty(req.body.like) && req.body.like == "like")
            {
                User.isLiked(req.session.user.id, req.session.liked_id, (count) => {
                    if (count == 0)
                    {
                        User.setLike(req.session.user.id, req.session.liked_id, () => {
                            User.updateUserScore(20, req.session.liked_id, () => {
                                res.redirect('user_profile?user_name=' + req.session.liked_user);
                            });
                        });
                    }
                    else
                        res.redirect('user_profile?user_name=' + req.session.liked_user);
                })
            }
            else if (form_validator.notEmpty(req.body.dislike) && req.body.dislike == "dislike")
            {
                User.isLiked(req.session.user.id, req.session.liked_id, (count) => {
                    if (count != 0)
                    {
                        User.disLike(req.session.user.id, req.session.liked_id, () => {
                            User.deleteMatch(req.session.user.id, req.session.liked_id, () => {
                                User.updateUserScore(-20, req.session.liked_id, () => {
                                    res.redirect('user_profile?user_name=' + req.session.liked_user);
                                });
                            });
                        });
                    }
                    else
                        res.redirect('user_profile?user_name=' + req.session.liked_user);
                })
            }
            else
                res.redirect('user_profile?user_name=' + req.session.liked_user);


        });

module.exports = router;
