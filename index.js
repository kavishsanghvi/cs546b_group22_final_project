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
});
process.on('rejectionHandled', (promise) => {
    console.log(reason);
});

//config scheduler to auto release and close the the quizzes and calculation of score if user left the quiz in between
schedule.scheduleJob('30 * * * * *', function(){
    dataObj.retriveQuizData.updateReleaseAndEndTags();
    dataObj.quiz.autoCalculateScore();
});

app.listen(3000, () => {
    console.log("Server is started now!");
    console.log('Your routes will be running on http://localhost:3000');
});
