// FOR ERRORS 
let errorCross=document.querySelectorAll(".error-cross");
let otpInput=document.getElementById("otp");
for(let i=0;i<errorCross.length;i++){
    errorCross[i].addEventListener("click",()=>{
        errorCross[i].parentElement.remove()
        otpInput.focus()
    })
}
