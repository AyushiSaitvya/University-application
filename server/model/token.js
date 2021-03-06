const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema

const tokenSchema = new Schema({
    _userId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: 'User' 
    },
    token: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        required: true, 
        default: Date.now, 
        expires: 43200 
    }
});
const Token = mongoose.model('Token',tokenSchema);
module.exports = Token;
