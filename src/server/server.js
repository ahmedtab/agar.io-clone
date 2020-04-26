/*jslint bitwise: true, node: true */
"use strict";
var mongoose = require("mongodb");
var bodyParser = require("body-parser");
var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io");
var config = require("../../config.json");
var gameServer = require("./game");

mongoose.connect(config.dbInfo.MONGO_URI, { useUnifiedTopology: true });

var games = [];

var ioMain = io(http);

ioMain.on("connection", function (socket) {
    console.log("new connected!");
    socket.on("newGameServe", function (gamePath) {
        games.push({
            gameStartTime: new Date(),
            gamePath: gamePath,
        });
        gameServer.StartGameServer(io(http, { path: gamePath }));
        console.log(gamePath);
    });
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    console.log(req.url);
    next();
});
app.use("*.aik", express.static(__dirname + "/../client"));
gameServer.StartGameServer(io(http, { path: '/qwe' }));

// Don't touch, IP configurations.
var ipaddress =
    process.env.OPENSHIFT_NODEJS_IP || process.env.IP || config.host;
var serverport =
    process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || config.port;
http.listen(serverport, ipaddress, function () {
    console.log("[DEBUG] Listening on " + ipaddress + ":" + serverport);
});
