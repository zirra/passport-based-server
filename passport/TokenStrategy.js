const User = require('../schemas/accounts/User');
const Admin = require('../schemas/accounts/Admin');

class TokenStrategy {
  constructor() {
    this.verifyBasic= this.verifyBasic.bind(this);
    this.verifyAuth = this.verifyAuth.bind(this);
    this.verifyAdmin = this.verifyAdmin.bind(this);
  }

  async verifyBasic(jwtPayload, done) {
    if (jwtPayload.exp < Date.now()) {
      return done(null, false, { message: 'EXPIRED TOKEN'});
    }
    let user;

    
    try {
      
      user = await User.getById(jwtPayload.sub);
      if (Boolean(user)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'NOT FOUND' });
      }
    } catch (err) {
      return done(err, false);
    }
  }

  async verifyAuth(jwtPayload, done) {
    if (jwtPayload.exp < Date.now()) {
      return done(null, false, { message: 'EXPIRED TOKEN' });
    }
    let user;
    
    try {
      
      user = await User.getById(jwtPayload.sub);
      
      if (Boolean(user)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'NOT FOUND' });
      }
    } catch (err) {
      return done(err, false);
    }
  }

  async verifyAdmin(jwtPayload, done) {
    if (jwtPayload.exp < Date.now()) {
      return done(null, false, { message: 'EXPIRED TOKEN'});
    }
    let user;
    
    try {
      user = await Admin.getById(jwtPayload.sub);
      if (Boolean(user)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'NOT FOUND' });
      }
    } catch (err) {
      return done(err, false);
    }
  }

}

module.exports = new TokenStrategy();
