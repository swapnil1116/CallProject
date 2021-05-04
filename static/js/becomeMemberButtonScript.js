$(".become-member-button").click((e) => {
    console.log('e.target')
    console.log(e.target.nextElementSibling)
    if (e.target.nextElementSibling.classList.contains("displaying-input-of-house-number")) {
        e.target.nextElementSibling.classList.remove("displaying-input-of-house-number")
    } else {
        e.target.nextElementSibling.classList += " displaying-input-of-house-number"
        e.target.nextElementSibling.children[0].focus()
    }
})


$(document).click((e) => {
    let divForInputOfHouseNumber = document.querySelectorAll(".displaying-input-of-house-number")
    if (e.target.classList.contains("become-member-button") || e.target.classList.contains("displaying-input-of-house-number") || e.target.classList.contains("input-tag-for-house-number") || e.target.classList.contains("submit-button-for-house-number-and-membership")) {

    } else {
        if (divForInputOfHouseNumber != null || divForInputOfHouseNumber != undefined || divForInputOfHouseNumber.length != 0) {
            console.log("Sorted kr diya gya hai")
            $(".displaying-input-of-house-number").removeClass("displaying-input-of-house-number")
        } else {
            console.log("Sorted hai")
        }
    }
})