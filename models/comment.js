const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
      title: String,
      body: String
    });
    
mongoose.model('comment', CommentSchema);

module.exports ='Comment';