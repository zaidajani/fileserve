const express = require("express");
const router = express.Router();
const { FileDb, validate } = require('./../models/fileSchema');
const auth = require('./../middleware/auth');
const { Users } = require("../models/userSchema");

router.post('/uploadFile', auth, async (req, res) => {
  const user = await Users.findOne({ _id: { $eq: req.user._id } });
  if(user.isAdmin === false) {
    return res.status(403).send('Access forbidden. You dont have privilages to aply changes to our files.');
  }

  if (req.files.filesToUpload) {
    const file = req.files.filesToUpload;
    file.mv('./static/docs/' + file.name)
      .catch(err =>  { 
        console.log('err', err);
      });
    res.send(file);
  }
});

router.post('/uploadDataForFile', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const data = new FileDb({
    "title": req.body.title,
    "content": req.body.content,
    "fileName": req.body.fileName,
    "url": `/static/docs/${req.body.fileName}`
  });
  await data.save();

  res.send(data);
});

router.put('/updateDataForFile', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const fileId = await FileDb.findOne({ title: { $eq: req.body.title } });
  if (!fileId) return res.status(404).send('could not find');

  const data = await FileDb.findByIdAndUpdate(fileId._id, {
    "title": req.body.title,
    "content": req.body.content,
    "fileName": req.body.fileName,
    "url": `/static/docs/${req.body.fileName}`
  }, {
    new: true
  });

  res.send(data);
});

module.exports = router;