// FOR VISIBILITY OF PASSWORD
function myFunction() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
}
// FOR ERRORS 
let errorCross=document.querySelector(".error-cross");
let mobileNumberInput=document.getElementById("mobileNumber");
errorCross.addEventListener("click",()=>{
    errorCross.parentElement.style.display="none"
    mobileNumberInput.focus()
    
})
