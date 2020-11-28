const express = require('express');
const router = express.Router();
const request = require('request');

//Routes
router.get("/", (req, res) => {

    // Use request to pull a large string of JSON containing the Trails data
    request("https://maps.googleapis.com/maps/api/place/textsearch/json?query=Trails+in+Humboldt&key=AIzaSyB2SbC24Cm4_D1Dl8qooOLLckDtBa362bM", function(error, response, body) {
        if (error) {
            console.log(error);
        } else {
            //Parse the string representation of JSON to JSON
            var data = JSON.parse(body);

            // Instantiate the arrays for holding Trails data
            var names = [];
            var addresses = [];
            var ratings = [];
            var numRatings = [];
            var photoReference = [];
            var indexNum = [];

            // Iterate over the returned data, building out the arrays as we do so
            data.results.forEach(function(data, index) {
                names[index] = JSON.stringify(data.name);
                addresses[index] = JSON.stringify(data.formatted_address);
                ratings[index] = JSON.stringify(data.rating);
                numRatings[index] = JSON.stringify(data.user_ratings_total);
                indexNum[index] = index;
                try {
                    photoReference[index] = JSON.stringify(data.photos[0].photo_reference);
                }
                catch (error) {
                    photoReference[index] ="_PHOTO_REFERENCE_";
                }
            });

            // Send the info we got to Trails.ejs to build the Trails page
            res.render("Trails.ejs", {
                Name: names,
                Address: addresses,
                Rating: ratings,
                NumRating: numRatings,
                PhotoReference: photoReference,
                indexNum: indexNum,
                Results: data.results,
            });
        }
    });
});

module.exports = router;