// Dependencies
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var sessions = require('client-sessions');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var User = mongoose.model('User', new Schema({
	id: ObjectId,
	username: {type: String, unique: true },
	password: String,
	chips: Number,
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
//app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('index.jade');
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
	});
	user.save(function(err) {
		if (err) {
			var err = 'Something bad happened! Please try again.';
			if (err.code === 11000) {
				error = 'That user is already taken, try again.';
			}
			res.render('register.jade', {error: error });
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
	res.render('game.jade');
});

app.get('/logout', function(req, res) {
	req.session.reset();
	res.redirect('/');
});

// Start server
app.listen(3000);
console.log('Server is running on port 3000.');