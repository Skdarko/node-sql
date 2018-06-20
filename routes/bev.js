var express = require('express');
var router = express.Router();
var _ = require('underscore');
var db = require('../db/config');
var Item = require('../models/item');
var Comment = require('../models/comment');

/*
  comes in this shape:
   [{"item_id":2,"name":"Beer","comment_id":1,"saved_by":"Ali","saved_at":"2018-06-20T00:50:56.000Z","comment_text":"Yummy"},
    {"item_id":1,"name":"Milk","comment_id":null,"saved_by":null,"saved_at":null,"comment_text":null}]
  we convert it to this shape:
   [{"item_id":2,"name":"Beer", comments: [
     {"comment_id":1,"saved_by":"Ali","saved_at":"2018-06-20T00:50:56.000Z","comment_text":"Yummy"}]},
     {"item_id":1,"name":"Milk",comments:[]}]
*/
function reshapeResults(data) {
  var grouped = _.groupBy(data, function(x) { return x.item_id; });
  // {1: [{"item_id":1,"name":"Beer", etc.}], 2: [{ etc. }]}
  var shaped = [];
  for(var item_id in grouped) {
  	var grouped_object_array = grouped[item_id];
  	var comment_array = [];
  	// if we have at least 1 comment for this item...
  	// console.log(grouped_object_array);
  	if (grouped_object_array[0].comment_id != null) {
	  comment_array = _.map(grouped_object_array, function(x) { 
	    return {"comment_id": x.comment_id, "saved_by": x.saved_by, "saved_at": x.saved_at, "comment_text": x.comment_text }; 
	  });
	}
    shaped.push({"item_id": item_id, "name": grouped_object_array[0].name, comments: comment_array})
  };
  return shaped;
}

router.get('/', function(req, res, next) {
  var sql = `
SELECT i.id as item_id, i.name, 
	c.id as comment_id, c.saved_by, c.saved_at, c.comment_text
FROM item i LEFT JOIN item_comment c ON c.item_id = i.id
ORDER BY i.name, c.saved_at`;
  db.query(sql, { type: db.QueryTypes.SELECT})
  .then(data => {
  	res.render('bev-index', {"beverages": reshapeResults(data)});
  })
});

router.get('/item-list', function(req, res, next) {
  Item.findAll().then(list => {
    res.send(list);
  });
});

router.post('/save', function(req, res, next) {
  const newItem = Item.build({
    name: req.body.name
  });
  newItem.save().then(() => {
    // console.log(users)
    // res.status(200);
    res.send({success: true})
  });
});

router.post('/save-comment', function(req, res, next) {
  const newComment = Comment.build({
    comment_text: req.body.comment_text,
    saved_by: req.body.saved_by,
    item_id: req.body.item_id
  });
  newComment.save().then(() => {
    // console.log(users)
    // res.status(200);
    res.send({success: true})
  });
});

router.delete('/', function(req, res, next) {
  Item.destroy({
    where: {
      id: req.body.id
    }
  }).then(() => {
    res.send({success: true})
  });
});

router.delete('/comment', function(req, res, next) {
  Comment.destroy({
    where: {
      id: req.body.id
    }
  }).then(() => {
    res.send({success: true})
  });
});

module.exports = router;