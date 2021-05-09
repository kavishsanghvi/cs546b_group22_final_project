const loginRoutes = require('./login');
const jwt = require('jsonwebtoken');
const usersRoutes = require('./users');
const createCategoryRoutes = require('./createCategory');
const path = require('path');
const quizDataRoutes = require('./quizData');
const createQuizRoutes = require('./createQuiz');
const dashboardRoutes = require('./dashboard')
const acceptedRoutes = require('./accepted')
const professorRoutes = require('./professor')

const constructorMethod = (app) => {
  app.use('/users', verifyUserLogIn, usersRoutes);
  app.use('/login', loginRoutes);
  app.use('/dashboard', dashboardRoutes);
  app.use('/accepted', acceptedRoutes)
  // app.use('/createCategory', verifyUserLogIn, createCategoryRoutes);
  app.use('/quiz', verifyUserLogIn, quizDataRoutes);
  // app.use('/createQuiz', verifyUserLogIn, createQuizRoutes);
  app.use('/professor', verifyUserLogIn, professorRoutes);

  app.get('/', (req, res) => {
    // res.sendFile(path.resolve('static/index.html'));
    res.render('posts/index')
  });


  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, "3e2c5bea78f9020f7c5e2bb24ac10d8b390c2ddb9fab2560ee12c24ede61d1a7", (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}


const verifyUserLogIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('../')
  }
}

module.exports = constructorMethod;