const mongoose = require('mongoose');
const solutionFileSchema = mongoose.Schema(
    {
        regCode: {
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
const solutionSchema = mongoose.Schema(
  {
    assiCode: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: { type: Date, expires:1000*86400*7, default: Date.now },
    solution:[solutionFileSchema],
  },
  {
    timestamps: true
  },
  
);
const Solution = mongoose.model('Solution', solutionSchema);
module.exports = Solution;
