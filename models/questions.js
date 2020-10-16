const mongoose = require('mongoose');
//Schema Setup
var QuestionSchema = new mongoose.Schema({
    question: String,
    author: String,
    answer: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model('Question', QuestionSchema);
