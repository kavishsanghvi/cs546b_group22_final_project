const express = require('express');
const app = express();
const configRoutes = require('./routes');
const static = express.static(__dirname + '/public');
const path = require('path');


const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
    console.log("Server is started now!");
    console.log('Your routes will be running on http://localhost:3000');
});
