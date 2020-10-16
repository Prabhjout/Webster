const mongoose = require('mongoose');
//Schema Setup
var CommentsSchema = new mongoose.Schema({
    title: String,
    author: String,
    upVotes: Number,
    downVotes: Number
});

module.exports = mongoose.model('Comment', CommentsSchema);
