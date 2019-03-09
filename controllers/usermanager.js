const User = require('../schemas/accounts/User');
const Admin = require('../schemas/accounts/Admin');
const passport = require('passport');
const verifyAdmin = require('../passport/auth').verifyAdmin(passport);
const verifyAuth = require('..//passport/auth').verifyAuth(passport);

const UserManagerController = {
  
  createAdmin : async (req, res) => {
    try {
      let result = await Admin.createModel(req.body);
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send('Unknown Server Response');
    }
  },

  loginadmin: async (req, res, next) => {
    passport.authenticate('admin-login', { session: false }, (err, user, info) => {
      if (user) {
        res.header('token', user.token);
        res.status(200).send(user);
      } else if (info && info.message) {
        res.status(401).send(info.message);
      } else {
        res.status(500).send('Unknown Server Response');
      }
    })(req, res, next);
  },

  createUser: async (req, res) => {
    try {
      let result = await User.createModel(req.body);
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send('Unknown Server Response');
    }
  },

  loginUser: async (req, res, next) => {
    passport.authenticate('local-login', { session: false }, (err, user, info) => {
      if (user) {
        res.header('token', user.token);
        res.status(200).send(user);
      } else if (info && info.message) {
        res.status(401).send(info.message);
      } else {
        res.status(500).send('Unknown Server Response');
      }
    })(req, res, next);
  },

  validateAdmin: async (req, res) => {
    try {
      
      res.status(200).send('bam');
    } catch (err) {
      res.status(500).send('Unknown Server Response');
    }
  },

  validateUser: async (req, res) => {
    try {
      
      res.status(200).send('bam');
    } catch (err) {
      res.status(500).send('Unknown Server Response');
    }
  }
}

module.exports.Controller = UserManagerController;
module.exports.controller = (app) => {
  app.post('/v1/admin', UserManagerController.createAdmin);
  app.post('/v1/admin/login', UserManagerController.loginadmin);
  app.get('/v1/admin/test', verifyAdmin, UserManagerController.validateAdmin);

  app.post('/v1/user', UserManagerController.createUser);
  app.post('/v1/user/login', UserManagerController.loginUser);
  app.get('/v1/user/test', verifyAuth, UserManagerController.validateUser);
}
