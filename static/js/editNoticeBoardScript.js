let disabledSubmitButton = document.querySelector(".save-btn")
let inputStartTime = document.querySelector(".input-start-time")
let inputStartTimeValue = document.querySelector(".input-start-time").value
let inputEndTime = document.querySelector(".input-end-time")
let inputEndTimeValue = document.querySelector(".input-end-time").value
let inputNoticeHeading = document.querySelector(".noticeHeading")
let inputNoticeHeadingValue = document.querySelector(".noticeHeading").value
let inputNoticeDescription = document.querySelector(".noticeDescription")
let inputNoticeDescriptionValue = document.querySelector(".noticeDescription").value


let fromDateBookAppointment = inputStartTime.value.split("T")[0]
let toDateBookAppointment = inputStartTime.value.split("T")[0]
console.log(fromDateBookAppointment)
console.log(toDateBookAppointment)
inputStartTime.addEventListener("input", (eStartTime) => {
    console.log(eStartTime.target.value)
    if (eStartTime.target.value > inputEndTimeValue) {
        console.log("Start time cannot be after the End Time")
        if (disabledSubmitButton.classList.contains("disabled-submit-button")) {
            console.log("Already class disabled")
            eStartTime.target.classList.remove("content-changed")
        } else {
            disabledSubmitButton.classList.add("disabled-submit-button")
            disabledSubmitButton.disabled = true
            eStartTime.target.classList.remove("content-changed")
        }
    } else {
        if (eStartTime.target.value == inputStartTimeValue) {
            if (disabledSubmitButton.classList.contains("disabled-submit-button")) {
                console.log("Already class disabled")
                eStartTime.target.classList.remove("content-changed")
            } else {
                disabledSubmitButton.classList.add("disabled-submit-button")
                disabledSubmitButton.disabled = true
                eStartTime.target.classList.remove("content-changed")
            }
        } else {
            console.log("disabled remove");
            disabledSubmitButton.classList.remove("disabled-submit-button")
            disabledSubmitButton.disabled = false
            if (eStartTime.classList.contains("content-changed")) {

            } else {
                eStartTime.target.classList += " content-changed"
            }
        }
    }
    inputEndTime.addEventListener("input", (eEndTime) => {
        console.log(eEndTime.target.value)
        if (eStartTime.target.value >= eEndTime.target.value) {
            console.log("Start time cannot be after the End Time")
            if (disabledSubmitButton.classList.contains("disabled-submit-button")) {
                console.log("Already class disabled")
                eEndTime.target.classList.remove("content-changed")
            } else {
                disabledSubmitButton.classList.add("disabled-submit-button")
                disabledSubmitButton.disabled = true
                eEndTime.target.classList.remove("content-changed")
            }
        } else {
            if ()
                console.log("Start Time and End Time both are perfect")
            disabledSubmitButton.classList.remove("disabled-submit-button")
            disabledSubmitButton.disabled = false
            if (eEndTime.targetclassList.contains("content-changed")) {

            } else {
                eEndTime.target.classList += " content-changed"
            }
        }
    })
})


inputEndTime.addEventListener("input", (eEndTime) => {
    console.log(eEndTime.target.value + "  " + inputStartTimeValue)
    if (inputStartTimeValue > eEndTime.target.value) {

        if (disabledSubmitButton.classList.contains("disabled-submit-button")) {
            console.log("Already class disabled")
            eEndTime.target.classList.remove("content-changed")
        } else {
            disabledSubmitButton.classList.add("disabled-submit-button")
            disabledSubmitButton.disabled = true
            eEndTime.target.classList.remove("content-changed")
        }
    } else {
        console.log("Disabled from here");
        disabledSubmitButton.classList.remove("disabled-submit-button")
        disabledSubmitButton.disabled = false
        if (eEndTime.target.classList.contains("content-changed")) {

        } else {
            eEndTime.target.classList += " content-changed"
        }

    }
    inputStartTime.addEventListener("input", (eStartTime) => {
        console.log(eStartTime.target.value)
        if (eStartTime.target.value >= eEndTime.target.value) {
            console.log("Start time cannot be after the End Time")
            if (disabledSubmitButton.classList.contains("disabled-submit-button")) {
                console.log("Already class disabled")
                eStartTime.target.classList.remove("content-changed")
            } else {
                disabledSubmitButton.classList.add("disabled-submit-button")
                disabledSubmitButton.disabled = true
                eStartTime.target.classList.remove("content-changed")
            }
        } else {
            console.log("Start Time and End Time both are perfect")
            disabledSubmitButton.classList.remove("disabled-submit-button")
            disabledSubmitButton.disabled = false
            eStartTime.target.classList += " content-changed"
            if (eStartTime.target.classList.contains("content-changed")) {

            } else {
                eStartTime.target.classList += " content-changed"
            }
        }
    })
})

inputNoticeHeading.addEventListener("input", (e) => {
    console.log(e.target.value + "  " + inputNoticeHeadingValue)
    if (e.target.value == inputNoticeHeadingValue) {
        if (disabledSubmitButton.classList.contains("disabled-submit-button")) {
            console.log("Already class disabled")
        } else {
            disabledSubmitButton.classList.add("disabled-submit-button")
            disabledSubmitButton.disabled = true
        }
    } else {
        disabledSubmitButton.classList.remove("disabled-submit-button")
        disabledSubmitButton.disabled = false
        e.target.classList += " content-changed"
    }
})
inputNoticeDescription.addEventListener("input", (e) => {
    if (e.target.value == inputNoticeDescriptionValue) {

        if (disabledSubmitButton.classList.contains("disabled-submit-button")) {
            console.log("Already class disabled")
        } else {
            disabledSubmitButton.classList.add("disabled-submit-button")
            disabledSubmitButton.disabled = true
        }
    } else {
        disabledSubmitButton.classList.remove("disabled-submit-button")
        disabledSubmitButton.disabled = false
        e.target.classList += " content-changed"
    }
})


$(document).mousemove(function(event) {
    let contentChanged = document.querySelectorAll(".content-changed")
        // console.log(contentChanged.length)
    if (contentChanged.length === 0) {
        disabledSubmitButton.disabled = true;
    } else {
        disabledSubmitButton.removeAttribute("disabled");
        disabledSubmitButton.classList.remove("disabled-submit-button")
    }
});
document.addEventListener("scroll", (e) => {
    let contentChanged = document.querySelectorAll(".content-changed")
        // console.log(contentChanged.length)
    if (contentChanged.length === 0) {
        disabledSubmitButton.disabled = true;
    } else {
        disabledSubmitButton.removeAttribute("disabled");
        disabledSubmitButton.classList.remove("disabled-submit-button")
    }
})