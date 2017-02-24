let express = require('express');

let app = express();

// let connection = require('./db_start');

app.set('view engine', 'ejs');



app.use('/static', express.static('public'));






app.get('/', (req, res) => {
    res.render('index', {test: 'salut'});
})

app.get('/signin', (req, res) => {
    res.render('signin');
})

app.get('/register', (req, res) => {
    res.render('register');
})


app.listen(8081);
