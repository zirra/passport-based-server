const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const AnonymousStrategy = require("passport-anonymous").Strategy;

const ExtractJwt = require("passport-jwt").ExtractJwt;

const EmailStrategy = require("./EmailStrategy");
const TokenStrategy = require("./TokenStrategy");

const jwt = require("jsonwebtoken");

module.exports = passport => {
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      EmailStrategy.login
    )
  );

  passport.use(
    "admin-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      EmailStrategy.adminLogin
    )
  );

  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("token"),
    //secretOrKey:process.env.JWT_SECRET
    secretOrKeyProvider: (req, token, done) => {
      let error = null;
      let secret = null;
      jwt.verify(token, process.env.USER_HASH, function (err) {
        if (err) {
          jwt.verify(token, process.env.USER_HASH, function (err) {
            if (err) {
              error = err;
            } else {
              secret = process.env.USER_HASH
            }
          });
        } else {
          secret = process.env.USER_HASH;
        }
      });
      done(error, secret);
    }
  };

  const jwtOptionsAdmin = {
    jwtFromRequest: ExtractJwt.fromHeader("token"),
    //secretOrKey:process.env.JWT_SECRET
    secretOrKeyProvider: (req, token, done) => {
      let error = null;
      let secret = null;
      jwt.verify(token, process.env.ADMIN_HASH, function (err) {
        if (err) {
          jwt.verify(token, process.env.ADMIN_HASH, function (err) {
            if (err) {
              error = err;
            } else {
              secret = process.env.ADMIN_HASH;
            }
          });
        } else {
          secret = process.env.ADMIN_HASH;
        }
      });
      done(error, secret);
    }
  };

  passport.use("jwt", new JwtStrategy(jwtOptions, TokenStrategy.verifyAuth));
  passport.use("jwt-admin", new JwtStrategy(jwtOptionsAdmin, TokenStrategy.verifyAdmin));
};

module.exports.verifyAuth = passport => passport.authenticate("jwt", { session: false });
module.exports.verifyAdmin = passport => passport.authenticate("jwt-admin", { session: false });
