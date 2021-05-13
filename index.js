const express = require('express');
const app = express();
const configRoutes = require('./routes');
const static = express.static(__dirname + '/public');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const process = require('process');
const schedule = require('node-schedule');
const dataObj = require('./data')

app.use(session({
    name: 'AuthCookie',
    secret: '%rt8322f8AAAi5n-sdkjhfrtyyyyyyy',
    resave: false,
    saveUninitialized: true
}));

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

configRoutes(app);

const unhandledRejections = new Map();
process.on('unhandledRejection', async (reason, promise) => {
    console.log(reason);
    //console.log(promise);
    //unhandledRejections.set(promise, reason);
   // fs.appendFile('mynewfile1.txt', 'Hello content!');
});
process.on('rejectionHandled', (promise) => {
     //unhandledRejections.delete(promise);
    console.log(reason);
    //console.log(promise);
});

schedule.scheduleJob('30 * * * * *', function(){
    dataObj.retriveQuizData.updateReleaseAndEndTags();
    // console.log('The answer to life, the universe, and everything!');
});

app.listen(3000, () => {
    console.log("Server is started now!");
    console.log('Your routes will be running on http://localhost:3000');
});
