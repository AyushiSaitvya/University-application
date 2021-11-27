const mongoose = require('mongoose');
const DB_URL= process.env.NODE_ENV === 'production' 
? process.env.DB_URL
: 'mongodb://127.0.0.1:27017/university_app'
console.log(DB_URL);
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => console.log("MongoDB successfully connected"))
.catch(err => console.log(err));
