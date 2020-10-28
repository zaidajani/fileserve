const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

const FileDb = mongoose.model('files', schema);

function validate(fileContent) {
  const schema = {
    title: Joi.string().min(3).max(90).required(),
    content: Joi.string().min(10).max(300).required(),
    fileName: Joi.string().required(),
  }

  return Joi.validate(fileContent, schema);
}

exports.schema = schema;
exports.validate = validate;
exports.FileDb = FileDb;