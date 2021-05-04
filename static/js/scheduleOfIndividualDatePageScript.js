let disabledSubmitButton = document.querySelector(".disabled-submit-button")
let inputStartTime = document.querySelector(".input-start-time")
let inputEndTime = document.querySelector(".input-end-time")

inputStartTime.addEventListener("input",(eStartTime)=>{
    console.log(eStartTime.target.value)
    inputEndTime.addEventListener("input",(eEndTime)=>{
        console.log(eEndTime.target.value)
        if(eStartTime.target.value >= eEndTime.target.value){
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

        if(hidingAppointmentStatus[i].innerText === "pending" || hidingAppointmentStatus[i].innerText === "false"){
        hidingAppointmentStatus[i].nextElementSibling.classList.add("not-accepted-appointment")
        }
        else if(hidingAppointmentStatus[i].innerText === "true"){
        hidingAppointmentStatus[i].nextElementSibling.classList.add("accepted-appointment")
        }
        else if(hidingAppointmentStatus[i].innerText === "cancel"){
        hidingAppointmentStatus[i].nextElementSibling.classList.add("cancelled-appointment")
        }
        if(hidingAppointmentStatus[i].innerText !==""){
            hidingAppointmentStatus[i].nextElementSibling.classList.add("make-font-white-for-description-text")
        }
    }
}

window.onload = settingColorsOfAppointments;