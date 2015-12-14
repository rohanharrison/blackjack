// Dependencies
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var sessions = require('client-sessions');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var multer  = require('multer');

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
	username: {type: String, unique: true },
	deck: [],
	playerHand: [],
	dealerHand: [],
	status: String,
}))


app.set('view engine', 'jade');
app.locals.pretty = true;

// MongoDB
mongoose.connect('mongodb://localhost/auth');

// Express
app.use(function(req, res, next){
  if (req.is('text/*')) {
    req.text = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){ req.text += chunk });
    req.on('end', next);
  } else {
    next();
  }
});

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

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './views/images/avatars')
  },
  filename: function (req, file, cb) {
    cb(null, req.session.user.username + '.png')
  }
});
var upload = multer({ storage: storage });
app.post('/upload', upload.single('avatar'),  function(req, res) {
		User.findOne({ username: req.session.user.username }, function(err, user) {
		if (!user) {
			res.redirect('/dashboard');
		} else {
				req.session.user = user;
				user.avatar = '/images/avatars/' + req.session.user.username + '.png' || '/images/avatar.png';
				user.save(function (err){
						var msg = err || "";
						console.log(msg);
						});
		}
	});
  res.redirect('/dashboard');
});


app.get('/game', function(req, res) {
	if (req.session && req.session.user) {
		User.findOne({ username: req.session.user.username }, function(err, user) {
			if (!user) {
				req.session.reset();
				res.redirect('/game');
			}
			else {
				Game.findOne({ username: req.session.user.username }, function(err, game) {
					if (!!game) {
						console.log(game.status);
						res.locals.user = user;
						res.locals.game = game;
						res.render('game.jade');
				  }
					else {
						var theDeal = deal.init();
						var thisGame = new Game;
						thisGame.deck = theDeal.deck;
						thisGame.username = req.session.user.username;
						thisGame.playerHand = theDeal.playerHand;
						thisGame.dealerHand = theDeal.dealerHand;
						thisGame.status = 'play';
						thisGame.save(function (err){
							var msg = err || "";
							console.log(msg);
						});
						res.locals.user = user;
						res.locals.game = theDeal;
						res.render('game.jade');
					}});
			}
		});
	} else {
		res.redirect('/login');
	}
});

app.post('/game', function(req, res) {
	if (req.session && req.session.user) {
		User.findOne({ username: req.session.user.username }, function(err, user) {
			if (!user) {
				req.session.reset();
				res.redirect('/game');
			}
			else {
				//would be nice to have everything pretti from here pls.
				Game.findOne({ username: req.session.user.username }, function(err, game) {
					if (!!game) {
						if (req.text.localeCompare('hit') === 0)
						{
							deal.playerHit(game);
							game.save();
							res.json(game)
							res.end();
						} else if (req.text.localeCompare('naw') === 0) {
							deal.dealerHit(game);
							res.json(game);
							res.end();
						}
					} else {
						console.log('Something went terribly wrong on the hit!! line 195');
					}
				});
			}});


	}	else {
		res.redirect('/login');
	}
});

app.get('/logout', function(req, res) {
	req.session.reset();
	res.redirect('/');
});


// Start server
app.listen(3000);
console.log('Server is running on port 3000.');
