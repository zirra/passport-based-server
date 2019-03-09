const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');
const Schema = mongoose.Schema;
const shortId = require('shortid');

const UserSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  myid: {
    type: String,
    default: shortId.generate,
    index: true,
  }
},
{
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  id: false,
  collection: 'users' 
});


class User {
  
  static async createModel(user) {
    let {email, password} = user;
    email = email.toLowerCase();
    try{
      let encrypt = CryptoJS.AES.encrypt(password, process.env.USER_HASH).toString();
      let user = await this.findOne({email: email})
      .exec();
      if (!Boolean(user)){
        let newuser = await this.create({email : email, password: encrypt });
        return  newuser;
      } else {
        return false;
      }
    } catch (err){
     return err; 
    }
  }

  static async verifyUser(email, password) {
    let user;
    try {
      user = await this.findOne({email: email})
      .exec();
      let bytes  = CryptoJS.AES.decrypt(user.password, process.env.USER_HASH);
      let decrypt = bytes.toString(CryptoJS.enc.Utf8);
      let valid = (password === decrypt);
      if(valid){
        return user;
      } else {
        return null;
      }
    }catch (err){
     return err; 
    }
  }

  static async getById(id) {
    try{
      return await this.findOne({_id: id})
    } catch (err){
      return err; 
    }
  }

  static async getUser(email) {
    console.log(email)
    try{
      return await this.findOne({email: email})
    } catch (err){
     return err; 
    }
  }

  static async userExists(email) {
    try{
      let user = await this.findOne({email: email})
      .exec();
      return (Boolean(user));

    } catch (err){
     return err; 
    }
  }

  static async updateUser(id, data) {
    try {
      let update = await this.findOneAndUpdate(
        {
          _id : id
        },
        data,
        {new: true})
        .exec()
      return update;
    } catch (err) {
      return err;
    }
  }

  static async updateUserPassword(id, data) {
    try {
      let encrypt = CryptoJS.AES.encrypt(data.password, process.env.USER_HASH).toString();
      let update = await this.findOneAndUpdate(
        {
          _id : id
        },
        {password: encrypt},
        {new: true})
        .exec()
      return update;
    } catch (err) {
      return err;
    }
  }

  static async passwordReset(email) {
    try {
      let newWord = shortId.generate() + shortId.generate();
      let encrypt = CryptoJS.AES.encrypt(newWord, process.env.USER_HASH).toString();
      let result = await this.findOneAndUpdate(
        {
          email : email
        },
        {password: encrypt},
        {new: true});
      return newWord;
    } catch (err) {
      return err;
    }
  }

  static async invalidateUser(email) {
    try{

    } catch (err){
     return err; 
    }
  }
}

UserSchema.loadClass(User);

module.exports = mongoose.model('User', UserSchema);