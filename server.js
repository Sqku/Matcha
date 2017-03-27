let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
let db = require('./db_start');
let register = require('./route/register');
let validate = require('./route/validate');
let dashboard = require('./route/dashboard');
let signin = require('./route/signin');
let profile = require('./route/profile');
let chat = require('./route/chat');




let port = 3000;


let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);


app.set('view engine', 'ejs');
app.locals.pretty = true;



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/static', express.static('public', { redirect : false}));

app.use(session({
    secret: 'matcha',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));



app.use('/', register);
app.use('/', validate);
app.use('/', signin);
app.use('/', dashboard);
app.use('/', profile);
app.use('/', chat);

app.get('/', (req, res) => {
    res.redirect('signin');
});





// let auth = (req, res, next) => {
//     if (req.session && req.session.user === "root")
//     {
//         return next();
//     }
//     else
//     {
//         console.log("veuillez vous connecter");
//         return res.redirect('/');
//     }
// };


// app.post('/signin', (req, res) => {
//     if(req.body.email !== "root@gmail.com" || req.body.password !== "root")
//     {
//         console.log("invalide ou champs vide");
//         res.redirect('/');
//     }
//     else if (req.body.email === "root@gmail.com" && req.body.password === "root")
//     {
//         req.session.user = "root";
//         res.redirect('/dashboard');
//     }
// });


app.get('/logout', (req, res) => {
    req.session.destroy();
    console.log("logout");
    res.redirect('/');
});





// app.get('/dashboard', auth, (req, res) => {
//     res.render('dashboard');
// });



app.get('*', function(req, res){
    res.status('404').send('404 No Permission');
});


let users = {};
let messages = [];
let history = 2;

io.on('connection', function(socket){
    console.log('a user connected with id = '+socket.id);

    let me = false;

    for(let k in users)
    {
        // console.log("users =", users);
        // console.log("userS", users[k]);
        socket.emit('new_user', users[k]);
    }
    for(let k in messages)
    {
        // console.log("users =", users);
        // console.log("userS", users[k]);
        socket.emit('new_message', messages[k]);
    }

    socket.on('new_message', (message) => {
        message.user = me;
        date = new Date();
        message.h = date.getHours();
        message.m = date.getMinutes();
        messages.push(message);
        if(messages.length > history)
        {
            messages.shift();
        }
        io.sockets.emit('new_message', message);

    });

    socket.on('login', (user) => {
        me = user;
        me.id = user.user_id;
        users[me.id] = me;
        console.log(me);
        io.sockets.emit('new_user', me);
    });

    socket.on('disconnect', () => {
        if(!me){
            return false;
        }
        delete users[me.id];
        io.sockets.emit('logout', me);
    })
});



http.listen(port, function(){
    console.log('listening on localhost:3000');
});

// app.listen(port);
// console.log("app running on port", port);

