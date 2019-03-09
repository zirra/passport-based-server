const generateToken = require('./token').generateToken;
const generateAdminToken = require('./token').generateAdminToken;
const User = require('../schemas/accounts/User');
const Admin = require('../schemas/accounts/Admin');


class EmailStrategy {
  constructor() {
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.adminLogin = this.adminLogin.bind(this);
  }

  async login(req, email, password, done) {
    let user;
    try {
      email = email.toLowerCase();
      user = await User.getUser(email);
    
    } catch (err) {
      return done(err, null);
    }

    if (!user) {
      return done(null, false, { message: 'User not found' });

    } else if (user.disabled) {
      return done(null, false, { message: 'User Disabled'});
    }
    else {
      user = await User.verifyUser(email, password);
      if(user){
        try {
          let token = await generateToken(user);
          user.password = null
          let me = {
            _id: user._id,
            email: user.email,
            token
          }
          return done(null, me);
        } catch (err) {
          return done(err, null, 'Incorrect Login');
        }
      } else {
        return done('Incorrect Credentials', null, 'Incorrect Credentials');
      }
    }
  }

  async adminLogin( req, email, password, done) {
    let user;
    try {
      email = email.toLowerCase();   
      user = await Admin.getUser(email);
      
    } catch (err) {
      return done(err, null);
    }

    if (!user) {
      return done(null, false, { message: 'User not found' });

    } else if (user.disabled) {
      return done(null, false, { message: 'User Disabled'});
    }
    else {

      user = await Admin.verifyAdmin(email, password);
     
      if(user){
        try {
          let token = await generateAdminToken(user);
          user.password = null
          let me = {
            _id: user._id,
            email: user.email,
            token
          }
          return done(null, me);
        } catch (err) {
          return done(err, null, 'Incorrect Login');
        }
      } else {
        return done('Incorrect Credentials', null, 'Incorrect Credentials');
      }
    }
  }

  async signup(email, password, done) {    
    let mail = email.toLowerCase();
    let bool = await User.userExists(email);
    if(!bool) {
      let user = await User.createUser({email: mail, password});
      let token = await generateToken(user);
      user.password = null
      let me = {
        _id: user._id,
        email: user.email,
        token
      }
      return done(null, user);
    } else {
      return done ('user exists', null)
    }
  }

}

module.exports = new EmailStrategy();
