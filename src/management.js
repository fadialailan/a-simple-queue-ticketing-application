const socket = io("http://localhost:3000/");

//request data and connect to the managment room
socket.emit("get_surver_data_and_connect", "managment");

//run when data is revieved
socket.on("get_surver_data", data => {
    addCallNextEvents();
    addCompleteCurrentEvents();
    addGoOfflineEvents();
})

//run when beeing informed that the queue is empty
socket.on("empty_queue", () => {
    const div = document.getElementById("queue-meassage");
    div.innerText = "the queue is empty, there are no more tickets";
})

//run when beeing informed that a new ticket was issued
socket.on("update_last_ticket", () => {
    const div = document.getElementById("queue-meassage");
    div.innerText = "";
})

/**
 * add to the Call Next buttons event listeners
 */
function addCallNextEvents() {
    
    const counters = document.getElementsByClassName("counter");
    for (let index = 0; index < counters.length; index++){
        const callNextButton = counters[index].getElementsByClassName("call-next")[0];
        callNextButton.addEventListener("click", (event) =>{
            event.preventDefault();
            socket.emit("call_next", index+1);
        })
    }
}

/**
 * add to the Complete Current buttons event listeners
 */
function addCompleteCurrentEvents() {
    const counters = document.getElementsByClassName("counter");
    for (let index = 0; index < counters.length; index++){
        const callNextButton = counters[index].getElementsByClassName("complete-current")[0];
        callNextButton.addEventListener("click", (event) =>{
            event.preventDefault();
            socket.emit("complete_current", index+1);
        })
    }
}

/**
 * add to the Go Offline buttons event listeners
 */
function addGoOfflineEvents(){
    const counters = document.getElementsByClassName("counter");
    for (let index = 0; index < counters.length; index++){
        const callNextButton = counters[index].getElementsByClassName("go-offline")[0];
        callNextButton.addEventListener("click", (event) =>{
            event.preventDefault();
            socket.emit("go_offline", index+1);
        })
    }
}
