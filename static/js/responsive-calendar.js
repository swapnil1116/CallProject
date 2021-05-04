let pendingEntryDisplay = document.querySelector(".badge")
console.log(pendingEntryDisplay)
window.setInterval(function() {
    $.get("/numberOfPendingEntries", function(data, status) {
        console.log(data)
        console.log("Data: " + data + "\nStatus: " + status);
        pendingEntryDisplay.innerText = data.length

    });
    if (pendingEntryDisplay.innerText === "0" || pendingEntryDisplay.innerText === "") {
        pendingEntryDisplay.style.display = "none"
    } else {
        pendingEntryDisplay.style.display = "block"
    }
}, 6000);

parkingCapacityNumber = document.querySelector("#parkingCapacityNumber");
selectForParkingType = document.querySelector("#select-for-parkingType");
costOfParking1 = document.querySelector("#costOfParking1");
costOfParking2 = document.querySelector("#costOfParking2");
console.log(parkingCapacityNumber)
selectForCalendarType = document.getElementById("select-for-calendarType");
console.log(selectForCalendarType)
selectForCalendarType.addEventListener("input", (e) => {
    if (e.target.value === "gateKeeper") {
        console.log(e.target.value)
        parkingCapacityNumber.style.display = "block"
        selectForParkingType.style.display = "block"
    } else {
        parkingCapacityNumber.style.display = "none"
        selectForParkingType.style.display = "none"
        costOfParking1.style.display = "none"
        costOfParking2.style.display = "none"
        console.log(e.target.value)
    }
})
selectForParkingType.addEventListener("input", (e) => {
    if (e.target.value == "paid") {
        costOfParking1.style.display = "block"
        costOfParking2.style.display = "block"
    } else {
        costOfParking1.style.display = "none"
        costOfParking2.style.display = "none"
    }
});