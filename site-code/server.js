// set up
var express = require('express');
var path = require('path');
var app = express();
const redis = require("redis");
const fetch = require("node-fetch");

// Redis Connection
let client = null;
var host = 'rediscache';
var port = 6379;
console.log("Redis connection = " + host + ':' + port);
client = redis.createClient(port, host);

// timestamp for API Caching
var ttlLaunch = Date.now();

/* Launch cache with redis */
app.get("/api/launch", (req, resp) => {
    let terms = req.query.name;
    client.get("/api/launch" + terms, (err, result) => {
        if (result != null && (Date.now() - ttlLaunch) < 300000) {
            console.log("Cache hit for launches");
            resp.send(result);
        } else {
            console.log("Cache missed for launches");
            ttlLaunch = Date.now();
            fetch(
                "https://launchlibrary.net/1.3/launch/next/20"
            )
            .then(res => res.json())
            .then(json => {
                client.setex("/api/launch" + terms, 300, JSON.stringify(json));
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
