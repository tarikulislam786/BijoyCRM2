const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const user = require("./models/user");

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

// authorization
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: "BijoyTech",
    },
    (payload, done) => {
      user.findById({ _id: payload.sub }, (err, User) => {
        if (err) return done(err, false);
        if (User) return done(null, User);
        else return done(null, false);
      });
    }
  )
);

// authenticated local strategy using username and password
passport.use(
  new LocalStrategy((username, password, done) => {
    user.findOne({ username }, (err, User) => {
      // something went wrong with database
      if (err) return done(err);
      // if no user exists
      if (!User) return done(null, false);
      // check if password is correct
      User.comparePassword(password, done);
    });
  })
);
