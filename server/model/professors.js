const mongoose = require('mongoose');


const questionSchema = mongoose.Schema({
 
    name:{
      type: String,
      required: true
    },  
    email: {
      type: String,
      required: true
     },
    date: {
      type: Date,
      default: Date.now
    },
    
    branch:{
      type: String,
      required: true
    },
    question:{
        type: String
      },
    
  
  });
const professorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
      },
      question:[questionSchema],
  },
  {
    timestamps: true
  },
  
);
const Professor = mongoose.model('Professor', professorSchema);

module.exports = Professor;
