const jwt = require("jsonwebtoken");
const moment = require("moment");

module.exports = {
  generateToken: user => {
    const expires = moment()
      .add(process.env.USER_EXPIRES, "days")
      .valueOf();
    let params = {
      sub: user._id,
      exp: expires
    };
    try {
      return jwt.sign(params,process.env.USER_HASH);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  },

  generateAdminToken: user => {
    const expires = moment()
      .add(process.env.ADSMIN_EXPIRES, "minutes")
      .valueOf();
    let params = {
      sub: user._id,
      exp: expires
    };
    try {
      return jwt.sign(params,process.env.ADMIN_HASH);
    } catch (err) {
      logger.error(err);
      throw err;
    }
  },

    
};
