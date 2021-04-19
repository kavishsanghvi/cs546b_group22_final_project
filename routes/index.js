const loginRoutes = require('./login');
const jwt = require('jsonwebtoken');
const usersRoutes = require('./users');
const createCategoryRoutes = require('./create_category');
const path = require('path');


const constructorMethod = (app) => {
  app.use('/users', usersRoutes);
  app.use('/login', loginRoutes);
  app.use('/create_category', createCategoryRoutes);
    
  app.get('/', (req, res) => {
    res.sendFile(path.resolve('static/index.html'));
  });
  
    
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};


const  authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, "3e2c5bea78f9020f7c5e2bb24ac10d8b390c2ddb9fab2560ee12c24ede61d1a7", (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

module.exports = constructorMethod;