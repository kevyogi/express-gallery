/*jshint esversion:6*/
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const exphbs = require('express-handlebars');
const PORT = 8888;
const galleryRoute = require('./routes/gallery.js');
const db = require('./models');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const saltRounds = 12;
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.use('/gallery', galleryRoute);

passport.serializeUser((user, done) => {
  console.log('serializing');
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser((user, done) => {
  console.log('deserializing');
  db.user.findOne({where: { id: user.id }})
  .then((user) => {
    return done(null, {
      id: user.id,
      username: user.username
    });
  });
});

passport.use(new LocalStrategy(function (username, password, done) {
  db.user.findOne({where: {username: username}})
    .then((user) => {
      if(user === null){
        return done(null, false, {message: 'bad username or password'});
      }else{
        bcrypt.compare(password, user.password)
        .then((res) => {
          console.log(res);
          if(res){
            return done(null, user); //typically don't send the whole user back because it contains password and stuff
          }else{
            return done(null, false, {message: 'bad username or password'});
          }
        });
      }
    })
    .catch((error) => {
      console.log('ERROR:', error);
    });
}));

app.get('/', (req, res) => {
  console.log('login');
  res.render('partials/login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/gallery',
  failureRedirect: '/'
}));

app.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

app.post('/register', (req, res) => {
  bcrypt.genSalt(saltRounds, function(err, salt){
    bcrypt.hash(req.body.password, salt, function(err, hash){
      db.user.create({
        username: req.body.username,
        password: hash
      })
      .then((user) => {
        console.log(user);
        res.redirect('/');
      })
      .catch((error) => {
        return res.send('Stupid username');
      });
    });
  });
});

function isAuthenticated(req, res, next){
  if(req.isAuthenticated()) {next();}
  else{res.redirect('/');
  }
}

app.listen(PORT, () => {
  db.sequelize.sync({ force: false });
  console.log(`Listening on port: ${PORT}`);
});