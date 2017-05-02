let express = require('express');
let router = express.Router();
let session = require('express-session');
let User = require('../model/user');
let auth = require('../middleware/auth');
let where = require('node-where');
let form_validator = require('../form_validator');
let publicIp = require('public-ip');

let returnRouter = (io) => {
    router.route('/user_profile')
        .get(auth, (req, res) => {

            User.findUser(req.query.user_name, (result) => {
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

                    User.isMatch(req.session.user.id, req.session.liked_id, (count) => {
                        console.log("MATCH: ", count);

                    });


                    // io.on('connection', function(socket){
                    //     User.isMatch(data.like_user_id, data.liked_user_id, (count) => {
                    //         if (count == 2)
                    //         {
                    //             console.log("TEST MATCH :", count)
                    //             io.sockets.in(data.liked_user_name).emit('match_notif', {
                    //                 liked_user_name : data.liked_user_name,
                    //                 like_user_name : data.like_user_name
                    //             });
                    //             io.sockets.in(data.like_user_name).emit('match_notif', {
                    //                 liked_user_name : data.liked_user_name,
                    //                 like_user_name : data.like_user_name
                    //             });
                    //         }
                    //     });
                    // })



                    User.isBlocked(req.session.user.id, req.session.liked_id, (count) => {
                        if (count == 0)
                        {
                            res.locals.profile.blocked = "true";
                        }
                    });
                    User.isLiked(req.session.user.id, req.session.liked_id, (count) => {
                        if (count == 0)
                        {
                            res.locals.profile.like = "true";
                        }
                    });
                    User.countLike(req.session.liked_id, (count) => {
                        res.locals.profile.count_like = count;
                    });
                    let split = result.date_of_birth.toString().split(" ");
                    let now = new Date();
                    res.locals.profile.age = now.getFullYear() - split[3];



                    User.findUserTags(result.id, (result1) => {
                        if(result1)
                        {
                            res.locals.profile.tags = result1;
                        }
                    });

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
                                        res.render('user_profile');
                                    });
                                }
                                else
                                {
                                    res.locals.profile.visited = "true";
                                    res.locals.profile.liker_profile_picture = profile1.profile_picture;
                                    res.render('user_profile');
                                }
                            });

                        });
                    });

                    // console.log(res.locals.profile);

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
                        User.setLike(req.session.user.id, req.session.liked_id).then((result) => {

                            io.on('connection', function(socket){
                                socket.emit('like', {
                                    liked_user_name : req.session.user.user_name,
                                    liked_user_id : req.session.liked_id,
                                    like_user_name : req.session.user.user_name,
                                    like_user_id : req.session.liked_id
                                })
                            });

                            res.redirect('user_profile?user_name=' + req.session.liked_user);
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
                            res.redirect('user_profile?user_name=' + req.session.liked_user);
                        });
                    }
                    else
                        res.redirect('user_profile?user_name=' + req.session.liked_user);
                })
            }
            else
                res.redirect('user_profile?user_name=' + req.session.liked_user);


        });

    return router;
}

module.exports = returnRouter;
