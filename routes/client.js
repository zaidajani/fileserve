const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { schema, FileDb, validate } = require('./../models/fileSchema');
const upload = require('express-fileupload');

router.use(upload());

router.get('/', async (req, res) => {
  const data = await FileDb.find();
  res.render("index.ejs", { data: data });
});

module.exports = router;