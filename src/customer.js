const socket = io("http://localhost:3000/");


//request data and connect to the customer room
socket.emit("get_surver_data_and_connect", "customer");

//runs when recieving the servers main state data 
socket.on("get_surver_data", data => {
    updateLastNumber(data.lastNumber);
    updateNowServing(data.nowServing);
    updateAllCounters(data);
});

//run when a new ticket was issued by another client
socket.on("update_last_ticket", lastNumber => {
    updateLastNumber(lastNumber);
})

//runs when a ticket requested by this client is issued
socket.on("new_ticket_issued", newNumber => {
    updateLastNumber(newNumber);
    showNewTicketNumber(newNumber)
});

//runs when a counter preforms an action
socket.on("handle_ticket", (current_ticket, counter_name) => {
    if (current_ticket !== "" && current_ticket !== "offline"){
        updateNowServing(current_ticket);
    }

    updatCounterInformation(current_ticket, counter_name);
});

//add an event listener to the main button
const mainButton = document.getElementById("main-button");

mainButton.addEventListener("click", (event) => {
    event.preventDefault();
    socket.emit("new_ticket");
})

/**
 * updates the Last Number display 
 * @param lastNumber the new last number
 */
function updateLastNumber(lastNumber){
    lastNumber = lastNumber || "00000000";

    const span = document.getElementById("last-number");
    span.innerHTML = "Last Number: " + lastNumber;
}

/**
 * updates the Now Serving display 
 * @param nowServing the new now serving number
 */
function updateNowServing(nowServing){
    nowServing = nowServing || "00000000";

    const span = document.getElementById("now-serving");
    span.innerHTML = "Now Serving: " + nowServing;
}

/**
 * show to the client the new number he issued
 * @param newNumber the new ticket number 
 */
function showNewTicketNumber(newNumber){
    const div = document.getElementById("ticket-display");
    div.innerHTML = "your number is: " + newNumber;
}

/**
 * a function to update the information of a counter
 * @param current_ticket the new current ticket of the counter
 * @param counter_name the counter's name
 */
function updatCounterInformation(current_ticket, counter_name) {
    //get counter
    const counter = document.getElementById("counter-"+counter_name);
    
    //get the status-dot
    const status_dot = counter.getElementsByClassName("status-dot")[0]

    //make the dot normal
    status_dot.classList.remove("status-dot-used");
    status_dot.classList.remove("status-dot-offline")

    //check type of ticket
    if (current_ticket === "") { //the counter is empty
        // do nothing

    } else if (current_ticket === "offline"){ //the counter is offline
        //make the dot gray
        status_dot.classList.add("status-dot-offline")

    } else { //the counter recieved a new ticket
        //make the dot red
        status_dot.classList.add(["status-dot-used"]);
    }


    //change counter ticker number 
    counter.getElementsByClassName("counter-current-number")[0].innerHTML = String(current_ticket);

}

/**
 * updates all counters (mainly used at the start of the program)
 * @param data the server's state data
 */
function updateAllCounters(data) {
    const COUNTERS_SIZE = 4;

    for (let conuter_name = 1; conuter_name <= COUNTERS_SIZE; conuter_name++){
        updatCounterInformation(data.counters[conuter_name-1], conuter_name);
    }
}

