let doEditImages = document.querySelectorAll(".edit-img")
    // console.log(doEditImages)
for (i = 0; i < doEditImages.length; i++) {
    doEditImages[i].addEventListener("click", (e) => {
        console.log(e.target)
        let allInputs = document.querySelectorAll(".inputs-of-profile-page")
        for (i = 0; i < allInputs.length; i++) {
            allInputs[i].disabled = true;
        }
        e.target.previousElementSibling.removeAttribute("disabled");
        e.target.previousElementSibling.focus();
    })
}
let allInputs = document.querySelectorAll(".inputs-of-profile-page")
for (i = 0; i < allInputs.length; i++) {
    allInputs[i].disabled = true;
}
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-img") || e.target.classList.contains("inputs-of-profile-page")) {
        console.log("Edit text")
    } else {
        for (i = 0; i < allInputs.length; i++) {
            if (allInputs[i].classList.contains("content-changed")) {
                allInputs[i].disabled = false;
            } else {
                allInputs[i].disabled = true;
            }
        }
        console.log("cannot edit text")
    }
})
let nameInputValue = document.getElementById("name").value
let addressInputValue = document.getElementById("address").value
let countryInputValue = document.getElementById("country").value
let stateInputValue = document.getElementById("state").value
let cityInputValue = document.getElementById("city").value
let saveButton = document.querySelector(".save-btn")
console.log(`${stateInputValue} =State, ${countryInputValue}= Country Input Value, ${cityInputValue}=City Input Value `)
for (i = 0; i < allInputs.length; i++) {
    allInputs[i].addEventListener("input", (e) => {
        if (e.target.id === "name") {
            if (e.target.value === nameInputValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");

                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }

            }
        } else if (e.target.id === "address") {
            if (e.target.value === addressInputValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        } else if (e.target.id === "country") {
            if (e.target.value === countryInputValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        } else if (e.target.id === "state") {
            if (e.target.value === stateInputValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        } else if (e.target.id === "city") {
            if (e.target.value === cityInputValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
    })
}

let fromTimeInputs = document.querySelectorAll(".from-time input")
let toTimeInputs = document.querySelectorAll(".to-time input")
let entriesInDay = document.querySelectorAll(".entries-in-a-day input")

// FROM TIMING INPUTS
let fromTimeInputMondayValue = document.querySelector("#mon-from").value
let fromTimeInputTuesdayValue = document.querySelector("#tues-from").value
let fromTimeInputWednesdayValue = document.querySelector("#wed-from").value
let fromTimeInputThursdayValue = document.querySelector("#thurs-from").value
let fromTimeInputFridayValue = document.querySelector("#fri-from").value
let fromTimeInputSaturdayValue = document.querySelector("#sat-from").value
let fromTimeInputSundayValue = document.querySelector("#sun-from").value

// TO TIMING INPUTS
let toTimeInputMondayValue = document.querySelector("#mon-to").value
let toTimeInputTuesdayValue = document.querySelector("#tues-to").value
let toTimeInputWednesdayValue = document.querySelector("#wed-to").value
let toTimeInputThursdayValue = document.querySelector("#thurs-to").value
let toTimeInputFridayValue = document.querySelector("#fri-to").value
let toTimeInputSaturdayValue = document.querySelector("#sat-to").value
let toTimeInputSundayValue = document.querySelector("#sun-to").value


for (i = 0; i < fromTimeInputs.length; i++) {
    fromTimeInputs[i].addEventListener("input", (e) => {
        if (e.target.id === "mon-from") {
            if (e.target.value === fromTimeInputMondayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        if (e.target.id == "tues-from") {
            if (e.target.value === fromTimeInputTuesdayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        if (e.target.id == "wed-from") {
            if (e.target.value === fromTimeInputWednesdayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        if (e.target.id == "thurs-from") {
            if (e.target.value === fromTimeInputThursdayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        if (e.target.id == "fri-from") {
            if (e.target.value === fromTimeInputFridayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        if (e.target.id == "sat-from") {
            if (e.target.value === fromTimeInputSaturdayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        if (e.target.id == "sun-from") {
            if (e.target.value === fromTimeInputSundayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }

            }
        }
    })

}
for (i = 0; i < toTimeInputs.length; i++) {
    toTimeInputs[i].addEventListener("input", (e) => {
        if (e.target.id == "mon-to") {
            if (e.target.value === toTimeInputMondayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        if (e.target.id == "tues-to") {
            if (e.target.value === toTimeInputTuesdayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        if (e.target.id == "wed-to") {
            if (e.target.value === toTimeInputWednesdayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        if (e.target.id == "thurs-to") {
            if (e.target.value === toTimeInputThursdayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        if (e.target.id == "fri-to") {
            if (e.target.value === toTimeInputFridayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        if (e.target.id == "sat-to") {
            if (e.target.value === toTimeInputSaturdayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        if (e.target.id == "sun-to") {
            if (e.target.value === toTimeInputSundayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }

            }
        }
    })
}

// FOR ENTRIES
let entriesInputMondayValue = document.querySelector("#entryMon").value
let entriesInputTuesdayValue = document.querySelector("#entryTues").value
let entriesInputWednesdayValue = document.querySelector("#entryWed").value
let entriesInputThursdayValue = document.querySelector("#entryThurs").value
let entriesInputFridayValue = document.querySelector("#entryFri").value
let entriesInputSaturdayValue = document.querySelector("#entrySat").value
let entriesInputSundayValue = document.querySelector("#entrySun").value
for (i = 0; i < entriesInDay.length; i++) {
    entriesInDay[i].addEventListener("input", (e) => {
        if (e.target.id == "entryMon") {
            if (e.target.value === entriesInputMondayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }

        if (e.target.id == "entryTues") {

            if (e.target.value === entriesInputTuesdayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }

            }
        }
        if (e.target.id == "entryWed") {

            if (e.target.value === entriesInputWednesdayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }

            }
        }
        if (e.target.id == "entryThurs") {

            if (e.target.value === entriesInputThursdayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }

            }
        }
        if (e.target.id == "entryFri") {

            if (e.target.value === entriesInputFridayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }

            }
        }
        if (e.target.id == "entrySat") {

            if (e.target.value === entriesInputSaturdayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }

            }
        }
        if (e.target.id == "entrySun") {

            if (e.target.value === entriesInputSundayValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }

            }
        }
    })
}

let inputOfServiceInServiceSection = document.querySelectorAll(".input-of-service-in-service-section input")
let inputOfDurationInServiceSection = document.querySelectorAll(".input-of-duration-in-service-section input")

// FOR SERVICES 
let service1Value = document.querySelector("#service1").value;
let service2Value = document.querySelector("#service2").value;
let service3Value = document.querySelector("#service3").value;

for (i = 0; i < inputOfServiceInServiceSection.length; i++) {
    inputOfServiceInServiceSection[i].addEventListener("input", (e) => {
        if (e.target.id == "service1") {
            if (e.target.value === service1Value) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        if (e.target.id == "service2") {
            if (e.target.value === service2Value) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        if (e.target.id == "service3") {
            if (e.target.value === service3Value) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
    })
}

// FOR DURATION 
let duration1Value = document.querySelector("#duration1").value;
let duration2Value = document.querySelector("#duration2").value;
let duration3Value = document.querySelector("#duration3").value;
for (i = 0; i < inputOfDurationInServiceSection.length; i++) {
    inputOfDurationInServiceSection[i].addEventListener("input", (e) => {
        if (e.target.id == "duration1") {
            if (e.target.value === duration1Value) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        if (e.target.id == "duration2") {
            if (e.target.value === duration1Value) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        if (e.target.id == "duration3") {
            if (e.target.value === duration3Value) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
    })
}

let selectForParkingTypeInBusinessProfile = document.querySelector("#select-for-parkingType-in-businessProfile");
let selectForParkingTypeInBusinessProfileValue = document.querySelector("#select-for-parkingType-in-businessProfile").value;
let costOfParkingInBusinessProfile = document.querySelectorAll(".costOfParking-in-businessProfile");

let costOfParking1InBusinessProfileValue = document.querySelector("#costOfParking1-in-businessProfile").value;
let costOfParking2InBusinessProfileValue = document.querySelector("#costOfParking2-in-businessProfile").value;

// SELECT PARKING TYPE
selectForParkingTypeInBusinessProfile.addEventListener("input", (e) => {
    if (e.target.value === selectForParkingTypeInBusinessProfileValue) {
        console.log(selectForParkingTypeInBusinessProfile.value)
        saveButton.disabled = true;
        e.target.classList.remove("content-changed");
    } else {
        console.log(selectForParkingTypeInBusinessProfile.value)
        if (e.target.classList.contains("content-changed")) {
            saveButton.removeAttribute("disabled");
        } else {
            e.target.classList += " content-changed"
            e.target.removeAttribute("disabled")
            saveButton.removeAttribute("disabled");
        }
    }
})

// PARKING COST FOR 2-WHEELER AND 4-WHEELER
for (i = 0; i < costOfParkingInBusinessProfile.length; i++) {
    costOfParkingInBusinessProfile[i].addEventListener(("input"), (e) => {
        if (e.target.id === "costOfParking1-in-businessProfile") {
            if (e.target.value === costOfParking1InBusinessProfileValue) {
                console.log(costOfParking1InBusinessProfileValue)
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                console.log(costOfParking1InBusinessProfileValue)
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
        if (e.target.id === "costOfParking2-in-businessProfile") {
            if (e.target.value === costOfParking2InBusinessProfileValue) {
                saveButton.disabled = true;
                e.target.classList.remove("content-changed");
            } else {
                if (e.target.classList.contains("content-changed")) {
                    saveButton.removeAttribute("disabled");
                } else {
                    e.target.classList += " content-changed"
                    e.target.removeAttribute("disabled")
                    saveButton.removeAttribute("disabled");
                }
            }
        }
    })
}

// INPUT PARKING CAPACITY
let parkingCapacityNumberInBusinessProfile = document.querySelector("#parkingCapacityNumber-in-businessProfile");
let parkingCapacityNumberInBusinessProfileValue = document.querySelector("#parkingCapacityNumber-in-businessProfile").value;
parkingCapacityNumberInBusinessProfile.addEventListener("input", (e) => {
    if (e.target.value === parkingCapacityNumberInBusinessProfileValue) {
        saveButton.disabled = true;
        e.target.classList.remove("content-changed");
    } else {
        if (e.target.classList.contains("content-changed")) {
            saveButton.removeAttribute("disabled");
        } else {
            e.target.classList += " content-changed"
            e.target.removeAttribute("disabled")
            saveButton.removeAttribute("disabled");
        }
    }
})


// SCRIPT FOR SECTION OF MANAGING MEMBERS AND PERMISSIONS
let outermost1 = document.querySelector("#outermost1")
let sectionForManagingMembership = document.querySelector(".section-for-managing-membership")
let crossToHideMembershipSection = document.querySelector("#crossToHideMembershipSection")
let buttonToMakeManagingMembershipSectionVisible = document.querySelector(".button-to-make-managing-membership-section-visible")
    // PERMISSION SECTION'S VARIABLES
let buttonToMakeManagingPermissionSectionVisible = document.querySelector(".button-to-make-managing-permission-section-visible")
let sectionForManagingPermission = document.querySelector(".section-for-managing-permissions")
let crossToHidePermissionSection = document.querySelector("#crossToHidePermissionSection")
let acceptMembershipRequestSecurity = document.querySelector(".acceptMembershipRequestSecurity")

// SECURITY GUARD SECTION'S VARIABLES
let buttonToMakeManagingSecurityGuardSectionVisible = document.querySelector(".button-to-make-managing-security-guard-section-visible")
let sectionForManagingSecurityGuard = document.querySelector(".section-for-managing-security-guard")
let crossToHideSecurityGuardSection = document.querySelector("#crossToHideSecurityGuardSection")

buttonToMakeManagingMembershipSectionVisible.addEventListener("click", () => {
    functionToToggleViewOfSection(buttonToMakeManagingMembershipSectionVisible, crossToHideMembershipSection, sectionForManagingMembership);
})
buttonToMakeManagingPermissionSectionVisible.addEventListener("click", () => {
    functionToToggleViewOfSection(buttonToMakeManagingPermissionSectionVisible, crossToHidePermissionSection, sectionForManagingPermission);
})
buttonToMakeManagingSecurityGuardSectionVisible.addEventListener("click", () => {
    functionToToggleViewOfSection(buttonToMakeManagingSecurityGuardSectionVisible, crossToHideSecurityGuardSection, sectionForManagingSecurityGuard);
})

function functionToToggleViewOfSection(classOfButtonToMakeSectionVisible, classOfCrossButton, sectionToMakeVisible) {
    console.log("Click on the button" + classOfButtonToMakeSectionVisible)
    sectionToMakeVisible.classList += " now-visible"
    outermost1.classList += " shadowing"
    document.body.classList += " no-scrolling"
    outermost1.addEventListener("click", (e) => {
        // $(".section-for-managing-membership").removeClass("now-visible");
        sectionToMakeVisible.classList.remove("now-visible");
        $("#outermost1").removeClass("shadowing")
        $(document.body).removeClass("no-scrolling")
    })

    classOfCrossButton.addEventListener("click", () => {
        // $(".section-for-managing-membership").removeClass("now-visible");
        sectionToMakeVisible.classList.remove("now-visible");
        $("#outermost1").removeClass("shadowing")
        $(document.body).removeClass("no-scrolling")
    })
}

// AJAX FOR ACCEPTING AND CANCELLING SUBSCRIPTION
$(".acceptMembershipRequestSecurity").click(function(e) {
    e.preventDefault();
    let href = $(this).attr('href');
    $(this).remove();
    console.log('href')
    console.log(href)
    $.get(href, function(data, status) {
        console.log('data by accepting')
        console.log(data)
    });
});
$(".cancelMembershipRequestSecurity").click(function(e) {
    e.preventDefault();
    let href = $(this).attr('href');
    console.log('href')
    console.log(href)
    $(this).remove();
    $.get(href, function(data, status) {
        console.log('data')
        console.log(data)
    });
});

$(".anchor-tag-for-only-permission-search").click(function(e) {
    e.preventDefault();
    let href = $(this).closest('form').attr('action')
    console.log('href')
    console.log(href)
    let userSearch = $("#permission-input-search").val()

    console.log(userSearch)
    $.post(href, {
        userSearch: userSearch
    }, function(data, status) {
        console.log('data')
        console.log(data)
        let url = window.location.href
        let businessCalendarId = url.split("/")[4]
        console.log(businessCalendarId)

        if (data.length == 0) {
            console.log("In side data length 0")
            $(".div-to-display-found-users").css("display", "none")
            $("#no-users-with-this-info-in-permission-management").css("display", "block")
            $("#no-users-with-this-info-in-permission-management").text("No Users Found With This Information")
        } else {
            $(".div-to-display-found-users").css("display", "block")
            $("#no-users-with-this-info-in-permission-management").css("display", "none")
            let userContentInsideDiv = ""
            for (foundUser of data) {
                userContentInsideDiv += `<p class="found-user-name">Name: ${foundUser.name}</p>
                    <p class="found-user-number">Mobile No.: ${foundUser.number}</p>
                    <p class="found-user-email">Email: ${foundUser.email}</p>`
                if (foundUser.permissionType == "No") {
                    userContentInsideDiv += ` <a href="/givePermission/${businessCalendarId}/${foundUser._id}" class="anchor-tag-for-giving-permission">Give Permission</a>`
                } else if (foundUser.permissionType == "Yes") {
                    userContentInsideDiv += `<p class="permission-allowed already-have-permission">User Already Have Permissions!</p>`
                } else if (foundUser.permissionType == "User") {
                    userContentInsideDiv += `<p class="permission-allowed already-have-permission">This is Your Calendar!!</p>`
                }
            }
            if (userContentInsideDiv) {
                let divToBeInsertedAfterSearch = `
                    <div class='div-to-display-found-users'> 
                    ${userContentInsideDiv}
                    </div>
                    `
                if ($('.div-to-display-found-users').length != 0) {
                    $('.div-to-display-found-users').remove();
                }
                $(".section-for-managing-permissions").append(divToBeInsertedAfterSearch)

                console.log('divToBeInsertedAfterSearch')
                console.log(divToBeInsertedAfterSearch)
            }
        }
        console.log(status)
    });
});

$(".anchor-tag-for-only-guard-search").click(function(e) {
    e.preventDefault();
    let href = $(this).closest('form').attr('action')
    console.log('href')
    console.log(href)
    let guardSearch = $("#guard-input-search").val()

    console.log(guardSearch)
    $.get(href, {
        guardSearch: guardSearch
    }, function(data, status) {
        console.log('data')
        console.log(data)
        let url = window.location.href
        let businessCalendarId = url.split("/")[4]
        console.log(businessCalendarId)

        if (data.length == 0) {
            console.log("In side data length 0")
            $(".div-to-display-found-users").css("display", "none")
            $("#no-users-with-this-info-in-permission-management").css("display", "block")
            $("#no-users-with-this-info-in-permission-management").text("No Users Found With This Information")
        } else {
            $(".div-to-display-found-users").css("display", "block")
            $("#no-users-with-this-info-in-permission-management").css("display", "none")
            let userContentInsideDiv = ""
            for (foundUser of data) {
                userContentInsideDiv += `<p class="found-user-name">Name: ${foundUser.name}</p>
                    <p class="found-user-number">Mobile No.: ${foundUser.number}</p>
                    <p class="found-user-email">Email: ${foundUser.email}</p>`
                if (foundUser.permissionType == "No") {
                    userContentInsideDiv += ` <a href="/giveSecurityGuardPermission/${businessCalendarId}/${foundUser._id}" class="anchor-tag-for-giving-permission">Give Permission</a>`
                } else if (foundUser.permissionType == "Yes") {
                    userContentInsideDiv += `<p class="permission-allowed already-have-permission">User Already Have Permissions!</p>`
                } else if (foundUser.permissionType == "User") {
                    userContentInsideDiv += `<p class="permission-allowed already-have-permission">This is Your Calendar!!</p>`
                }
            }
            if (userContentInsideDiv) {
                let divToBeInsertedAfterSearch = `
                    <div class='div-to-display-found-users'> 
                    ${userContentInsideDiv}
                    </div>
                    `
                if ($('.div-to-display-found-users').length != 0) {
                    $('.div-to-display-found-users').remove();
                }
                $(".section-for-managing-security-guard").append(divToBeInsertedAfterSearch)

                console.log('divToBeInsertedAfterSearch')
                console.log(divToBeInsertedAfterSearch)
            }
        }
        console.log(status)
    });
});

//2  AJAX FUNCTIONS TILL ABOVE


$(document).mousemove(function(event) {
    let contentChanged = document.querySelectorAll(".content-changed")
        // console.log(contentChanged.length)
    if (contentChanged.length === 0) {
        saveButton.disabled = true;
    } else {
        saveButton.removeAttribute("disabled");
    }
});
document.addEventListener("scroll", (e) => {
    let contentChanged = document.querySelectorAll(".content-changed")
        // console.log(contentChanged.length)
    if (contentChanged.length === 0) {
        saveButton.disabled = true;
    } else {
        saveButton.removeAttribute("disabled");
    }
})