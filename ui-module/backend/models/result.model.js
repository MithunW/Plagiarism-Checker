const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const resultSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  files: [{
    type: String
  }],
  checkType : {
      type : String,
      required : true
  },
  similarity : {
    type : Number,
    required : true
  }
}, {
  timestamps: true,
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;