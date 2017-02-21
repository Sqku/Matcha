let express = require('express');

let app = express();


app.get('/', (request, response) => {
    response.send('salut');
})

app.listen(8081);
