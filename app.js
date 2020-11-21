const express = require("express");
const app = express();
var AWS = require('aws-sdk');
var request = require('request');
const { info } = require("console");
let ddb = new AWS.DynamoDB({
    accessKeyId: process.env.aws_secret_key_id,
    secretAccessKey: process.env.aws_secret_access_key
});

// Sets the public folder as the external file folder
app.use(express.static("public"));

// Sets the view engine as ejs, setting the default file type for rendering to .ejs
app.set("view engine", "ejs");

app.get("/", function(req, res){
    // Set the region 
    AWS.config.update({region: 'us-west-2'});

    // Create DynamoDB service object
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    // Set up parameters for scan of Events table
    var params = 
    {
        "TableName": "EventsTable",
        ProjectionExpression: "#id, EventTitle, EventDate, EventTime, ExtraInfo, PostURL, Description, Venue",
        "ExpressionAttributeNames": { 
        "#id" : "id",
        },
        "Limit": 20,
    }

    // Perform scan
    ddb.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // Instantiate arrays for holding returned data
            var eventTitle = [];
            var eventDate = [];
            var eventTime = [];
            var eventDescription = [];
            var eventVenue = [];
            var extraInfo = [];
            var postURL = [];

            // Iterate through all the events, putting the data we got into arrays
            data.Items.forEach(function(data, index) {
                    eventTitle[index] = JSON.stringify(data.EventTitle.S);
                    eventDate[index] = JSON.stringify(data.EventDate.S);
                    eventTime[index] = JSON.stringify(data.EventTime.S);
                    eventDescription[index] = JSON.stringify(data.Description.S);
                    eventVenue[index] = JSON.stringify(data.Venue.S);
                    extraInfo[index] = JSON.stringify(data.ExtraInfo.S);
                    postURL[index] = JSON.stringify(data.PostURL.S);
            });

            //Send the info we got to Test.ejs to build the test page
            res.render("Events.ejs", {
                EventTitle: eventTitle,
                EventDate: eventDate,
                EventTime: eventTime,
                EventDescription: eventDescription,
                EventVenue: eventVenue,
                ExtraInfo: extraInfo,
                PostURL: postURL
            });
        }
    }
});

app.get("/Trail/:trailNum", function(req, res){
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

app.get("/Trails", function(req, res){

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

// Build the Google Maps page
app.get("/Google_Maps", function(req, res){
    res.render("Google_Maps.ejs");
});

// Build the Login page
app.get("/Login", function(req, res){
    res.render("Login.ejs");
});

// Catch any other routes that people might enter and send error code
app.get("*", function(req, res){
    res.send("404 Error, that route does not exist.");
});

// Start the server
app.listen(process.env.PORT || 3000, function(){
    console.log("If you see this, Node.js is running on 3000 and on Heroku.");
})
