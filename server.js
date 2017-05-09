let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
let db = require('./db_start');
let register = require('./route/register');
let validate = require('./route/validate');
let dashboard = require('./route/dashboard');
let signin = require('./route/signin');
let profile = require('./route/profile');
let editProfile = require('./route/editProfile');
let myProfile = require('./route/myProfile');
let myPictures = require('./route/myPictures');
let user_profile = require('./route/user_profile');
let search = require('./route/search');
let chat = require('./route/chat');
let matches = require('./route/matches');
let who_visited_me = require('./route/who_visited_me');
let who_i_liked = require('./route/who_i_liked');
let who_liked_me = require('./route/who_liked_me');
let lost_password = require('./route/lost_password');
let new_password = require('./route/new_password');
let logout = require('./route/logout');
let functions = require('./middleware/functions');
let User = require('./model/user');



let port = 3000;


let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);


app.set('view engine', 'ejs');
app.locals.pretty = true;



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/static', express.static('public', { redirect : false}));

let sessionMiddleware = session({
    secret: 'matcha',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
});

io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);


app.use('/', register);
app.use('/', validate);
app.use('/', signin);
app.use('/', dashboard);
app.use('/', profile);
app.use('/', myProfile);
app.use('/', editProfile);
app.use('/', myPictures);
app.use('/', chat);
app.use('/', user_profile);
app.use('/', search);
app.use('/', logout);
app.use('/', matches);
app.use('/', who_visited_me);
app.use('/', who_i_liked);
app.use('/', who_liked_me);
app.use('/', lost_password);
app.use('/', new_password);


app.get('/', (req, res) => {
    res.redirect('signin');
});




// app.get('/logout', (req, res) => {
//     req.session.user = undefined;
//     req.session.destroy();
//     console.log("logout");
//     res.redirect('/');
// });



app.get('*', function(req, res){
    res.status('404').send('404 No Permission');
});




let users = {};
let match_data = {};

