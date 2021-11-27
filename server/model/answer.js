const mongoose = require('mongoose');

const answerSchema = mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      required: true,
      trim: true
    },
    date: {
        type: Date,
        default: Date.now
      }
    
  },
  {
    timestamps: true
  }
);

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
