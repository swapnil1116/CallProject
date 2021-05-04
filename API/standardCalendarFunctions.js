const { calendar } = require('googleapis/build/src/apis/calendar');
const mongoose = require('mongoose');
const sharp = require('sharp');
const allCalendarModel = require('../models/allCalendarModel');
const privateCalendarModel = require('../models/privateCalendarModel');
const standardCalendarModel = require('../models/standardCalendarModel');
const userModel = require('../models/userModel');
const timeManipulation = require('./helpers/timeManipulation');
// async function addScheduleintoStandardCalendar(req, date, callback) {
//     await allCalendarModel.findOne({ _id: req.params.calenderId }, async(err, foundCalendar) => {
//         if (err) {
//             console.log(err)
//             console.log("Not Found Calendar")
//         } else {
//             console.log(foundCalendar.userId + " this is user id")
//             var calendar = await standardCalendarModel.findOne({
//                 userId: foundCalendar.userId,
//                 'dailyAppointments.date': date
//             }).select('dailyAppointments.$');
//             console.log(calendar)
//             var appointments = {};
//             req.body.requester = req.user.name;
//             for (element in req.body) {
//                 appointments[element] = req.body[element];
//             }
//             appointments.dateOfAppointment = date;
//             appointments.requesterUserId = req.user._id;

//             // FOR REDUCING SIZE OF IMAGE AND MAKING IT PREVIEW IMAGE
//             let imageNameForSharp = (((req.body.documentImageInScheduleOrAppointment).replace(".jpg","")).replace(".png","")).replace(".jpeg","")
//             console.log('imageNameForSharp')
//             console.log(imageNameForSharp)
//             sharp(`${req.body.documentImageInScheduleOrAppointment}`).resize(640,480) 
//             .jpeg({quality : 80}).toFile(`${imageNameForSharp}_preview.jpg`); 
//             appointments.documentImageInScheduleOrAppointment = `${imageNameForSharp}_preview.jpg`
            
//             console.log(calendar + " this is calendar");
//             if (calendar) {
//                 console.log("Going For Push Function")
//                 pushScheduleintoPersonalCalendar({
//                     "userId": foundCalendar.userId,
//                     "scheduleId": calendar.dailyAppointments[0].id,
//                     "appointments": appointments
//                 }, callback);
//             } else {
//                 standardCalendarModel.findOne({
//                     userId: foundCalendar.userId,
//                 }).then((standardCalendar) => {
//                     if (standardCalendar) {
//                         var endTimeOfbefore = timeManipulation.decreaseByaMin(req.body.start);
//                         var startTimeOfAfter = timeManipulation.increaseByaMin(req.body.end);
//                         var dailyAppointment = {
//                             date: date,
//                             appointments: [appointments],
//                             freeTime: [{
//                                 start: "00:00",
//                                 end: endTimeOfbefore
//                             }, {
//                                 start: startTimeOfAfter,
//                                 end: "23:59"
//                             }]
//                         }
//                         standardCalendar.dailyAppointments.push(dailyAppointment);
//                         standardCalendar.save();
//                         callback(null, {
//                             msg: "successfully added"
//                         });
//                     } else {
//                         callback(new Error("no Standard Business Calendar found!!"), null);
//                     }
//                 }).catch((err) => {
//                     console.log(err);
//                     callback(err, null);
//                 });
//             }

//         }
//     })
// }


async function removeScheduleintoPersonalCalendar(req, callback) {
    // const query = 'dailySchedule.$.schedule.' + req.body.timeSlot;
    personalCalendarModel.updateOne({
            userId: req.user.id,
            'dailySchedule': {
                $elemMatch: {
                    _id: req.body.scheduleId
                }
            }
        }, {

        },
        async(err, doc) => {
            if (!err) {
                console.log(doc);
                if (doc.ok == 1) {
                    var calendar = await personalCalendarModel.findOne({
                        userId: req.user.id
                    });
                    var dailySchedule = await calendar.dailySchedule.id(req.body.scheduleId);
                    if (dailySchedule.availableSlots.length == 24) {
                        await calendar.dailySchedule.id(req.body.scheduleId).remove();
                    }
                    calendar.save();
                    callback(null, {
                        msg: "successfully changed"
                    });
                } else {
                    callback(new Error('error while changing!'), null);
                }
            } else {
                callback(err, null);
            }
        });

}

