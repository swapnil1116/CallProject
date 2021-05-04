let disabledSubmitButton = document.querySelector(".save-btn")
let inputStartTime = document.querySelector(".input-start-time")
let inputEndTime = document.querySelector(".input-end-time")


let fromDateBookAppointment = inputStartTime.value.split("T")[0]
let toDateBookAppointment = inputStartTime.value.split("T")[0]
console.log(fromDateBookAppointment)
console.log(toDateBookAppointment)
inputStartTime.addEventListener("input",(eStartTime)=>{
    console.log(eStartTime.target.value)
    let fromDateBookAppointmentInsideFirstFunction = eStartTime.target.value.split("T")[0]
    console.log(fromDateBookAppointmentInsideFirstFunction)
    if(eStartTime.target.value >= inputEndTime.value || toDateBookAppointment !== fromDateBookAppointmentInsideFirstFunction){
        console.log("Start time cannot be after the End Time")
        if(disabledSubmitButton.classList.contains("disabled-submit-button")){
            console.log("Already class disabled")
        }
        else{
            disabledSubmitButton.classList.add("disabled-submit-button")
            disabledSubmitButton.disabled = true
        }
    }
    else{
        console.log("disabled remove");
        disabledSubmitButton.classList.remove("disabled-submit-button")
        disabledSubmitButton.disabled = false
    }
    inputEndTime.addEventListener("input",(eEndTime)=>{
        console.log(eEndTime.target.value)
        if(eStartTime.target.value >= eEndTime.target.value || eStartTime.target.value.split("T")[0]!==eEndTime.target.value.split("T")[0]){
            console.log("Start time cannot be after the End Time")
            if(disabledSubmitButton.classList.contains("disabled-submit-button")){
                console.log("Already class disabled")
            }
            else{
                disabledSubmitButton.classList.add("disabled-submit-button")
                disabledSubmitButton.disabled = true
            }
        }
        else{
            console.log("Start Time and End Time both are perfect")
            disabledSubmitButton.classList.remove("disabled-submit-button")
            disabledSubmitButton.disabled = false
        }
    })
})


inputEndTime.addEventListener("input",(eEndTime)=>{
    console.log(eEndTime.target.value)
    let toDateBookAppointmentInsideFirstFunction = eEndTime.target.value.split("T")[0]
    if(inputStartTime.value >= eEndTime.target.value || fromDateBookAppointment !== toDateBookAppointmentInsideFirstFunction){

        if(disabledSubmitButton.classList.contains("disabled-submit-button")){
            console.log("Already class disabled")
        }
        else{
            disabledSubmitButton.classList.add("disabled-submit-button")
            disabledSubmitButton.disabled = true
        }
    }
    else{
        console.log("Disabled from here");
        disabledSubmitButton.classList.remove("disabled-submit-button")
        disabledSubmitButton.disabled = false
    }
    inputStartTime.addEventListener("input",(eStartTime)=>{
        console.log(eStartTime.target.value)
        if(eStartTime.target.value >= eEndTime.target.value || eStartTime.target.value.split("T")[0]!==eEndTime.target.value.split("T")[0]){
            console.log("Start time cannot be after the End Time")
            if(disabledSubmitButton.classList.contains("disabled-submit-button")){
                console.log("Already class disabled")
            }
            else{
                disabledSubmitButton.classList.add("disabled-submit-button")
                disabledSubmitButton.disabled = true
            }
        }
        else{
            console.log("Start Time and End Time both are perfect")
            disabledSubmitButton.classList.remove("disabled-submit-button")
            disabledSubmitButton.disabled = false
        }
    })
})

function settingColorsOfAppointments () {
    let hidingAppointmentStatus = document.querySelectorAll(".hiding-appointment-status")
    for(let i = 0 ; i<hidingAppointmentStatus.length ; i++ ){

        if(hidingAppointmentStatus[i].innerText === "pending"){
        hidingAppointmentStatus[i].nextElementSibling.classList.add("not-accepted-appointment")
        }
        else if(hidingAppointmentStatus[i].innerText === "true"){
        hidingAppointmentStatus[i].nextElementSibling.classList.add("accepted-appointment")
        }
        else if(hidingAppointmentStatus[i].innerText === "cancel"){
        hidingAppointmentStatus[i].nextElementSibling.classList.add("cancelled-appointment")
        }
        if(hidingAppointmentStatus[i].innerText !==""){
            hidingAppointmentStatus[i].nextElementSibling.classList.add("make-font-white-for-appointment-text")
        }
    }
}

window.onload = settingColorsOfAppointments;