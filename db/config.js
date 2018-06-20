const Sequelize = require('sequelize');
const db = new Sequelize('bev', 'bevuser', 'bevuserpwd', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  operatorsAliases: false,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
});
db.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });
module.exports = db;