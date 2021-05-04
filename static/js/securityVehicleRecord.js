let pageURLForSecurityVehicleRecord = $(location).attr("href");
console.log(pageURLForSecurityVehicleRecord)
let splittedURLForSecurityVehicleRecord=pageURLForSecurityVehicleRecord.split("/")
let idOfCalendarForSecurityVehicleRecord=splittedURLForSecurityVehicleRecord[5]
let dateForSecurityVehicleRecord=splittedURLForSecurityVehicleRecord[6]
let entryForm="entryForm"
console.log(idOfCalendarForSecurityVehicleRecord)
console.log(dateForSecurityVehicleRecord)
let anchorTagForVehicleEntryForm=document.querySelector("#anchor-tag-for-entry-form")
console.log(anchorTagForVehicleEntryForm)
anchorTagForVehicleEntryForm.href=`/businessCalendar/gateKeeper/${idOfCalendarForSecurityVehicleRecord}/${dateForSecurityVehicleRecord}/${entryForm}`