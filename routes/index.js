const usersRoutes = require('./users');
const createCategoryRoutes = require('./create_category');
const path = require('path');


const constructorMethod = (app) => {
  app.use('/users', usersRoutes);
  app.use('/create_category', createCategoryRoutes);
    
  app.get('/', (req, res) => {
    res.sendFile(path.resolve('static/index.html'));
  });
  
    
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;