// async function editScheduleintoPersonalCalendar(req, callback) {
//     pushScheduleintoPersonalCalendar({
//         "userId": req.user.id,
//         "scheduleId": req.body.scheduleId,
//         "timeSlot": req.body.timeSlot,
//         "schedule": req.body.schedule
//     }, callback);
// }

async function getScheduleofaDate(req, callback) {
    var calendar = await standardCalendarModel.findOne({
        'allCalendarId': req.params.idOfStandardCalendar,
        'dailyAppointments.date': req.params.date
    }).select('dailyAppointments.$');
    if (calendar) {
        let dailyAppointment = calendar.dailyAppointments[0];
        if (dailyAppointment) {
            callback(null, dailyAppointment);
        } else {
            callback(new Error("no events on this date found", null))
        }
    } else {
        callback(new Error("no events on this date found", null))
    }
}

async function getSchedule(req, callback) {
    var calendar = await standardCalendarModel.findOne({
        'userId': req.user.id
    }).select('dailyAppointments');
    if (calendar) {
        let today = new Date();
        let hour = today.getHours();
        let min = today.getMinutes();
        let appointments = [];
        let todayDate = today.getDate() + "-" + today.getMonth() + "-" + today.getFullYear();
        for (element of calendar.dailyAppointments) {

            let appointment = [];
            var i = 0;
            if (element.date == todayDate) {
                for (el in element.appointments) {
                    if (i >= 3) {
                        break;
                    }
                    var start = el.start.split(':');
                    if (parseInt(start[0]) >= hour && parseInt(start[1]) > min) {
                        appointment.push(el.heading);
                        i = i + 1;
                    }
                }
            } else {
                for (el of element.appointments) {
                    if (i >= 3) {
                        break;
                    } else {
                        appointment.push(el.heading);
                        i = i + 1;
                    }
                }
            }
            appointments.push({
                date: element.date,
                appointment: schedule,
                count: element.appointments.length
            });
        }
        if (appointments.length > 0) {
            callback(null, appointments);
        } else {
            callback(new Error("no Appointments found!!"), null)
        }
    } else {
        callback(new Error("no calendar found!!"), null);
    }
}

async function addAppointmentRequestInStandardCalendar(req, date, businessFound, uniqueIdForAppointment, callback) {
    standardCalendarModel.findOne({ userId: businessFound.userId, 'dailyAppointments.date': date }, async(err, businessCalendarFound) => {
        let dailyAppointmentsFromDatabase = await standardCalendarModel.findOne({
            userId: businessFound.userId,
            'dailyAppointments.date': date
        }).select('dailyAppointments.$');
        console.log(dailyAppointmentsFromDatabase)
        let appointments = {}
        for (element in req.body) {
            appointments[element] = req.body[element];
        }
        appointments.requester = req.user.name;
        appointments.requesterMobileNumber = req.user.number;
        appointments.requesterUserId = req.user._id;
        appointments.dateOfAppointment = date;
        appointments.appointmentApproved = "pending";
        appointments._id = uniqueIdForAppointment;
        console.log(appointments)

        // FOR REDUCING SIZE OF IMAGE AND MAKING IT PREVIEW IMAGE
        let imageNameForSharp = (((req.body.documentImageInScheduleOrAppointment).replace(".jpg","")).replace(".png","")).replace(".jpeg","")
        console.log('imageNameForSharp')
        console.log(imageNameForSharp)
        sharp(`${req.body.documentImageInScheduleOrAppointment}`).resize(640,480) 
        .jpeg({quality : 80}).toFile(`${imageNameForSharp}_preview.jpg`); 
        appointments.documentImageInScheduleOrAppointment = `${imageNameForSharp}_preview.jpg`

        if (!businessCalendarFound) {
            standardCalendarModel.findOne({ userId: businessFound.userId }, (err, standardCalendarToAddNewUnapprovedAppointment) => {
                console.log(standardCalendarToAddNewUnapprovedAppointment)
                let endTimeOfbefore = timeManipulation.decreaseByaMin(req.body.start);
                let startTimeOfAfter = timeManipulation.increaseByaMin(req.body.end);
                let dailyAppointment = {
                    date: date,
                    appointments: [appointments],
                    freeTime: [{
                        start: "00:00",
                        end: endTimeOfbefore
                    }, {
                        start: startTimeOfAfter,
                        end: "23:59"
                    }],
                    pendingAppointmentList: [appointments._id]
                }
                console.log("this is i want")
                standardCalendarToAddNewUnapprovedAppointment.dailyAppointments.push(dailyAppointment)
                standardCalendarToAddNewUnapprovedAppointment.save(function(err, savingObject) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(savingObject)
                    }
                });
            })
        } else {
            standardCalendarModel.findOne({ userId: businessFound.userId, 'dailyAppointments.date': date }, (err, businessCalendarFoundAgain) => {
                console.log("Date Already Have One  Appointment.")
                for (let i = 0; i < businessCalendarFoundAgain.dailyAppointments.length; i++) {
                    if (businessCalendarFoundAgain.dailyAppointments[i].date === date) {
                        console.log(businessCalendarFoundAgain.dailyAppointments[i])
                        standardCalendarModel.updateOne({
                                userId: businessCalendarFound.userId,
                                'dailyAppointments': {
                                    '$elemMatch': {
                                        '_id': dailyAppointmentsFromDatabase.dailyAppointments[0].id
                                    }
                                }
                            }, {
                                '$set': {
                                    "dailyAppointments.$.freeTime": timeManipulation.calculateFreeTimeList(dailyAppointmentsFromDatabase.dailyAppointments[0].freeTime, appointments.start, appointments.end)
                                },
                                '$push': {
                                    'dailyAppointments.$.appointments': appointments
                                },
                                '$addToSet': {
                                    'dailyAppointments.$.pendingAppointmentList': appointments._id
                                }
                            },
                            (err, doc) => {
                                if (!err) {
                                    // console.log(doc);
                                    if (doc.ok == 1) {
                                        console.log("successfully added")
                                    } else {
                                        console.log('error while adding!')
                                    }
                                } else {
                                    console.log(err)
                                }
                            });
                    }
                }

            })

        }
    })
}


