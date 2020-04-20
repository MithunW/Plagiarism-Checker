const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const uploadSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  file: {
      type: file,
  } 
}, {
  timestamps: true,
});

const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;