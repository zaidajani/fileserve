const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const dotenv = require('dotenv').config();

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
});

schema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, process.env.app_privateKey);
  return token;
} 

function validateUser(user) {
  const schema = {
    name: Joi.string().min(4).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(200).required()
  }

  return Joi.validate(user, schema);
}

const Users = mongoose.model('users', schema);

exports.Users = Users;
exports.validateUser = validateUser;
exports.schema = schema;