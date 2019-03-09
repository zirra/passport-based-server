const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortId = require('shortid');

const ProfileSchema = Schema({
  myid: {
    type: String,
    default: shortId.generate,
    index: true,
  },
  firstName: {
    type: String
  }, 
  lastName: { 
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zip: {
    type: String
  },
  addressOne: {
    type: String
  }, 
  addressTwo: {
    type: String
  },
  userName: {
    type: String
  }
},
{
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  id: false,
  collection: 'profiles' 
});


class Profile {
  
  static async createModel(profile) {
    try{
      await this.create(profile)
    } catch (err){
     return err; 
    }
  }

  static async getModelById(id) {
    try {
      return await this.findOne({_id: id})
    } catch (err) {
      return err;
    }
  }

  static async updateModel(data) {
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
}

ProfileSchema.loadClass(Profile);

module.exports = mongoose.model('Profile', ProfileSchema);