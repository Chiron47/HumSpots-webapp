const express = require('express');
const router = express.Router();

//Routes
router.get("/Google_Maps", (req, res) => {
    res.render("Google_Maps.ejs");
});

module.exports = router;