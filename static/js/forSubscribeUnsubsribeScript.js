let containingBothOpenAndBookButtons = document.querySelectorAll(".containing-both-open-and-book-buttons")
console.log(containingBothOpenAndBookButtons[3].childNodes[0])

window.addEventListener('load', (event) => {
    for (containingBothOpenAndBookButton of containingBothOpenAndBookButtons) {
        if (containingBothOpenAndBookButton.childNodes.length > 1) {
            containingBothOpenAndBookButton.removeChild(containingBothOpenAndBookButton.childNodes[1])
        }
    }
});