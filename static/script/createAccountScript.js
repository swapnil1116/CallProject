let userType=document.getElementById("userType")
let serviceOption=document.getElementById("serviceOption")
let service=document.getElementById("service")
let serviceDivInput=document.querySelector(".service-div-input")

service.addEventListener("input",(e)=>{
    console.log(e.target.value)
})
userType.addEventListener("input",(e)=>{
    console.log(e.target.value)
    if(e.target.value==="A Business User"){
        serviceDivInput.style.display="block"
    }
    else{
        serviceDivInput.style.display="none"
    }
})

// FOR ERRORS 
let errorCross=document.querySelector(".error-cross");
let nameInput=document.getElementById("name");
errorCross.addEventListener("click",()=>{
    errorCross.parentElement.style.display="none";
    nameInput.focus()
})
// occupation=document.getElementById("occupation")
// serviceOption=document.getElementById("serviceOption")
// service=document.getElementById("service")

// service.addEventListener("input",(e)=>{
//     console.log(e.target.value)
// })
// occupation.addEventListener("input",(e)=>{
//     console.log(e.target.value)
//     if(e.target.value==="A Carrier"){
//         serviceOption.style.display="block"
//     }
//     else{
//         serviceOption.style.display="none"

//     }
// })

// // FOR ERRORS 
// let errorCross=document.querySelector(".error-cross");
// let nameInput=document.getElementById("name");
// errorCross.addEventListener("click",()=>{
//     errorCross.parentElement.style.display="none";
//     nameInput.focus()
// })