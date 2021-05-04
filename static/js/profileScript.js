let doEditImages=document.querySelectorAll(".edit-img")
console.log(doEditImages)
for(i=0;i<doEditImages.length;i++){
    doEditImages[i].addEventListener("click",(e)=>{
        console.log(e.target)
        let allInputs=document.querySelectorAll(".inputs-of-profile-page")
        for(i=0;i<allInputs.length;i++){
            allInputs[i].disabled=true;
        }
        e.target.previousElementSibling.removeAttribute("disabled");
        e.target.previousElementSibling.focus();
    })
}
let allInputs=document.querySelectorAll(".inputs-of-profile-page")
for(i=0;i<allInputs.length;i++){
    allInputs[i].disabled=true;
}
document.addEventListener("click",(e)=>{
    if(e.target.classList.contains("edit-img") || e.target.classList.contains("inputs-of-profile-page")){
        console.log("Edit text")
    }
    else{
        for(i=0;i<allInputs.length;i++){
            if(allInputs[i].classList.contains("content-changed") || allInputs[i].classList.contains("content-changed-in-mobile")){
                allInputs[i].disabled=false;
            }
            else{
                allInputs[i].disabled=true;
            }
        }
        console.log("cannot edit text")
    }
})
let nameInputValue=document.getElementById("name").value
let emailInputValue=document.getElementById("email").value
let phoneInputValue=document.getElementById("phone").value
let addressInputValue=document.getElementById("address").value
let dobInputValue=document.getElementById("dob").value
let genderInputValue=document.getElementById("gender").value

let saveButton=document.querySelector(".save-btn")
let verifyButtonPhone=document.querySelector("#verify-button-enabled-phone")
let verifyButtonEmail=document.querySelector("#verify-button-enabled-email")
for(i=0;i<allInputs.length;i++){
    // console.log(allInputs[i].value);

    allInputs[i].addEventListener("input",(e)=>{
        if(e.target.id==="name"){
            if(e.target.value===nameInputValue){
                saveButton.disabled=true;
                e.target.classList.remove("content-changed");
            }
            else{
                if(e.target.classList.contains("content-changed")){
                    saveButton.removeAttribute("disabled");

                }
                else{
                    e.target.classList+=" content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }

            }
        }
        else if(e.target.id==="email"){
            if(e.target.value===emailInputValue){
                saveButton.disabled=true;
                verifyButtonEmail.classList.add("verify-anchor-tag-disabled");
                e.target.classList.remove("content-changed-in-mobile");
            }
            else{
                if(e.target.classList.contains("content-changed-in-mobile")){
                    verifyButtonEmail.href =`/verifyNewEmailAddress/${e.target.value}`
                    verifyButtonEmail.classList.remove("verify-anchor-tag-disabled");
                }
                else{
                    e.target.classList+=" content-changed-in-mobile"
                    e.target.removeAttribute("disabled");
                    verifyButtonEmail.href = `/verifyNewEmailAddress/${e.target.value}`
                    verifyButtonEmail.classList.remove("verify-anchor-tag-disabled");
                }
            }
        }
        else if(e.target.id==="phone"){
            if(e.target.value===phoneInputValue){
                saveButton.disabled=true;
                verifyButtonPhone.classList.add("verify-anchor-tag-disabled");
                e.target.classList.remove("content-changed-in-mobile")
            }
            else if((e.target.value).length===10){
                console.log("length is 10")
                if(e.target.classList.contains("content-changed-in-mobile" )){
                    verifyButtonPhone.href =`/verifyNewMobileNumber/${e.target.value}`
                    verifyButtonPhone.classList.remove("verify-anchor-tag-disabled");
                }
                else{
                    e.target.classList+=" content-changed-in-mobile";
                    e.target.removeAttribute("disabled");
                    verifyButtonPhone.href = `/verifyNewMobileNumber/${e.target.value}`
                    verifyButtonPhone.classList.remove("verify-anchor-tag-disabled");
                }
            }
            else if((e.target.value).length>10 || (e.target.value).length<10){
                console.log("length is not 10")
                saveButton.disabled=true;
                console.log(e.target.value)
                e.target.classList+=" content-changed-in-mobile";
                e.target.removeAttribute("disabled");
                verifyButtonPhone.classList.add("verify-anchor-tag-disabled");
            }
        }
        else if(e.target.id==="address"){
            if(e.target.value===addressInputValue){
                saveButton.disabled=true;
            }
            else{
                if(e.target.classList.contains("content-changed")){
                    saveButton.removeAttribute("disabled");
                }
                else{
                    e.target.classList+=" content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        else if(e.target.id==="dob"){
            if(e.target.value===dobInputValue){
                saveButton.disabled=true;
            }
            else{
                if(e.target.classList.contains("content-changed")){
                    saveButton.removeAttribute("disabled");
                }
                else{
                    e.target.classList+=" content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        else if(e.target.id==="gender"){
            if(e.target.value===genderInputValue){
                saveButton.disabled=true;
            }
            else{
                if(e.target.classList.contains("content-changed")){
                    saveButton.removeAttribute("disabled");
                }
                else{
                    e.target.classList+=" content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
    })
}

$(document).mousemove(function(event){
    let contentChanged = document.querySelectorAll(".content-changed")
    // console.log(contentChanged.length)
    if(contentChanged.length === 0 ){
        saveButton.disabled = true;
    }
    else{
        saveButton.removeAttribute("disabled");
    }
});
document.addEventListener("scroll",(e)=>{
    let contentChanged = document.querySelectorAll(".content-changed")
    // console.log(contentChanged.length)
    if(contentChanged.length === 0 ){
        saveButton.disabled = true;
    }
    else{
        saveButton.removeAttribute("disabled");
    }
})