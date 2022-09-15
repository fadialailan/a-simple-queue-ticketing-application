//imports
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const {QUEUE} = require("./src/queue");

//get the port number from environment variable if there is one, if there isn't then it will be 3000
const port = process.env.PORT || 3000;

//setup express and socket.io
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//setup the global variables
const mainQueue = new QUEUE();
const systemState = {
    counter1: null,
    counter2: null,
    counter3: null,
    counter4: null,
    nowServing: null,
    lastNumber: null
}
let lastTicket = 0;

//give access to the src folder
app.use("/src",express.static(__dirname+"/src"));

//the default page will be the customer page
app.get("/", (req, res, next) => {
    res.sendFile(__dirname+"/src/customer.html");
})
 
//return the manager page if it is requested
app.get("/management", (req, res, next) => {
    res.sendFile(__dirname+"/src/management.html");
})
 
//listen to socket io events
io.on("connection", socket => {
    console.log("connect");
    //socket.emit("new_ticket_issued", "aaaaaa");
 
    socket.on("get_data", () =>{
        socket.emit("get_data", systemState);
    })

    socket.on("new_ticket", () => {
        systemState.lastNumber = issueNewTicket();
        socket.emit("new_ticket_issued", systemState.lastNumber);
        
    })
})


function issueNewTicket() {
    lastTicket++;
    
    const buffer = ("0000000"+lastTicket);
    const output = buffer.slice(buffer.length-8,buffer.length)
    
    mainQueue.enqueue(output);

    return output;
}


//listen to requests
server.listen(port);

