// set up
var express = require('express');
var path = require('path');
var app = express();
const redis = require("redis");
const fetch = require("node-fetch");

// Define API Keys
const weatherApiKey = process.env.WEATHERAPIKEY;

// Redis Connection Setup
let client = null;
var host = 'rediscache';
var port = 6379;
console.log("Creating redis connection at " + host + ':' + port);
client = redis.createClient(port, host);

// Time to live for launch and Weather APIs
var ttlLaunch = 300; // 5 minutes
var ttlWeather = 3600; // 1 Hour

// Create Date strings for past Launches
var today = new Date(Date.now());
var month = (parseInt(today.getUTCMonth())+1); // Because JS UTC months start at 0 for some reason
var startDate = today.getUTCFullYear() + "-" + month + "-" + today.getUTCDate();
var lastMonth = month-1
if (lastMonth == 0){lastMonth = 12}
var endDate = today.getUTCFullYear() + "-" + lastMonth + "-" + today.getUTCDate();

/*  Upcoming Launch cache with redis
    To make the call, it should look like this:

          <serverip>:8080/api/futurelaunches

    Value automatically flush from redis based on TTL value above */
app.get("/api/futurelaunches", (req, resp) => {
    // Check Redis for value
    client.get("/api/futurelaunches", (err, result) => {
        if (result != null ) { // If value exists in redis, return it
            console.log("Cache hit for future launches");
            resp.send(result);
        } else {
            console.log("Cache missed for future launches");
            // Fetch API result
            fetch(
                "https://launchlibrary.net/1.3/launch/next/20"
            )
            // Grab json, convert it to string to store it in redis
            // then return value
            .then(res => res.json())
            .then(json => {
                // Update futurelaunches in redis
                client.setex("/api/futurelaunches", ttlLaunch, JSON.stringify(json));
                resp.send(json);
            })
            .catch(err => {
                console.error(err);
                resp.send(202);
            });
        }
    });
    return;
});

/*  Previous Launch cache with redis
    To make the call, it should look like this:

          <serverip>:8080/api/pastlaunches

    Value automatically flush from redis based on TTL value above */

app.get("/api/pastlaunches", (req, resp) => {
    // Check Redis for value
    client.get("/api/pastlaunches", (err, result) => {
        if (result != null ) { // If value exists in redis, return it
            console.log("Cache hit for past launches");
            resp.send(result);
        } else {
            console.log("Cache missed for past launches");
            // Update date variables if cache miss
            var today = new Date(Date.now());
            var month = (parseInt(today.getUTCMonth())+1); // Because JS UTC months start at 0 for some reason
            var startDate = today.getUTCFullYear() + "-" + month + "-" + today.getUTCDate();
            var lastMonth = month-1
            if (lastMonth == 0){lastMonth = 12}
            var endDate = today.getUTCFullYear() + "-" + lastMonth + "-" + today.getUTCDate();
            // Fetch API result
            fetch(
                "https://launchlibrary.net/1.3/launch/?startdate=" + startDate +
                "&enddate=" + endDate
            )
            // Grab json, convert it to string to store it in redis
            // then return value
            .then(res => res.json())
            .then(json => {
                // Update pastlaunches in redis
                client.setex("/api/pastlaunches", ttlLaunch, JSON.stringify(json));
                resp.send(json);
            })
            .catch(err => {
                console.error(err);
                resp.send(202);
            });
        }
    });
    return;
});

/*  Weather Cache with Redis
    To make the call, it should look like this:

          <serverip>:8080/api/weather/loc=41.84,-96.70

    Value automatically flush from redis based on TTL value above */

app.get("/api/weather", (req, resp) => {
    // Grab value 'loc' from url and write to console
    let term = req.query.loc;
    console.log("Location is " + req.query.loc);

    // Check Redis for value
    client.get("/api/weather" + term, (err, result) => {
        if (result != null){ // If value exists in redis, return it
            console.log("Cache hit for weather");
            resp.send(result);
        } else {
            console.log("Cache missed for weather");
            // Fetch API result
            fetch(
                " https://api.darksky.net/forecast/" +
                weatherApiKey + "/" +
                term
            )
            // Grab json, convert it to string to store it in redis
            // then return value
            .then(res => res.json())
            .then(json => {
                // Update location Weather in redis
                client.setex("/api/weather" + term, ttlWeather, JSON.stringify(json));
                resp.send(json);
            })
            .catch(err => {
                console.error(err);
                resp.send(202);
            });
        }
    });
    return;
});

// Static content
app.use(express.static(path.join(__dirname, 'public')));

// listener
app.listen(8080);
console.log("App listening on port 8080");
