let allStrips = document.querySelectorAll(".total-number-of-events-on-the-date")
console.log(allStrips)
for (i of allStrips) {
    if (i.innerText == "0") {
        i.style.display = "none"
    } else {
        i.style.display = "block"
    }
}