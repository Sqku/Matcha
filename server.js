let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
let db = require('./db_start');
let register = require('./route/register');
let validate = require('./route/validate');
let dashboard = require('./route/dashboard');
let signin = require('./route/signin');


let port = 3000;


let app = express();


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
})





// app.get('/dashboard', auth, (req, res) => {
//     res.render('dashboard');
// });



app.get('*', function(req, res){
    res.status('404').send('404 No Permission');
});

app.listen(port);
console.log("app running on port", port);

