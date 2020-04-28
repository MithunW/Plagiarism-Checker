const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const resultSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  files: { 
    type : Array,
    "default" : [],
    required : true, 
    },
  checkType : {
      type : String,
      required : true
  } 
}, {
  timestamps: true,
});

const Upload = mongoose.model('Result', resultSchema);

module.exports = Upload;