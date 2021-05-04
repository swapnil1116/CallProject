let securityForm = document.querySelector(".security-form")
let formAction = securityForm.action
idOfSecurityCalendar = formAction.split("/")[5]
console.log('securityForm.action')
console.log(idOfSecurityCalendar)
$(function() {
    let userData = null
    $('#contactNumberOfVisitor').autocomplete({
        source: function(req, res) {
            $.ajax({
                url: "/searchVisitorInEntryForm",
                dataType: "jsonp",
                type: "GET",
                data: req,
                success: function(data) {
                    res(data)
                    userData = data
                },
                error: function(err) {
                    console.log(err)
                }
            })
        },
        minLength: 1,
        select: function(event, ui) {
            if (ui.item) {
                console.log("userData")
                console.log(userData)
                console.log(ui.item)
                $("#contactNumberOfVisitor").text(ui.item.label)
                $("#name-of-visitor").val(ui.item.name)
                $("#from-location").val(ui.item.address)
            }
        }
    })
    $("#houseNumberVisitingTo").autocomplete({
        source: function(req, res) {
            $.ajax({
                url: `/searchHostPersonInEntryForm/${idOfSecurityCalendar}`,
                dataType: "jsonp",
                type: "GET",
                data: req,
                success: function(data) {
                    res(data)
                    visitingTo = data
                },
                error: function(err) {
                    console.log(err)
                }
            })
        },
        minLength: 1,
        select: function(event, ui) {
            if (ui.item) {
                console.log("userData")
                console.log(userData)
                console.log(ui.item)
                $("#houseNumberVisitingTo").text(ui.item.label)
                $("#visiting-to").val(ui.item.name)
                $("#contactNumberVisitingTo").val(ui.item.number)
            }
        }
    })
})