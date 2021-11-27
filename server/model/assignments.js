const mongoose = require('mongoose');
const assignmentFileSchema = mongoose.Schema(
    {
        title: {
          type: String,
          required: true,
          trim: true
        },
        file_path: {
          type: String,
          required: true
        },
        file_mimetype: {
          type: String,
          required: true
        }
      },
      {
        timestamps: true
      }
);
const assignmentSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: { type: Date, expires:1000*86400*7, default: Date.now },

      assignment:[assignmentFileSchema],
  },
  {
    timestamps: true
  },
  
);
const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
