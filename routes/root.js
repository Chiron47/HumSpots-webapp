const express = require('express');
const router = express.router();

router.get("/", (req, res) => {
    // Set the region 
    AWS.config.update({region: 'us-west-2'});

    // Create DynamoDB service object
    var ddb = new AWS.DynamoDB({
        apiVersion: '2012-08-10',
        accessKeyId: process.env.aws_secret_key_id,
        secretAccessKey: process.env.aws_secret_access_key});

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

module.exports = router;