//modules we wiil use
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");
bodyParser = require('body-parser');

require("./config/passport")(passport);
const app = express();

//DB URI configuration
const DBURI = require("./config/DBURI").MONGO_URI;

//Connect to DB
mongoose
    .connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected."))
    .catch(err => console.log(err));


// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
// Express body parser
app.use(express.urlencoded({ extended: true }));

//express session
app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 6000 }
    })
  );

//passppor midllewares  
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.student_add_success_msg = req.flash("student_add_success_msg");
  res.locals.student_del_success_msg = req.flash("student_del_success_msg");
  res.locals.student_update_success_msg = req.flash(
    "student_update_success_msg"
  );
  res.locals.error = req.flash("error");
  next();
});

// support parsing of application/json type post data
app.use(bodyParser.json());
//Routes
app.use("/", require("./routes/mainroutes"));
app.use("/users", require("./routes/userRoutes"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

