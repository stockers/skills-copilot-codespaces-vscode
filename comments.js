// create web server
var express = require('express');
var router = express.Router();

// var Comment = require('../models/comment');
var User = require('../models/user');
var Post = require('../models/post');

router.get('/new', function(req, res) {
  res.render('comments/new', { post_id: req.query.post_id });
});

router.post('/', function(req, res) {
  // var comment = new Comment(req.body);
  // comment.save(function(err, comment) {
  //   if (err) return res.json(err);
  //   res.redirect('/posts/' + comment.post_id);
  // });
  var post_id = req.body.post_id;
  Post.findById(post_id, function(err, post) {
    if (err) return res.json(err);
    var comment = new Comment(req.body);
    comment.save(function(err, comment) {
      if (err) return res.json(err);
      post.comments.push(comment);
      post.save(function(err, post) {
        if (err) return res.json(err);
        res.redirect('/posts/' + post_id);
      });
    });
  });
});

router.get('/:id/edit', function(req, res) {
  // Comment.findById(req.params.id, function(err, comment) {
  //   if (err) return res.json(err);
  //   res.render('comments/edit', { comment: comment });
  // });
  Post.findOne({ 'comments._id': req.params.id }, function(err, post) {
    if (err) return res.json(err);
    var comment = post.comments.id(req.params.id);
    res.render('comments/edit', { comment: comment });
  });
});

router.put('/:id', function(req, res) {
  // Comment.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, comment) {
  //   if (err) return res.json(err);
  //   res.redirect('/posts/' + comment.post_id);
  // });
  Post.findOne({ 'comments._id': req.params.id }, function(err, post) {
    if (err) return res.json(err);
    var comment = post.comments.id(req.params.id);
    comment.name = req.body.name;
    comment.content = req.body.content;
    post.save(function(err) {
      if (err) return res.json(err);
      res.redirect('/posts/' + post._id);
    });
  });
});

router.delete('/:id', function(req, res) {
  //
