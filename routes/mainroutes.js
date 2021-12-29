const express = require("express");
const router = express.Router();
const fs = require("fs");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/autherization");
const mainController = require("../controllers/mainControllers");
const Bus = require("../models/buses");
const Routes = require("../models/routes");

// Welcome Page
router.get("/", isLoggedIn, (req, res) => {
  res.render("welcome", { user: req.user, isLoggedIn: req.isLogged, layout: "layouts/layout" });
  
});

router.get("/complaints" , (req, res) => {
  res.render("complaints", { layout: "layouts/layout" });
});

router.post("/complaints", mainController.SaveComplaints);

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    user: req.user,
    layout: "layouts/layout"
  })
);

router.get('/resources/png/:filename', function(req, res){
  var file = fs.readFileSync("resources/png/"+req.params.filename);
  res.header("content-type","image/png");
  res.send(file);
})



function isLoggedIn(req, res, next) {
  if(!req.isAuthenticated())
  {
      req.isLogged = true
  }
  else
  {
     req.isLogged = false
  }
  return next();
}

module.exports = router;