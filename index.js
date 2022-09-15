const express = require("express");
const http = require("http");

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

app.use("/src",express.static(__dirname+"/src"));

app.get("/", (req, res, next) => {
    res.sendFile(__dirname+"/src/customer.html");
})

app.get("/management", (req, res, next) => {
    res.sendFile(__dirname+"/src/management.html");
})

server.listen(port, () => {
    console.log("listining to port");
});

