const loginRoutes = require('./login');
const jwt = require('jsonwebtoken');
// const usersRoutes = require('./users');
// const createCategoryRoutes = require('./createCategory');
const path = require('path');
// const quizDataRoutes = require('./quizData');
// const createQuizRoutes = require('./createQuiz');
const signUpRoutes = require('./sign-up');

const dashboardRoutes = require('./dashboard')
const acceptedRoutes = require('./accepted')
const professorRoutes = require('./professor')
const studentRoutes = require('./student')


const constructorMethod = (app) => {
  // app.use('/users', verifyUserLogIn, usersRoutes);
  app.use('/login',verifyUserLogIn, loginRoutes);
  app.use('/dashboard', verifyUserLogIn, dashboardRoutes);
  app.use('/accepted', verifyUserLogIn, acceptedRoutes)
  // app.use('/createCategory', verifyUserLogIn, createCategoryRoutes);
  app.use('/student', verifyUserLogIn, studentRoutes);
  // app.use('/createCategory', verifyUserLogIn, createCategoryRoutes);
  // app.use('/quiz', verifyUserLogIn, quizDataRoutes);
  // app.use('/createQuiz', verifyUserLogIn, createQuizRoutes);
  app.use('/professor', verifyUserLogIn, professorRoutes);
  app.use('/sign-up',verifyUserLogIn, signUpRoutes);

  app.get('/', (req, res) => {
    // res.sendFile(path.resolve('static/index.html'));
    res.render('posts/index', { userData: JSON.stringify(req.session.user) })
  });

  app.use('*', (req, res) => {
    //res.status(404).json({ error: 'Not found' });
    res.status(404).render('posts/404')
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

  try{
    if (typeof(req.session.user) !=="undefined") {
     
      if(req.session && req.session.user){
        if(((req.baseUrl).replace(/\//gi, "") == "accepted")){
          next();
          return
        }


        if((req.baseUrl).replace(/\//gi, "") == "login" || (req.baseUrl).replace(/\//gi, "") == "sign-up"){
          if(req.session.user.userType == "professor") res.redirect('./professor/category');
          console.log(req.session.user.userType);
          if(req.session.user.userType == "student") res.redirect('./student');
        }

        // if(req.session.user.isActive == false && req.session.user.userType == "student"){
        //    res.redirect("./student/enrollNow");
        // }


        if((req.baseUrl).replace(/\//gi, "") == "dashboard"){ next(); if((req.originalUrl).replace(/\//gi, "") != "dashboardlogout"){ return } } 
        if(typeof(req.session) !=="undefined" && req.session.user.userType &&  (req.baseUrl).replace(/\//gi, "") == req.session.user.userType) next();
        else res.redirect('../'); 
      }else{
        if(((req.baseUrl).replace(/\//gi, "") == "login" || (req.baseUrl).replace(/\//gi, "") == "sign-up")){
          next();
        }else{
          res.redirect('../')
        }
      }
    }else{
      if(((req.baseUrl).replace(/\//gi, "") == "login" || (req.baseUrl).replace(/\//gi, "") == "sign-up")){
        next();
      }else{
        res.redirect('../');
      }
    }
  }catch(e){
    console.log(e);
    res.redirect('../')
  }
 
}

module.exports = constructorMethod;