require('dotenv').config()
const express = require('express');
const path = require('path');
const fileRoute = require('./routes/file');
const discussionRoute = require('./routes/discussion');
const questionRoute=require('./routes/questions')
const bodyParser = require("body-parser");
const passport = require("passport");
const userRoute = require("./routes/user");

require('./db/db');

const CLIENT_ORIGIN = process.env.NODE_ENV === 'production' 
  ? process.env.CLIENT_ORIGIN
  : 'http://localhost:8081'

const app = express();
var cors = require('cors');
app.use(cors({
  origin: CLIENT_ORIGIN
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(fileRoute);
app.use(discussionRoute);
app.use(questionRoute);
app.use(userRoute);
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, "/client/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});
 
require("./config/passport")(passport);

const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
}

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
// });

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log('server started on port 3030');
});
