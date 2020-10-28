const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require('passport'),
    LocalStrategy = require('passport-local');

// Requiring Schemas
const Question = require("./models/questions"),
    Comment = require("./models/comments"),
    User = require("./models/user");

//APP CONFIG
mongoose.connect('mongodb://localhost:27017/find-answers', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to DB!')).catch(error => console.log(error.message));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
//Passport Configuration
app.use(require("express-session")({
    secret: "Best course on web devlopment by Colt Steele",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Adding CurrentUser to every template at once
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


//===========================
//RESTFULL ROUTES
//===========================

//Landing Page
app.get("/", function (req, res) {
    res.redirect("/khojo");
});

//====================
//INDEX ROUTES
//====================
//INDEX - Showing all the question with basic detail - GET
app.get("/khojo", function (req, res) {
    Question.find({}, function (err, allQuestion) {
        if (err) {
            console.log(err);
        } else {
            res.render("questions/index", { question: allQuestion });
        }
    });
});

//NEW - Show Form to create a new question - GET
app.get("/khojo/new", isLoggedIn, function (req, res) {
    res.render("questions/new");
});

//CREATE - Add A New Question To The Database - POST
app.post("/khojo", isLoggedIn, function (req, res) {
    let question = req.body.question;
    let description = req.body.description;
    let subject = req.body.subject;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampGround = { question: question, subject: subject, description: description, author: author };
    Question.create(newCampGround, function (err, newQuestion) {
        if (err) {
            console.log(err);
        } else {
            newQuestion.save();
            res.redirect("/khojo");
        }
    });
});

//SHOW - Show Particular Question with All its detail - GET
app.get("/khojo/:id", isLoggedIn, function (req, res) {
    Question.findById(req.params.id).populate("comments").exec(function (err, foundQuestion) {
        if (err) {
            console.log(err);
        } else {
            res.render("questions/show", { question: foundQuestion });
        }
    });
})

//=========================
//COMMENTS ROUTE
//=========================
//NEW - Adding a comment
app.get("/khojo/:id/comments/new", isLoggedIn, function (req, res) {
    Question.findById(req.params.id, function (err, question) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { question: question });
        }
    });
});

//CREATE - Creating a comment
app.post("/khojo/:id/comments", isLoggedIn, function (req, res) {
    Question.findById(req.params.id, function (err, question) {
        if (err) {
            console.log(err);
            res.redirect("/khojo");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                    res.redirect('/khojo/' + question._id + '/comments/new');
                } else {
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save comment
                    comment.save();
                    question.comments.push(comment);
                    question.save();
                    res.redirect('/khojo/' + question._id);
                }
            });
        }
    });
});

//===================
//AUTH ROUTES
//===================

//SIGN UP - Form
app.get("/signup", function (req, res) {
    res.render("user/signup")
});

//SIGN UP - Logic
app.post("/signup", function (req, res) {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.redirect("/signup");
        }
        passport.authenticate("local")(req, res, function () {
            console.log(user);
            res.redirect("/khojo")
        })
    });
});

//SIGN IN - Form
app.get("/signin", function (req, res) {
    res.render("user/signin");
});

//SING IN - Logic
app.post("/signin", passport.authenticate("local",
    {
        successRedirect: "/khojo",
        failureRedirect: "/signin"
    }), function (req, res) { }
);

// SIGN OUT - Logic
app.get("/signout", function (req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/signin");
}

//===================
// EXTRA ROUTES
//===================

app.get("/khojo/subjects", function (req, res) {
    res.render("subjects/subjects");
});
app.get("/khojo/teachers", function (req, res) {
    res.render("teachers/teachers");
});


//===================
//SERVER LISTENING
//===================
app.listen(3000, function () {
    console.log("Server has started on port 3000");
});