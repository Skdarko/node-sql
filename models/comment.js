const Sequelize = require('sequelize');
var db = require('../db/config');
var Item = require('./item');

const Comment = db.define('comment', {
  comment_text: { type: Sequelize.STRING, allowNull: false },
  saved_by: { type: Sequelize.STRING, allowNull: false },
  item_id: {
      type: Sequelize.INTEGER,
      references: { model: Item, key: 'id' }
    }
  }, { 
  timestamps: true,
  createdAt: 'saved_at',
  updatedAt: false,
  deletedAt: false,
  freezeTableName: true,
  tableName: 'item_comment'
});
module.exports = Comment;