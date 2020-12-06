const express = require('express');
const router = express.Router();
const request = require('request');

router.get("/:trailNum", (req, res) => {
    // Use request to pull a large string of JSON containing the Trails data
    request("https://maps.googleapis.com/maps/api/place/textsearch/json?query=Trails+in+Humboldt&key=AIzaSyCYb2gcE4rqmhoQ_9bcL2GSTsoihFn3xUU", (error, response, body) => {
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
            var photoReferences = [];
            var latitudes = [];
            var longitudes = [];

            trailNum = Number(req.params.trailNum);

            // Make sure the trailNum we got from the route parameter is a valid number
            if (!isNaN(trailNum)) {
                nonNanTrailNum = trailNum;
            }

            // Iterate over the returned data, building out the arrays as we do so
            data.results.forEach(function(data, index) {
                names[index] = JSON.stringify(data.name);
                addresses[index] = JSON.stringify(data.formatted_address);
                ratings[index] = JSON.stringify(data.rating);
                numRatings[index] = JSON.stringify(data.user_ratings_total);
                latitudes[index] = JSON.stringify(data.geometry.location.lat);
                longitudes[index] = JSON.stringify(data.geometry.location.lng);

                try {
                    photoReferences[index] = JSON.stringify(data.photos[0].photo_reference);

                }
                catch (error) {
                    photoReferences[index] ="_PHOTO_REFERENCE_";
                }
            });
        }

        // Send the info we got to Trails.ejs to build the Trails page
        res.render("Trail.ejs", {
            Name: names,
            Address: addresses,
            Rating: ratings,
            NumRating: numRatings,
            PhotoReference: photoReferences,
            latitude: latitudes,
            longitude: longitudes,
            trailNum: nonNanTrailNum,
            Results: data.results
        });  
    });  
});


module.exports = router;