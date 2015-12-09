// Dependencies
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var sessions = require('client-sessions');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var deal = require('./game/deal.js');

var User = mongoose.model('User', new Schema({
	id: ObjectId,
	username: {type: String, unique: true },
	password: String,
	chips: Number,
	avatar: String,
}))

var Game = mongoose.model('Game', new Schema({
	id: ObjectId,
	deck: [],
	playerHand: [],
	dealerHand: [],
}))


app.set('view engine', 'jade');
app.locals.pretty = true;

// MongoDB
mongoose.connect('mongodb://localhost/auth');

// Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessions({
	cookieName: 'session',
	secret: 'asdfasdflkjhg',
	duration: 30*60*1000,
	activeDuration: 5*60*1000,
}));
app.use(bodyParser.json());

// Routes
app.use(express.static(__dirname + '/views'));

app.get('/', function(req, res) {
	if (req.session && req.session.user) {
		User.findOne({ username: req.session.user.username }, function(err, user) {
			if (!user) {
				req.session.reset();
				res.render('index.jade');
			} else {
				res.locals.user = user;
				res.redirect('/dashboard');
			}
		});
	} else {
		res.render('index.jade');
	}
});
app.post('/', function(req, res) {
	User.findOne({ username: req.body.username }, function(err, user) {
		if (!user) {
			res.render('login.jade', {error: 'Invalid username or password.'});
		} else {
			if (bcrypt.compareSync(req.body.password, user.password)) {
				req.session.user = user;
				res.redirect('/dashboard');
			} else {
				res.render('login.jade', {error: 'Invalid username or password.'});
			}
		}
	});
});

app.get('/register', function(req, res) {
	res.render('register.jade');
});
app.post('/register', function(req, res) {
	var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
	var user = new User({
		username: req.body.username,
		password: hash,
		chips: 2000,
		avatar: '/images/avatar.png',
	});
	user.save(function(err) {
		if (err){
			var err = 'Something bad happened! Please try again.';
			res.render('register.jade', {error: 'That user is already taken, try again.'});
		} else {
			req.session.user = user;
			res.redirect('/dashboard');
		}
	});
});

app.get('/login', function(req, res) {
	res.render('login.jade');
});
app.post('/login', function(req, res) {
	User.findOne({ username: req.body.username }, function(err, user) {
		if (!user) {
			res.render('login.jade', {error: 'Invalid username or password.'});
		} else {
			if (bcrypt.compareSync(req.body.password, user.password)) {
				req.session.user = user;
				res.redirect('/dashboard');
			} else {
				res.render('login.jade', {error: 'Invalid username or password.'});
			}
		}
	});
});

app.get('/dashboard', function(req, res) {
	if (req.session && req.session.user) {
		User.findOne({ username: req.session.user.username }, function(err, user) {
			if (!user) {
				req.session.reset();
				res.redirect('/login');
			} else {
				res.locals.user = user;
				res.render('dashboard.jade');
			}
		});
	} else {
		res.redirect('/login');
	}
});

app.get('/game', function(req, res) {
	if (req.session && req.session.user) {
		User.findOne({ username: req.session.user.username }, function(err, user) {
			if (!user) {
				req.session.reset();
				res.redirect('/game');
			} else {
				var theDeal = deal.init();
				var thisGame = new Game;
				thisGame.deck = theDeal.deck;
				thisGame.playerHand = theDeal.playerHand;
				thisGame.dealerHand = theDeal.dealerHand;
				thisGame.save(function (err){
					var msg = err || "I worked!";
					console.log(msg);
				});
				res.locals.user = user;
				console.log(theDeal.playerHand[0].imgSrc);
				res.locals.pcone = theDeal.playerHand[0].imgSrc;
				res.locals.pctwo = theDeal.playerHand[1].imgSrc;
				res.locals.dcone = theDeal.dealerHand[0].imgSrc;
				res.locals.dctwo = theDeal.dealerHand[1].imgSrc;
				res.render('game.jade');
			}
		});
	} else {
		res.redirect('/game');
	}
});

app.get('/logout', function(req, res) {
	req.session.reset();
	res.redirect('/');
});

// Start server
app.listen(3000);
console.log('Server is running on port 3000.');
