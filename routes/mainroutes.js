const express = require("express");
const router = express.Router();
const fs = require("fs");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/autherization");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) =>
  res.render("welcome", { user: req.session.name, layout: "layouts/layout"  })
);

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

module.exports = router;