function showContactFormForReminderFunction(x) {
inputDateInFloatingForm=document.querySelector("#date")
console.log(x.parentElement.parentElement.parentElement.children[1].innerText)
monthName=document.querySelector(".date h1")
nameOfVendorInForm=document.querySelector(".heading-in-appointment-form h1 span")
nameOfVendorInForm.innerText=x.parentElement.parentElement.parentElement.children[1].innerText
dateClicked=document.querySelector(".clicked")
$(".reminder-form").toggleClass("visible-contact-form");
$("#outermost2").toggleClass("shadowing")
$(document.body).toggleClass("no-scrolling")
}
  // TO HIDE THE FLOATING FORM
outermost2=document.getElementById("outermost2")
outermost2.addEventListener("click",(e)=>{
    $(".floating-contact-for-section").removeClass("visible-contact-form");
    $("#outermost2").toggleClass("shadowing")
    $(document.body).toggleClass("no-scrolling")
})
crossToHideFloatingReminderForm=document.querySelector(".cross-in-reminder-form")
crossToHideFloatingReminderForm.addEventListener("click",(e)=>{
    $(".reminder-form").toggleClass("visible-contact-form");
    $("#outermost2").toggleClass("shadowing")
    $(document.body).toggleClass("no-scrolling")
})
crossToHideFloatingEventForm=document.querySelector(".cross-in-event-form")
crossToHideFloatingEventForm.addEventListener("click",(e)=>{
    $(".event-form").toggleClass("visible-contact-form");
    $("#outermost2").toggleClass("shadowing")
    $(document.body).toggleClass("no-scrolling")
})


function initMap(){
    var options={
        zoom:12,
        center:{lat:18.5204 , lng:73.8567}
    }
    var map = new google.maps.Map( document.getElementById('map'), options);
    addMarker({lat:18.5204 , lng:73.8567})
    addMarker({lat:18.55, lng:73.9})
    //ADD MARKERS FUNCTIONS
    function addMarker(coords){
        var marker = new google.maps.Marker({
            position: coords, 
            map: map
        });
    }
}