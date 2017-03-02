let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
let db = require('./db_start');
let register = require('./route/register');


let port = 3000;


let app = express();


app.set('view engine', 'ejs');
app.locals.pretty = true;



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/static', express.static('public'));

app.use(session({
    secret: 'matcha',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));



app.use('/', register);


app.get('/', (req, res) => {
    res.render('index', {test: 'salut'});
});

app.get('/signin', (req, res) => {
    res.render('signin');
});



let auth = (req, res, next) => {
    if (req.session && req.session.user === "root")
    {
        return next();
    }
    else
    {
        console.log("veuillez vous connecter");
        return res.redirect('/');
    }
};


app.post('/signin', (req, res) => {
    if(req.body.email !== "root@gmail.com" || req.body.password !== "root")
    {
        console.log("invalide ou champs vide");
        res.redirect('/');
    }
    else if (req.body.email === "root@gmail.com" || req.body.password === "root")
    {
        req.session.user = "root";
        res.redirect('/dashboard');
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy();
    console.log("logout");
    res.redirect('/');
})





app.get('/dashboard', auth, (req, res) => {
    res.render('dashboard');
});





app.listen(port);
console.log("app running on port", port);

