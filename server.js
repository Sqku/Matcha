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
// let user_profile = require('./route/user_profile');
let search = require('./route/search');
let chat = require('./route/chat');
let logout = require('./route/logout');
let functions = require('./middleware/functions');
let User = require('./model/user');



let port = 3000;


let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);


let user_profile = require('./route/user_profile')(io);

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

io.on('connection', function(socket){
    console.log('a user connected with id = '+socket.id);



    let me = false;

    for(let k in users)
    {
        // console.log("users =", users);
        // console.log("userS", users[k]);
        socket.emit('new_user', users[k]);
    }


    socket.on('new_message', (message) => {

        message.message = message.message.trim();
        if(message.message === '')
        {
            return false;
        }

        message.user = me;

        message.created_at = new Date();

        db.query('INSERT INTO messages SET user_id = ?, message = ?, created_at = ?', [
            message.user.id,
            functions.escapeHtml(message.message),
            message.created_at
        ], (err) => {
            if(err){
                socket.emit('error', err);
            }

            message.h = message.created_at.getHours();
            message.m = message.created_at.getMinutes();
            io.sockets.emit('new_message', message);
        });

        // message.user = me;
        // date = new Date();
        // message.h = date.getHours();
        // message.m = date.getMinutes();
        // messages.push(message);
        // if(messages.length > history)
        // {
        //     messages.shift();
        // }
        // io.sockets.emit('new_message', message);

    });

    socket.on('login', (user) => {
        me = user;
        me.id = user.user_id;
        users[me.id] = me;
        console.log("me :", me);
        console.log("users :", users);
        io.sockets.emit('new_user', me);

        let getPreviousMsg = () => {
            db.query('SELECT messages.user_id, messages.message, messages.created_at FROM messages LEFT JOIN user ON user.id = messages.user_id LIMIT 30', (err, result) => {
                if(err){
                    socket.emit('error', err.code);
                    return true;
                }
                for (k in result){
                    let row = result[k];
                    message = {
                        message: row.message,
                        h: row.created_at.getHours(),
                        m: row.created_at.getMinutes(),
                        // created_at: row.created_at,
                        user: {
                            id: row.user_id,
                        }
                    };
                    socket.emit('new_message', message);
                }
            })
        };

        getPreviousMsg();
    });

    socket.on('join', (data) => {
        socket.join(data.user_name);
        // io.sockets.in(data.user_id).emit('new_msg', {msg: 'hello'});

        // socket.on('like', (data) => {
        //     io.sockets.in(data.liked_id).emit('like_notif', {liked_id : data.liked_id});
        // })
    });

    socket.on('like', (data) => {
        console.log(data)
        User.isMatch(data.like_user_id, data.liked_user_id, (count) => {
            console.log("TEST MATCH :", count)
            if (count == 2)
            {
                console.log("TEST MATCH :", count)
                io.sockets.in(data.liked_user_name).emit('match_notif', {
                    liked_user_name : data.liked_user_name,
                    like_user_name : data.like_user_name
                });
                io.sockets.in(data.like_user_name).emit('match_notif', {
                    liked_user_name : data.liked_user_name,
                    like_user_name : data.like_user_name
                });
            }
        });
        io.sockets.in(data.liked_user_name).emit('like_notif', {
            liked_user_name : data.liked_user_name,
            like_user_name : data.like_user_name
        });
        // User.isMatch(data.like_user_id, data.liked_user_id, (count) => {
        //     if (count == 2)
        //     {
        //         console.log("TEST MATCH :", count)
        //         io.sockets.in(data.liked_user_name).emit('match_notif', {
        //             liked_user_name : data.liked_user_name,
        //             like_user_name : data.like_user_name
        //         });
        //         io.sockets.in(data.like_user_name).emit('match_notif', {
        //             liked_user_name : data.liked_user_name,
        //             like_user_name : data.like_user_name
        //         });
        //     }
        // });
    });

    // User.isMatch(2, 1, (count) => {
    //     if (count == 2)
    //     {
    //         console.log("TEST MATCH :", count)
    //         io.sockets.in("aaaa").emit('match_notif', {
    //             liked_user_name : "aaaa",
    //             like_user_name : "bbbb"
    //         });
    //         io.sockets.in("bbbb").emit('match_notif', {
    //             liked_user_name : "aaaa",
    //             like_user_name : "bbbb"
    //         });
    //     }
    // });

    socket.on('dislike', (data) => {
        io.sockets.in(data.disliked_user_name).emit('dislike_notif', {
            disliked_user_name : data.disliked_user_name,
            dislike_user_name : data.dislike_user_name
        });
    });

    socket.on('visit', (data) => {
        console.log("VISITED :",data.visited);
        if (data.visited !== undefined && data.visited == "false")
            io.sockets.in(data.visited_user_name).emit('visit_notif', {
                visited_user_name : data.visited_user_name,
                visit_user_name : data.visit_user_name
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
