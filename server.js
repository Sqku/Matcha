let express = require('express');

let app = express();


app.use('/static', express.static('public'));

app.set('view engine', 'ejs');




app.get('/', (req, res) => {
    res.render('index', {test: 'salut'});
})

app.get('/signin', (req, res) => {
    res.render('signin');
})


app.listen(8081);