async function acceptAppointmentFunction(req, userIdOfTheBusinessCalendar, callback) {
    let allAppointmentsOfParticularDate = await standardCalendarModel.findOne({
        'userId': userIdOfTheBusinessCalendar,
        'dailyAppointments.date': req.params.dateOfAppointment
    }).select('dailyAppointments.$');

    let appointmentsWeGotFromDatabase = allAppointmentsOfParticularDate.dailyAppointments[0].appointments;

    let appointmentsAfterUpdation = []

    for (let i = 0; i < appointmentsWeGotFromDatabase.length; i++) {
        if (appointmentsWeGotFromDatabase[i]._id == req.params.idOfAppointment) {
            appointmentsWeGotFromDatabase[i].appointmentApproved = "true"
            appointmentsAfterUpdation = appointmentsWeGotFromDatabase
            theMainAppointmentObjectWhichIsUpdated = appointmentsWeGotFromDatabase[i]
        }
    }

    standardCalendarModel.updateOne({
            userId: userIdOfTheBusinessCalendar,
            'dailyAppointments': {
                '$elemMatch': {
                    '_id': allAppointmentsOfParticularDate.dailyAppointments[0].id
                }
            }
        }, {
            '$addToSet': {
                'dailyAppointments.$.acceptedAppointmentList': req.params.idOfAppointment
            },
            '$pull': {
                'dailyAppointments.$.pendingAppointmentList': req.params.idOfAppointment
            },
            '$set': {
                'dailyAppointments.$.appointments': appointmentsAfterUpdation
            }
        },
        (err, doc) => {
            if (!err) {
                // console.log(doc);
                if (doc.ok == 1) {

                    console.log("successfully added")
                    callback(null, doc)

                } else {
                    console.log('error while adding!')
                }
            } else {
                console.log(err)
            }
        });
}

