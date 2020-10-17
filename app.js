const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    Question = require("./models/questions"),
    // Comment = require("./models/comments"),
    mongoose = require("mongoose");

//APP CONFIG
mongoose.connect('mongodb://localhost:27017/find-answers', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to DB!')).catch(error => console.log(error.message));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


// var quest = {
//     question: "How to study Data Structures in one night for an exam?",
//     author: "theDev",
//     subject: "Data Strunctures",
//     description: "I have an exam tommorow and I know nothing about Data Structures. Someone please guide to score 100 marks.",
//     // comments: [
//     //     {
//     //         type: mongoose.Schema.Types.ObjectId,
//     //         ref: "Comment"
//     //     }
//     // ],
//     upVotes: 23,
//     downVotes: 10
// }
// Question.create(quest, function (err, question) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(question);
//     }
// });

//RESTFULL ROUTES
//Landing Page
app.get("/", function (req, res) {
    res.render("landing");
});

//INDEX
app.get("/khojo", function (req, res) {
    Question.find({}, function (err, allQuestions) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { questions: allQuestions });

        }
    });
});
app.get("/khojo/subjects", function (req, res) {
    res.render("subjects");
});
app.get("/khojo/teachers", function (req, res) {
    res.render("teachers");
});


app.listen(4000, function () {
    console.log("Server has started");
});