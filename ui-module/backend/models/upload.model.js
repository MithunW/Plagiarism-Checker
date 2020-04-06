const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const uploadSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  file: {
      type: file,
  } 
}, {
  timestamps: true,
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;