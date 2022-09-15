const socket = io("http://localhost:3000/");


//request data
socket.emit("get_surver_data", "customer");

socket.on("get_surver_data", data => {
    updateLastNumber(data.lastNumber);
    updateAllCounters(data);
});

socket.on("update_last_ticket", lastNumber => {
    updateLastNumber(lastNumber);
})

socket.on("new_ticket_issued", newNumber => {
    updateLastNumber(newNumber);
    showNewNumber(newNumber)
});

socket.on("handle_ticket", (current_ticket, counter_name) => {
    updatCounterInformation(current_ticket, counter_name);
});

const mainButton = document.getElementById("main-button");

mainButton.addEventListener("click", (event) => {
    event.preventDefault();
    socket.emit("new_ticket");
})

function updateLastNumber(lastNumber){
    lastNumber = lastNumber || "00000000";

    const span = document.getElementById("last-number");
    span.innerHTML="Last Number: " + lastNumber;
}

function showNewNumber(newNumber){
    const div = document.getElementById("ticket-display");
    div.innerHTML = "your number is: " + newNumber;
}

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

function updateAllCounters(data) {
    const COUNTERS_SIZE = 4;

    for (let conuter_name = 1; conuter_name <= COUNTERS_SIZE; conuter_name++){
        updatCounterInformation(data.counters[conuter_name-1], conuter_name);
    }
}

