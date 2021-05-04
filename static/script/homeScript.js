function showContactFormFunction(x) {
    $(".floating-contact-for-section").toggleClass("visible-contact-form");
    $("#outermost2").toggleClass("shadowing")
    $(document.body).toggleClass("no-scrolling")
}
outermost2 = document.getElementById("outermost2")
outermost2.addEventListener("click", (e) => {
    $(".floating-contact-for-section").toggleClass("visible-contact-form");
    $("#outermost2").toggleClass("shadowing")
    $(document.body).toggleClass("no-scrolling")
})
crossToHideFloatingForm = document.getElementById("cross-to-hide-floating-form")
crossToHideFloatingForm.addEventListener("click", (e) => {
    $(".floating-contact-for-section").toggleClass("visible-contact-form");
    $("#outermost2").toggleClass("shadowing")
    $(document.body).toggleClass("no-scrolling")
})