io.on('connection', function(socket){
    console.log('a user connected with id = '+socket.id);

    socket.on('join', (data) => {
        socket.join(data.user_name);
    });

    let me = false;

    for(let k in users)
    {
        // console.log("users =", users);
        // console.log("userS", users[k]);
        socket.emit('new_user', users[k]);
    }


    socket.on('new_message', (message) => {

        console.log("MESSAGE :", message)
        message.message = message.message.trim();
        if(message.message === '' || message.message.length > 1500)
        {
            return false;
        }

        message.created_at = new Date();

        db.query('INSERT INTO messages SET user_id = ?, message = ?, created_at = ?, chat_with = ?', [
            message.sender_user_id,
            functions.escapeHtml(message.message),
            message.created_at,
            message.receiver_user_id
        ], (err) => {
            if(err){
                throw err;
            }
            message.h = message.created_at.getHours();
            message.m = message.created_at.getMinutes();
            io.sockets.in(message.sender_user_name).emit('new_message', message);
            io.sockets.in(message.receiver_user_name).emit('new_message', message);
        });
    });

    socket.on('send_message', (data) => {
        User.isBlocked(data.receiver_user_id, data.sender_user_id, (count) => {
            if(count == 0)
            {
                User.setNotification("message", data.sender_user_id, data.receiver_user_id, data.sender_user_name, data.receiver_user_name, () => {
                    io.sockets.in(data.receiver_user_name).emit('message_notif', {
                        receiver_user_name : data.receiver_user_name,
                        sender_user_name : data.sender_user_name,
                        receiver_user_id : data.receiver_user_id,
                        sender_user_id : data.sender_user_id
                    });
                });
            }
        });
    });

    socket.on('login', (data) => {
        // me = user;
        // me.id = user.user_id;
        // users[me.id] = me;
        // console.log("me :", me);
        // console.log("users :", users);
        // io.sockets.emit('new_user', me);

        User.getPreviousMsg(data.sender_user_id, data.receiver_user_id, (result) => {
            if (result)
            {
                for (k in result)
                {
                    message = {
                        message : result[k].message,
                        h : result[k].created_at.getHours(),
                        m: result[k].created_at.getMinutes(),
                        sender_user_id : result[k].user_id
                    };
                    io.sockets.in(data.sender_user_name).emit('new_message', message);
                    io.sockets.in(data.receiver_user_name).emit('new_message', message);
                }
            }
        });
    });


    socket.on('like', (data) => {
        match_data = data;

        User.isBlocked(data.liked_user_id, data.like_user_id, (count) => {
            if(count == 0)
            {
                User.setNotification("like", data.like_user_id, data.liked_user_id, data.like_user_name, data.liked_user_name, () => {
                    io.sockets.in(data.liked_user_name).emit('like_notif', {
                        liked_user_name : data.liked_user_name,
                        like_user_name : data.like_user_name,
                        liked_user_id : data.liked_user_id,
                        like_user_id : data.like_user_id
                    });
                });
            }
        });
    });

    if (match_data != {})
    {
        User.isMatch(match_data.like_user_id, match_data.liked_user_id, (count) => {
            if (count == 2)
            {
                User.isNewMatch(match_data.like_user_id, match_data.liked_user_id, (count1) => {
                    if (count1 == 2)
                    {
                        console.log("Old Match");
                        // match_data = {};
                    }
                    else
                    {
                        User.isBlocked(match_data.liked_user_id, match_data.like_user_id, (count) => {
                            console.log("BLOCK : ",count)
                            if(count == 0)
                            {
                                User.setNewMatch(match_data.like_user_id, match_data.liked_user_id, () => {
                                    User.setNotification("match", match_data.like_user_id, match_data.liked_user_id, match_data.like_user_name, match_data.liked_user_name, () => {
                                        io.sockets.in(match_data.liked_user_name).emit('match_notif', {
                                            liked_user_name : match_data.liked_user_name,
                                            like_user_name : match_data.like_user_name
                                        });
                                        io.sockets.in(match_data.like_user_name).emit('match_notif', {
                                            liked_user_name : match_data.like_user_name,
                                            like_user_name : match_data.liked_user_name
                                        });
                                        // match_data = {};
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    socket.on('dislike', (data) => {
        User.isBlocked(data.liked_user_id, data.like_user_id, (count) => {
            if (count == 0)
            {
                User.setNotification("dislike", data.like_user_id, data.liked_user_id, data.dislike_user_name, data.disliked_user_name, () => {
                    io.sockets.in(data.disliked_user_name).emit('dislike_notif', {
                        disliked_user_name : data.disliked_user_name,
                        dislike_user_name : data.dislike_user_name
                    });
                });
            }
        });
    });

    socket.on('visit', (data) => {
        User.isBlocked(data.liked_user_id, data.like_user_id, (count) => {
            if (count == 0)
            {
                if (data.visited !== undefined && data.visited == "false")
                {
                    User.setNotification("visit", data.like_user_id, data.liked_user_id, data.visit_user_name, data.visited_user_name, () => {
                        io.sockets.in(data.visited_user_name).emit('visit_notif', {
                            visited_user_name: data.visited_user_name,
                            visit_user_name: data.visit_user_name
                        });
                    });
                }
            }
        });
    });

    socket.on('online', (data) => {
        io.emit('online', data);
    });


    // console.log("session :",socket.request.session.user);
    socket.on('deco', () => {
        // if(!me){
        //     return false;
        // }

        socket.disconnect(() => {
            delete users[me.id];
            // io.sockets.emit('logout', me);
            console.log("ME :", me);
            socket.emit('logout', me);
        })
        // if (!socket.request.session)
        // {
        //     delete users[me.id];
        //     // io.sockets.emit('logout', me);
        //     io.sockets.emit('logout', me);

        // }

    })

    socket.emit('test')

});






http.listen(port, function(){
    console.log('listening on localhost:3000');
});

// app.listen(port);
// console.log("app running on port", port);
