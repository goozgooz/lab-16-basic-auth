'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bluebird').promisifyAll(require('bcrypt'));

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  userId: {type: Number},
  favoriteBook: {type: String},
}); 

userSchema.methods.generateHash = function(password) {
  return bcrypt.hash(password, 10)
    .then(hash => {
      this.password = hash;
      return this;
    });
};

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password,this.password)
    .then(res => {
      if(res) {
        return this;
      }
      throw new Error('incorrect password');
    });
};

userSchema.methods.generateToken = function() {
  return jwt.sign({id: this._id}, process.env.SECRET);
};

// preSave generate hash, generate token 

module.exports = mongoose.model('User', userSchema);


