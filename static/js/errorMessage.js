// FOR ERRORS 
let errorCross=document.querySelector(".error-cross");
let nameInput=document.getElementById("name");
errorCross.addEventListener("click",()=>{
    errorCross.parentElement.style.display="none"
    nameInput.focus()
    
})
