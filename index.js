//imports
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const {QUEUE} = require("./src/queue");
const cors = require("cors");

//get the port number from environment variable if there is one, if there isn't then it will be 3000
const port = process.env.PORT || 3000;

//setup express and socket.io
const app = express();
app.use(cors());


const server = http.createServer(app);
const io = socketio(server);



//setup the global variables
const mainQueue = new QUEUE();
const systemState = {
    counters: ["", "", "", ""],
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
 
//listen to socket.io events
io.on("connection", socket => {
 
    //run when a client requests server data and to connect to a room
    socket.on("get_surver_data_and_connect", room_name =>{
        socket.join(room_name);
        socket.emit("get_surver_data", systemState);
    })

    //run when a client wants to issue a new ticket
    socket.on("new_ticket", () => {
        systemState.lastNumber = issueNewTicket();
        socket.emit("new_ticket_issued", systemState.lastNumber);
        socket.broadcast.emit("update_last_ticket", systemState.lastNumber);
    })

    //run when the management clicks the Call Next button
    socket.on("call_next", counter_name => {
        if (mainQueue.size() === 0) {
            socket.emit("empty_queue");
            return;
        }
        const current_ticket = mainQueue.dequeue();
        systemState.counters[counter_name-1] = current_ticket;
        systemState.nowServing = current_ticket;
        io.to("customer").emit("handle_ticket", current_ticket, counter_name);
    });

    //run when the management clicks the Complete Current button
    socket.on("complete_current", counter_name => {
        systemState.counters[counter_name-1] = "";
        io.to("customer").emit("handle_ticket", "", counter_name);
    });

    //run when the management clicks the Go Offline button
    socket.on("go_offline", counter_name => {
        systemState.counters[counter_name-1] = "offline";
        io.to("customer").emit("handle_ticket", "offline", counter_name);
    })
})



/**
 * creats a new ticket and increments the ticket counter
 * @returns the new ticket number
 */
function issueNewTicket() {
    lastTicket++;
    
    const buffer = ("0000000"+lastTicket);
    const output = buffer.slice(buffer.length-8,buffer.length)
    
    mainQueue.enqueue(output);

    return output;
}


//listen to requests
server.listen(port);

