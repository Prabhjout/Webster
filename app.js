const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    Question = require("./models/questions"),
    Comment = require("./models/comments"),
    mongoose = require("mongoose");

//APP CONFIG
mongoose.connect('mongodb://localhost:27017/find_answer', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to DB!')).catch(error => console.log(error.message));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


//RESTFULL ROUTES
//Landing Page
app.get("/", function (req, res) {
    res.render("landing");
});

//INDEX
app.get("/khojo", function (req, res) {
    res.render("index");
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