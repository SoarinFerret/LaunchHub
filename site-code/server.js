// set up
var express = require('express');
var path = require('path');
var app = express();
const redis = require("redis");
const fetch = require("node-fetch");

// Define API Keys
const weatherApiKey = process.env.WEATHERAPIKEY

// Redis Connection Setup
let client = null;
var host = 'rediscache';
var port = 6379;
console.log("Redis connection = " + host + ':' + port);
client = redis.createClient(port, host);

// Time to live for launch and Weather APIs
var ttlLaunch = 300; // 5 minutes
var ttlWeather = 3600; // 1 Hour

/*  Launch cache with redis
    To make the call, it should look like this:

          <serverip>:8080/api/launch/

    Value automatically flush from redis based on TTL value above */

app.get("/api/launch", (req, resp) => {
    client.get("/api/launch", (err, result) => {
        if (result != null ) {
            console.log("Cache hit for launches");
            resp.send(result);
        } else {
            console.log("Cache missed for launches");
            fetch(
                "https://launchlibrary.net/1.3/launch/next/20"
            )
            .then(res => res.json())
            .then(json => {
                client.setex("/api/launch", ttlLaunch, JSON.stringify(json));
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
