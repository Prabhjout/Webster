const express      = require("express"),
      app          = express(),  
      bodyParser   = require("body-parser");
//       mongoose     = require("mongoose");

// mongoose.connect('mongodb://localhost:27017/find_answer', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log('Connected to DB!')).catch(error => console.log(error.message));

// //Schema Setup
// var campgroundSchema = new mongoose.Schema({
//     name: String,
//     image: String,
//     description: String
// });
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("landing");
});






app.listen(4000, function(){
    console.log("Server has started");
});