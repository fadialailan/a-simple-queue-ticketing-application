const socket = io("http://localhost:3000/");

//request data
socket.emit("get_surver_data", "managment");

socket.on("get_surver_data", data => {
    addCallNextEvents();
    addCompleteCurrentEvents();
    addGoOfflineEvents();
})

socket.on("empty_queue", () => {
    const div = document.getElementById("queue-meassage");
    div.innerText = "the queue is empty, there are no more tickets";
})

socket.on("update_last_ticket", () => {
    const div = document.getElementById("queue-meassage");
    div.innerText = "";
})


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