async function cancelAppointmentFunction(req, userIdOfTheBusinessCalendar, callback) {
    let allAppointmentsOfParticularDate = await standardCalendarModel.findOne({
        'userId': userIdOfTheBusinessCalendar,
        'dailyAppointments.date': req.params.dateOfAppointment
    }).select('dailyAppointments.$');

    let appointmentsWeGotFromDatabase = allAppointmentsOfParticularDate.dailyAppointments[0].appointments;
    for (let i = 0; i < appointmentsWeGotFromDatabase.length; i++) {
        if (appointmentsWeGotFromDatabase[i]._id === req.params.idOfAppointment) {
            myAppointmentOfRequesterEnd = await privateCalendarModel.findOne({
                'userId': appointmentsWeGotFromDatabase[i].requesterUserId,
                'dailySchedules.date': req.params.dateOfAppointment
            }).select('dailySchedules.$')
        }
    }
    let appointmentsAfterUpdation = []

    for (let i = 0; i < appointmentsWeGotFromDatabase.length; i++) {
        if (appointmentsWeGotFromDatabase[i]._id == req.params.idOfAppointment) {
            appointmentsWeGotFromDatabase[i].appointmentApproved = "cancel"
            appointmentsAfterUpdation = appointmentsWeGotFromDatabase
            theMainAppointmentObjectWhichIsUpdated = appointmentsWeGotFromDatabase[i]
        }
    }
    standardCalendarModel.updateOne({
            userId: userIdOfTheBusinessCalendar,
            'dailyAppointments': {
                '$elemMatch': {
                    '_id': allAppointmentsOfParticularDate.dailyAppointments[0].id
                }
            }
        }, {
            '$addToSet': {
                'dailyAppointments.$.cancelledAppointmentList': req.params.idOfAppointment
            },
            '$pull': {
                'dailyAppointments.$.pendingAppointmentList': req.params.idOfAppointment
            },
            '$set': {
                'dailyAppointments.$.appointments': appointmentsAfterUpdation
            }
        },
        (err, doc) => {
            if (!err) {
                // console.log(doc);
                if (doc.ok == 1) {
                    console.log("successfully added")
                    callback(null, doc)
                } else {
                    console.log('error while adding!')
                }
            } else {
                console.log(err)
            }
        });
}


async function editAppointmentIntoStandardCalendar(req, userIdOfBusinessUser, date, appointmentId, callback) {
    let allAppointmentsOfParticularDate = await standardCalendarModel.findOne({
        userId: userIdOfBusinessUser,
        'dailyAppointments.date': date
    }).select('dailyAppointments.$');
    let allAppointmentsAfterEditing = {}
    console.log("This is allAppointmentsOfParticularDate");
    console.log(allAppointmentsOfParticularDate);
    let detailedAppointmentsOfThisDate = allAppointmentsOfParticularDate.dailyAppointments[0].appointments
    console.log("This is detailedAppointmentsOfThisDate");
    console.log(detailedAppointmentsOfThisDate)
    if (detailedAppointmentsOfThisDate) {
        for (let i = 0; i < detailedAppointmentsOfThisDate.length; i++) {
            if (detailedAppointmentsOfThisDate[i]._id == appointmentId) {
                detailedAppointmentsOfThisDate[i].start = req.body.start
                detailedAppointmentsOfThisDate[i].end = req.body.end
                detailedAppointmentsOfThisDate[i].heading = req.body.heading
                detailedAppointmentsOfThisDate[i].description = req.body.description
                
                // FOR REDUCING SIZE OF IMAGE AND MAKING IT PREVIEW IMAGE
                let imageNameForSharp = (((req.body.documentImageInScheduleOrAppointment).replace(".jpg","")).replace(".png","")).replace(".jpeg","")
                console.log('imageNameForSharp')
                console.log(imageNameForSharp)
                sharp(`${req.body.documentImageInScheduleOrAppointment}`).resize(640,480) 
                .jpeg({quality : 80}).toFile(`${imageNameForSharp}_preview.jpg`); 
                detailedAppointmentsOfThisDate[i].documentImageInScheduleOrAppointment = `${imageNameForSharp}_preview.jpg`

                allAppointmentsAfterEditing = detailedAppointmentsOfThisDate
            }
        }

    } else {
        callback(new Error("No standard Calendar Found!!"), null)
    }
    console.log("This is allAppointmentsAfterEditing");
    console.log(allAppointmentsAfterEditing)
    standardCalendarModel.updateOne({
            'userId': userIdOfBusinessUser,
            'dailyAppointments': {
                '$elemMatch': {
                    'date': date
                }
            }
        }, {
            '$set': {
                'dailyAppointments.$.appointments': allAppointmentsAfterEditing
            }
        },
        (err, doc) => {
            if (!err) {

                if (doc.ok == 1) {
                    console.log("successfully edited in personal calendar")
                    callback(null, doc)
                } else {
                    console.log('error while adding!')
                }
            } else {
                console.log(err)
            }
        });
}

module.exports = {
    getSchedule,
    getScheduleofaDate,
    // addScheduleintoStandardCalendar,
    addAppointmentRequestInStandardCalendar,
    acceptAppointmentFunction,
    cancelAppointmentFunction,
    editAppointmentIntoStandardCalendar
}