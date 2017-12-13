var express = require('express');
var router = express.Router();
var expressSession = require('express-session');
var mongoose = require('mongoose');

var Total = mongoose.model('Total');

var amount = 0;
var users = require('../controllers/users_controller');
console.log("before / Route");
router.get('/', function(req, res){
    console.log("/ Route");
//    console.log(req);
    console.log(req.session);
    if (req.session.user) {
      console.log("/ Route if user");
      res.render('index', {username: req.session.username,
                           msg:req.session.msg
                           });
    } else {
      console.log("/ Route else user");
      req.session.msg = 'Access denied!';
      res.redirect('/login');
    }
});
router.get('/user', function(req, res){
    console.log("/user Route");
    if (req.session.user) {
      res.render('user', {msg:req.session.msg});
    } else {
      req.session.msg = 'Access denied!';
      res.redirect('/login');
    }
});
router.get('/signup', function(req, res){
    console.log("/signup Route");
    if(req.session.user){
      res.redirect('/');
    }
    res.render('signup', {msg:req.session.msg});
});
router.get('/login',  function(req, res){
    console.log("/login Route");
    if(req.session.user){
      res.redirect('/');
    }
    res.render('login', {msg:req.session.msg});
});
router.get('/logout', function(req, res){
    console.log("/logout Route");
    req.session.destroy(function(){
      res.redirect('/login');
    });
  });

router.get('/totals', function(req, res, next) {
  Total.find(function(err, totals){
    if(err){ return next(err); }
   if (req.session.user) {
      console.log("/ Route if user");
      res.json(totals);
    } else {
      console.log("/ Route else user");
      req.session.msg = 'Access denied!';
      res.redirect('/login');
    }
  });
});

router.post('/addGoal', function(req, res, next) {
	var total = new Total(req.body);
	total.save(function(err, total){
		if(err) {return next(err); }
		res.json(total);
	});
});

router.param('total', function(req, res, next, id) {
	var query = Total.findById(id);
	query.exec(function (err, total){
		if (err) { return next(err); }
		if (!total) { return next(new Error("can't find total")); }
		req.total = total;
		return next();
	});
});


router.delete('/totals/:total', function(req, res) {
	console.log("in Delete");
	req.total.remove();
	res.sendStatus(200);
});

router.put('/totals/:total/updateBalance',  function(req, res, next) {
	req.total.add = req.body.add;


	req.total.updateBalance(function(err, total){
		if(err) { return next(err); }
		res.json(total);
	})
});


router.post('/signup', users.signup);
router.post('/user/update', users.updateUser);
router.post('/user/delete', users.deleteUser);
router.post('/login', users.login);
router.get('/user/profile', users.getUserProfile);


module.exports = router;
