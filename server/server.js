const express = require('express')
const app = express()
const port = 3000
const devServerRoot = `http://localhost:${8080}`;
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const db_controller = require('./db_controller');
const cookieSession = require('cookie-session');



// cookieSession config
app.use(cookieSession({
  name: 'testSession',
  maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
  keys: ['randomstringhere']
}));


app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${port}/auth/google/callback`
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log(profile);
    // db_controller.findOrCreate(profile.id);
    return done(null, profile); // passes the profile data to serializeUser
  }
));


passport.serializeUser((user, done) => {
  db_controller.findOrCreate(user, (err) => done(err, user.id));
});

passport.deserializeUser((id, done) => {
  console.log(`deserialize got called and id:${id}`);
  done(null, id);
});

isUserAuthenticated = (req, res, next) => {
  if (req.user) {
    console.log('req.user');
    console.log(req.user);
    return db_controller.getUser(req, res, next);
    // next();
  } else {
    res.locals.userObj = 
      {
        googleid: undefined,
        displayname: 'Anonymous',
        highscore: 0
      };
    next();
  }
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(devServerRoot);
    // res.redirect('/');
  }
);

// Secret route
app.get('/secret', isUserAuthenticated, (req, res) => {
  res.send('You have reached the secret route');
});

// Logout route
app.get('/auth/logout', (req, res) => {
  req.logout(); 
  res.redirect(devServerRoot);
});

app.get('/api/getSignedin', isUserAuthenticated, (req, res) => {
  res.json(res.locals.userObj);
});

app.post('/api/setUserHighScore', db_controller.setHighScore, (req, res) => {
  res.redirect(devServerRoot);
})

app.listen(port, () => {
  // console.log(process.env.PG_URI);
  console.log(`Example app listening at http://localhost:${port}`)
})









/**
 * object returned from google
{
  id: '112944363809533816319',
  displayName: 'Grigor Minasyan',
  name: { familyName: 'Minasyan', givenName: 'Grigor' },
  photos: [
    {
      value: 'https://lh3.googleusercontent.com/a-/AOh14GhRhJUtie9rZSRHg7ObJRFdNWbCqUASLHk6n5vTrg=s96-c'
    }
  ],
  provider: 'google',
  _raw: '{\n' +
    '  "sub": "112944363809533816319",\n' +
    '  "name": "Grigor Minasyan",\n' +
    '  "given_name": "Grigor",\n' +
    '  "family_name": "Minasyan",\n' +
    '  "picture": "https://lh3.googleusercontent.com/a-/AOh14GhRhJUtie9rZSRHg7ObJRFdNWbCqUASLHk6n5vTrg\\u003ds96-c",\n' +
    '  "locale": "en"\n' +
    '}',
  _json: {
    sub: '112944363809533816319',
    name: 'Grigor Minasyan',
    given_name: 'Grigor',
    family_name: 'Minasyan',
    picture: 'https://lh3.googleusercontent.com/a-/AOh14GhRhJUtie9rZSRHg7ObJRFdNWbCqUASLHk6n5vTrg=s96-c',
    locale: 'en'
  }
}
 */

/**
 * http://localhost:3000/auth/google/callback?code=4%2F0AY0e-g5PYqVMUxeIrQgY2SbfiN3rwUoAjX6IwVgoR-WEGtqhmmvOwo1Wu3IlH_lvt1Qu8A&scope=profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&authuser=0&prompt=consent#
 */