const express = require('express');
const { schema , Users, validateUser } = require('./../models/userSchema');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/newUser', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const salt = await bcrypt.genSalt(10);

  const isUser = await Users.findOne({ email: { $eq: req.body.email }  });
  if (isUser) return res.status(400).send('user with this email allready exists');

  const dataFromBody = {
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, salt),
  }
  
  const model = new Users(dataFromBody);
  await model.save();
  
  const token = model.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(model, ['name', 'email', '_id']));
});

module.exports = router;