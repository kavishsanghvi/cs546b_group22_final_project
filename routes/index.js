const loginRoutes = require('./login');
const signUpRoutes = require('./sign-up');

const dashboardRoutes = require('./dashboard')
const acceptedRoutes = require('./accepted')
const professorRoutes = require('./professor')
const studentRoutes = require('./student')


const constructorMethod = (app) => {
  app.use('/login', verifyUserLogIn, loginRoutes);
  app.use('/dashboard', verifyUserLogIn, dashboardRoutes);
  app.use('/accepted', verifyUserLogIn, acceptedRoutes)
  app.use('/student', verifyUserLogIn, studentRoutes);
  app.use('/professor', verifyUserLogIn, professorRoutes);
  app.use('/sign-up', verifyUserLogIn, signUpRoutes);

  app.get('/', verifyUserLogIn, (req, res) => {
    res.render('posts/index', {
      userData: JSON.stringify(req.session.user)
    })
  });

  app.use('*', (req, res) => {
    res.status(404).render('posts/404')
  });
};


const verifyUserLogIn = (req, res, next) => {

  try {
    if (typeof (req.session.user) !== "undefined") {

      if (req.session && req.session.user) {
        if (((req.baseUrl).replace(/\//gi, "") == "accepted")) {
          next();
          return
        }

        if ((req.baseUrl).replace(/\//gi, "") == "dashboard") {
          next();
          return;
        }

        if (req.session.user.isActive == false && req.session.user.userType == "student" && (req.originalUrl).replace(/\//gi, "") == 'studentenroll-now') {
          next()
          return;
        } else if (req.session.user.isActive == false && req.session.user.userType == "student") {
          if ((req.originalUrl).replace(/\//gi, "") != 'studentenroll-now') {
            res.redirect(req.protocol + '://' + req.get('host') + "/student/enroll-now");
            return;
          } else {
            //return;
          }
        }

        if ((req.baseUrl).replace(/\//gi, "") == "" || (req.baseUrl).replace(/\//gi, "") == "login" || (req.baseUrl).replace(/\//gi, "") == "sign-up") {
          if (req.session.user.userType == "professor") {
            res.redirect('./professor/category');
            return;
          }

          if (req.session.user.userType == "student") {
            res.redirect('./student/');
            return
          }
        }


        if (typeof (req.session) !== "undefined" && req.session.user.userType && (req.baseUrl).replace(/\//gi, "") == req.session.user.userType) next();
        else res.redirect('../');
      } else {
        if (((req.baseUrl).replace(/\//gi, "") == "login" || (req.baseUrl).replace(/\//gi, "") == "sign-up" || (req.baseUrl).replace(/\//gi, "") == "")) {
          next();
          return;
        } else {
          res.redirect('../')
        }
      }
    } else {
      if (((req.baseUrl).replace(/\//gi, "") == "login" || (req.baseUrl).replace(/\//gi, "") == "sign-up") || (req.baseUrl).replace(/\//gi, "") == "") {
        next();
        return;
      } else {
        res.redirect('../');
      }
    }
  } catch (e) {
    res.redirect('../')
  }

}

module.exports = constructorMethod;