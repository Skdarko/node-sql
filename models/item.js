const Sequelize = require('sequelize');
var db = require('../db/config');

const Item = db.define('item', {
  // firstName: {
  //   type: Sequelize.STRING
  // },
  name: { type: Sequelize.STRING, allowNull: false }
}, { 
  timestamps: false,
  freezeTableName: true
  // tableName: 'my_very_custom_table_name'
});
module.exports = Item;