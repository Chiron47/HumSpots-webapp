const express = require("express");
const app = express();
const { info } = require("console");

// Sets the public folder as the external file folder
app.use(express.static("public"));

// Sets the view engine as ejs, setting the default file type for rendering to .ejs
app.set("view engine", "ejs");

//Import and use routes
const rootRoute = require('./routes/root');
const trailRoute = require('./routes/trail');
const trailsRoute = require('./routes/trails');

app.use('/', rootRoute);
app.use('/Trail', trailRoute);
app.use('/Trails', trailsRoute);

// Build the Google Maps page
app.get("/Google_Maps", (req, res) => {
    res.render("Google_Maps.ejs");
});

// Catch any other routes that people might enter and send error code
app.get("*", (req, res) => {
    res.send("404 Error, that route does not exist.");
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`If you see this, Node.js is running on ${port}.`);
})
