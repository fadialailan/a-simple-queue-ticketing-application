const socket = io("http://localhost:3000/");

let serverData;

socket.emit("get_data");

socket.on("get_data", message => {
    serverData = message;
    updateLastNumber(serverData.lastNumber);
});

socket.on("new_ticket_issued", lastNumber => {
    serverData.lastNumber = lastNumber;
    updateLastNumber(lastNumber);
});

const mainButton = document.getElementById("main-button");

mainButton.addEventListener("click", (event) => {
    event.preventDefault();
    socket.emit("new_ticket");
})

function updateLastNumber(lastNumber){
    lastNumber = lastNumber || "00000000";

    const displayText = "Last Number: "+lastNumber;
    const span = document.getElementById("last-number");
    span.innerHTML=displayText;
}
