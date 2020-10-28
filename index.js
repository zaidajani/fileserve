const express = require('express');
const mongoose = require('mongoose');
const upload = require('express-fileupload');
const cors = require('cors');
const port = process.env.PORT || 3000;
const path = require('path');
const client = require('./routes/client');
const admin = require('./routes/admin');
const userRoute = require('./routes/user');
const app = express();
const authRoute = require('./routes/auth');

mongoose
  .connect('mongodb://localhost/fileserve', {
    useNewUrlParser: true,
    useUnifiedTopology: true,  
    useCreateIndex: true
  })
  .then(() => {
    console.log('connected to mongoDb');
  }).catch((err) => {
    console.log('Could not connect to mongoDb');
  });

if (!process.env.app_privateKey) {
  throw new Error();
}

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/', client);
app.use('/admin/', admin);
app.use('/user/', userRoute);
app.use('/auth/', authRoute);
app.use(upload());
app.set('view engine', 'ejs');

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});