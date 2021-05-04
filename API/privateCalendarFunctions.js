const mongoose = require('mongoose');
const passport = require('../config/passport');
const allCalendarModel = require('../models/allCalendarModel');
const privateCalendarModel = require('../models/privateCalendarModel');
const userModel = require('../models/userModel');
const timeManipulation = require('./helpers/timeManipulation');
const sharp = require('sharp');

async function addScheduleintoPersonalCalendar(req, date, businessCalendarFoundOrNot, scheduleId, callback) {
    let calendar = await privateCalendarModel.findOne({
        userId: req.user.id,
        'dailySchedules.date': date
    }).select('dailySchedules.$');
    let schedule = {};
    for (element in req.body) {
        schedule[element] = req.body[element];
    }
    let imageNameForSharp = (((req.body.documentImageInScheduleOrAppointment).replace(".jpg","")).replace(".png","")).replace(".jpeg","")
    schedule.documentImageInScheduleOrAppointment = `${imageNameForSharp}_preview.jpg`
    console.log('imageNameForSharp')
    console.log(imageNameForSharp)
    sharp(`${req.body.documentImageInScheduleOrAppointment}`).resize(640,480) 
    .jpeg({quality : 80}).toFile(`${imageNameForSharp}_preview.jpg`); 
    schedule.dateOfSchedule = date;
    if (businessCalendarFoundOrNot.length !== 0) {
        schedule.userIdOfTheBusinessWhichYouRequested = businessCalendarFoundOrNot.userId;
        schedule.nameOfTheBusinessWhichYouRequested = businessCalendarFoundOrNot.businessName;
        schedule.calendarIdOfTheBusinessWhichYouRequested = businessCalendarFoundOrNot._id
        schedule.calendarTypeOfTheBusinessWhichYouRequested = businessCalendarFoundOrNot.calendarType
        schedule.appointmentApproved = "pending"
        schedule.appointmentId = scheduleId;
    }
    if (calendar) {
        pushScheduleintoPersonalCalendar({
            "userId": req.user.id,
            "scheduleId": calendar.dailySchedules[0].id,
            "schedule": schedule
        }, callback);
    } else {
        privateCalendarModel.findOne({
            userId: req.user.id,
        }).then((personalCalendar) => {
            if (personalCalendar) {
                let endTimeOfbefore = timeManipulation.decreaseByaMin(req.body.start);
                let startTimeOfAfter = timeManipulation.increaseByaMin(req.body.end);
                let dailySchedule = {
                    date: date,
                    schedules: [schedule],
                    freeTime: [{
                        start: "00:00",
                        end: endTimeOfbefore
                    }, {
                        start: startTimeOfAfter,
                        end: "23:59"
                    }]
                }
                personalCalendar.dailySchedules.push(dailySchedule);
                personalCalendar.save();
                callback(null, {
                    msg: "successfully added"
                });
            } else {
                allCalendarModel.findOne({ userId: req.user.id }, (err, calendar) => {
                    if (err) {
                        console.log(err)
                    } else {
                        privateCalendar = privateCalendarModel({
                            _id: calendar.calendarId,
                            userId: req.user.id,
                            allCalendarId: calendar.id,
                            dailySchedule: []
                        });
                        privateCalendar.save();
                        privateCalendarModel.findOne({
                            userId: req.user.id,
                        }).then((personalCalendar) => {
                            if (personalCalendar) {
                                let endTimeOfbefore = timeManipulation.decreaseByaMin(req.body.start);
                                let startTimeOfAfter = timeManipulation.increaseByaMin(req.body.end);
                                let dailySchedule = {
                                    date: date,
                                    schedules: [schedule],
                                    freeTime: [{
                                        start: "00:00",
                                        end: endTimeOfbefore
                                    }, {
                                        start: startTimeOfAfter,
                                        end: "23:59"
                                    }]
                                }
                                personalCalendar.dailySchedules.push(dailySchedule);
                                personalCalendar.save();
                                callback(null, {
                                    msg: "successfully added"
                                });
                            }
                        })
                    }
                })
            }
        }).catch((err) => {
            console.log(err);
            callback(err, null);
        });
    }
}


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
                    let calendar = await personalCalendarModel.findOne({
                        userId: req.user.id
                    });
                    let dailySchedule = await calendar.dailySchedule.id(req.body.scheduleId);
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

async function pushScheduleintoPersonalCalendar(body, callback) {
    let calendar = await privateCalendarModel.findOne({
        'userId': body.userId,
        'dailySchedules': {
            '$elemMatch': {
                '_id': body.scheduleId
            }
        }
    }).select('dailySchedules.$');
    privateCalendarModel.updateOne({
            'userId': body.userId,
            'dailySchedules': {
                '$elemMatch': {
                    '_id': body.scheduleId
                }
            }
        }, {
            '$set': {
                "dailySchedules.$.freeTime": timeManipulation.calculateFreeTimeList(calendar.dailySchedules[0].freeTime, body.schedule.start, body.schedule.end)
            },
            '$push': {
                'dailySchedules.$.schedules': body.schedule
            }
        },
        (err, doc) => {
            if (!err) {
                // console.log(doc);
                if (doc.ok == 1) {

                    callback(null, {
                        msg: "successfully added"
                    });
                } else {
                    callback(new Error('error while adding!'), null);
                }
            } else {
                callback(err, null);
            }
        });
}

async function getScheduleofaDate(req, callback) {
    let schedules = await privateCalendarModel.findOne({
        'userId': req.user.id,
        'dailySchedules.date': req.params.date
    }).select('dailySchedules.$');
    if (schedules) {
        let dailySchedule = schedules.dailySchedules[0];
        if (dailySchedule) {
            callback(null, dailySchedule);
        } else {
            callback(new Error("no events on this date found", null))
        }
    } else {
        callback(new Error("no events on this date found", null))
    }
}
async function getAppointmentofaDate(req, callback) {
    let calendar = await privateCalendarModel.findOne({
        'userId': req.user.id,
        'dailyAppointments.date': req.params.date
    }).select('dailyAppointments.$');
    if (calendar) {
        let dailyAppointment = calendar.dailyAppointments[0];
        if (dailyAppointment) {
            callback(null, dailyAppointment);
        } else {
            callback(new Error("no appointments on this date found", null))
        }
    } else {
        callback(new Error("no appointments on this date found", null))
    }
}

async function getSchedule(req, callback) {
    let calendar = await privateCalendarModel.findOne({
        'userId': req.user.id
    }).select('dailySchedules');

    let appointment = await privateCalendarModel.findOne({
        'userId': req.user.id
    }).select('dailyAppointments');
    let dailySchedules = calendar.dailySchedules;
    let dailyAppointments = appointment.dailyAppointments;
    if (calendar) {
        let today = new Date();
        let hour = today.getHours();
        let min = today.getMinutes();
        let schedules = [];
        let elementSchedulesLength = 0
        let todayDate = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
        for (element of dailySchedules) {

            let schedule = [];
            let i = 0;
            if (element.date == todayDate) {
                for (el in element.schedules) {
                    if (el.appointmentApproved == 'cancel') {
                        let index = (element.schedules).indexOf(el)
                        if (index > -1) {
                            (element.schedules).splice(index, 1);
                        }
                    }
                    if (i >= 3) {
                        break;
                    }
                    let start = el.start.split(':');
                    if (parseInt(start[0]) >= hour && parseInt(start[1]) > min) {
                        schedule.push(el.heading);
                        i = i + 1;
                    }
                }
            } else {
                for (el of element.schedules) {
                    // console.log(" schedules")
                    // console.log(el)
                    if (el.appointmentApproved == 'cancel') {
                        let index = (element.schedules).indexOf(el)
                        if (index > -1) {
                            (element.schedules).splice(index, 1);
                        }

                    }
                    if (i >= 3) {
                        break;
                    } else {
                        if (el.appointmentApproved != 'cancel' || el.appointmentApproved == 'true' || el.appointmentApproved == null || el.appointmentApproved == 'pending') {
                            schedule.push(el.heading);
                            i = i + 1;
                        }
                    }
                }
            }
            if (schedule.length < 3) {
                schedules.push({
                    date: element.date,
                    schedule: schedule,
                    count: schedule.length
                });
            } else if (schedule.length == 0) {

            } else {
                schedules.push({
                    date: element.date,
                    schedule: schedule,
                    count: element.schedules.length
                });
            }
        }

        for (element of dailyAppointments) {
            let schedule = [];
            let i = 0;
            if (element.date == todayDate) {
                for (el in element.appointments) {
                    if (el.appointmentApproved == "cancel") {
                        let index = (element.appointments).indexOf(el)
                        if (index > -1) {
                            (element.appointments).splice(index, 1);
                        }
                    }
                    let requester = await userModel.findOne({ _id: el.requesterUserId }).select('name');
                    console.log(requester)
                    if (i >= 3) {
                        break;
                    }
                    let start = el.start.split(':');
                    if (parseInt(start[0]) >= hour && parseInt(start[1]) > min) {
                        if (el.appointmentApproved == 'pending') {
                            schedule.push(`Pending: ${requester.name}  `)
                        } else if (el.appointmentApproved == "true") {
                            schedule.push(`${requester.name}: ${el.description}`)
                        }
                        i = i + 1;
                    }
                }
            } else {
                for (el of element.appointments) {
                    if (el.appointmentApproved == "cancel") {
                        let index = (element.appointments).indexOf(el)
                        if (index > -1) {
                            (element.appointments).splice(index, 1);
                        }
                    }
                    let requester = await userModel.findOne({ _id: el.requesterUserId }).select('name');
                    if (i >= 3) {
                        break;
                    } else {
                        if (el.appointmentApproved == 'pending') {
                            schedule.push(`Pending: ${requester.name}  `)
                        } else if (el.appointmentApproved == "true") {
                            schedule.push(`${requester.name}: ${el.description}`)
                        }
                        i = i + 1;
                    }
                }
            }

            if (schedules.length != 0) {
                let source = { date: element.date }
                for (singleDateSchedule of schedules) {
                    function where(collection, source) {
                        var keys = Object.keys(source);

                        return collection.filter(function(item) {
                            return keys.every(function(key) {
                                return source[key] == item[key];
                            });
                        });
                    }
                    if (singleDateSchedule.date == element.date) {
                        if (schedule.length > 0) {
                            for (heading of schedule) {
                                if (singleDateSchedule.schedule.length >= 3) {
                                    break;
                                } else {
                                    singleDateSchedule.schedule.push(heading)
                                }
                            }
                            console.log(element.pendingAppointmentList.length + element.acceptedAppointmentList.length + " length element.pendingAppointmentList.length + element.acceptedAppointmentList.length")
                            singleDateSchedule.count += element.pendingAppointmentList.length + element.acceptedAppointmentList.length
                            break;
                        }
                    }
                }
            } else {
                schedules.push({
                    date: element.date,
                    schedule: schedule,
                    count: element.pendingAppointmentList.length + element.acceptedAppointmentList.length
                })
            }
            schedules.push({
                date: element.date,
                schedule: schedule,
                count: element.pendingAppointmentList.length + element.acceptedAppointmentList.length
            })
        }
        if (schedules.length > 0) {
            callback(null, schedules);
        } else {
            callback(new Error("no Schedules found!!"), null)
        }
    } else {
        callback(new Error("no calendar found!!"), null);
    }
}


async function addAppointmentRequestInPersonalCalendar(req, date, businessFound, uniqueIdForAppointment, callback) {
    privateCalendarModel.findOne({ userId: businessFound.userId, 'dailyAppointments.date': date }, async(err, businessCalendarFound) => {
        console.log(" calendar found the of the private calendar")
        console.log(businessCalendarFound)
        let dailyAppointmentsFromDatabase = await privateCalendarModel.findOne({
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

        let imageNameForSharp = (((req.body.documentImageInScheduleOrAppointment).replace(".jpg","")).replace(".png","")).replace(".jpeg","")
        console.log('imageNameForSharp')
        console.log(imageNameForSharp)
        sharp(`${req.body.documentImageInScheduleOrAppointment}`).resize(640,480) 
        .jpeg({quality : 80}).toFile(`${imageNameForSharp}_preview.jpg`); 
        appointments.documentImageInScheduleOrAppointment = `${imageNameForSharp}_preview.jpg`


        console.log(appointments)
        if (!businessCalendarFound) {
            privateCalendarModel.findOne({ userId: businessFound.userId }, (err, personalCalendarToAddNewUnapprovedAppointment) => {
                console.log(personalCalendarToAddNewUnapprovedAppointment)
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
                personalCalendarToAddNewUnapprovedAppointment.dailyAppointments.push(dailyAppointment)
                personalCalendarToAddNewUnapprovedAppointment.save(function(err, savingObject) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(savingObject)
                    }
                });
            })
        } else {
            privateCalendarModel.findOne({ userId: businessFound.userId, 'dailyAppointments.date': date }, (err, businessCalendarFoundAgain) => {
                console.log("Date Already Have One  Appointment.")
                for (i of businessCalendarFoundAgain.dailyAppointments) {
                    if (i.date === date) {
                        console.log(i)
                        privateCalendarModel.updateOne({
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

// async function pushAppointmentintoPersonalCalendar(body, callback) {
//     let calendar = await privateCalendarModel.findOne({
//         'userId': body.userId,
//         'dailySchedules': {
//             '$elemMatch': {
//                 '_id': body.scheduleId
//             }
//         }
//     }).select('dailySchedules.$');
//     privateCalendarModel.updateOne({
//             'userId': body.userId,
//             'dailySchedules': {
//                 '$elemMatch': {
//                     '_id': body.scheduleId
//                 }
//             }
//         }, {
//             '$set': {
//                 "dailySchedules.$.freeTime": timeManipulation.calculateFreeTimeList(calendar.dailySchedules[0].freeTime, body.schedule.start, body.schedule.end)
//             },
//             '$push': {
//                 'dailySchedules.$.schedules': body.schedule
//             }
//         },
//         (err, doc) => {
//             if (!err) {
//                 // console.log(doc);
//                 if (doc.ok == 1) {

//                     callback(null, {
//                         msg: "successfully added"
//                     });
//                 } else {
//                     callback(new Error('error while adding!'), null);
//                 }
//             } else {
//                 callback(err, null);
//             }
//         });
// }


// async function getnumberofEventsAndSchedule(req, callback) {
//     console.log(req.user.id);
//     let personalCalendar = await privateCalendarModel.findOne({
//         userId: req.user.id
//     });
//     console.log(personalCalendar)
//     let scheduleCount = {};
//     for (element in personalCalendar.dailySchedules) {
//         let count = element.schedules.length;
//         if (count > 0) {
//             scheduleCount[JSON.stringify(element.date).slice(1, 11)] = count;
//         }
//     }
//     callback(null, scheduleCount);
// }

// BY SATYAM MISHRA
async function getScheduleById(req, date, idOfPersonalSchedule, callback) {
    let calendar = await privateCalendarModel.findOne({
        userId: req.user.id,
        'dailySchedules.date': date
    }).select('dailySchedules.$');
    let individualScheduleWhichNeedsToBeEdited = {}
    let allSchedulesOfThisDate = calendar.dailySchedules[0].schedules
    if (calendar) {
        for (let i = 0; i < allSchedulesOfThisDate.length; i++) {
            if (allSchedulesOfThisDate[i]._id == idOfPersonalSchedule) {
                individualScheduleWhichNeedsToBeEdited = allSchedulesOfThisDate[i]
            }
        }
        callback(null, individualScheduleWhichNeedsToBeEdited)
    } else {
        callback(new Error("No Personal Calendar Found!!"), null)
    }
}
async function editScheduleIntoPersonalCalendar(req, date, idOfPersonalSchedule, callback) {
    let calendar = await privateCalendarModel.findOne({
        userId: req.user.id,
        'dailySchedules.date': date
    }).select('dailySchedules.$');
    let allSchedulesAfterEditing = {}
    let allSchedulesOfThisDate = calendar.dailySchedules[0].schedules
    if (calendar) {
        for (let i = 0; i < allSchedulesOfThisDate.length; i++) {
            if (allSchedulesOfThisDate[i]._id == idOfPersonalSchedule) {
                allSchedulesOfThisDate[i].start = req.body.start
                allSchedulesOfThisDate[i].end = req.body.end
                allSchedulesOfThisDate[i].heading = req.body.heading
                allSchedulesOfThisDate[i].description = req.body.description
                let imageNameForSharp = (((req.body.documentImageInScheduleOrAppointment).replace(".jpg","")).replace(".png","")).replace(".jpeg","")
                console.log('imageNameForSharp')
                console.log(imageNameForSharp)
                sharp(`${req.body.documentImageInScheduleOrAppointment}`).resize(640,480) 
                .jpeg({quality : 80}).toFile(`${imageNameForSharp}_preview.jpg`); 
                allSchedulesOfThisDate[i].documentImageInScheduleOrAppointment = `${imageNameForSharp}_preview.jpg`

                allSchedulesAfterEditing = allSchedulesOfThisDate
            }
        }
    } else {
        callback(new Error("No Personal Calendar Found!!"), null)
    }
    privateCalendarModel.updateOne({
            'userId': req.user.id,
            'dailySchedules': {
                '$elemMatch': {
                    'date': date
                }
            }
        }, {
            '$set': {
                'dailySchedules.$.schedules': allSchedulesAfterEditing
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
async function editAppointmentIntoPersonalCalendar(req, date, idOfPersonalSchedule, byViewSchedulePageOrNot, callback) {
    let calendar = await privateCalendarModel.findOne({
        userId: req.user.id,
        'dailySchedules.date': date
    }).select('dailySchedules.$');
    let allSchedulesAfterEditing = {}
    let allSchedulesOfThisDate = calendar.dailySchedules[0].schedules
    if (calendar) {
        if (byViewSchedulePageOrNot === null) {
            for (let i = 0; i < allSchedulesOfThisDate.length; i++) {
                if (allSchedulesOfThisDate[i]._id == idOfPersonalSchedule) {
                    allSchedulesOfThisDate[i].start = req.body.start
                    allSchedulesOfThisDate[i].end = req.body.end
                    allSchedulesOfThisDate[i].heading = req.body.heading
                    allSchedulesOfThisDate[i].description = req.body.description
                    allSchedulesOfThisDate[i].documentImageInScheduleOrAppointment = req.body.documentImageInScheduleOrAppointment

                    let imageNameForSharp = (((req.body.documentImageInScheduleOrAppointment).replace(".jpg","")).replace(".png","")).replace(".jpeg","")
                    console.log('imageNameForSharp')
                    console.log(imageNameForSharp)
                    sharp(`${req.body.documentImageInScheduleOrAppointment}`).resize(640,480) 
                    .jpeg({quality : 80}).toFile(`${imageNameForSharp}_preview.jpg`); 
                    allSchedulesOfThisDate[i].documentImageInScheduleOrAppointment = `${imageNameForSharp}_preview.jpg`

                    allSchedulesAfterEditing = allSchedulesOfThisDate
                }
            }
        } else if (byViewSchedulePageOrNot !== null) {
            for (let i = 0; i < allSchedulesOfThisDate.length; i++) {
                if (allSchedulesOfThisDate[i]._id == idOfPersonalSchedule) {
                    allSchedulesOfThisDate[i].calendarIdOfTheBusinessWhichYouRequested = byViewSchedulePageOrNot._id
                    allSchedulesOfThisDate[i].calendarTypeOfTheBusinessWhichYouRequested = byViewSchedulePageOrNot.calendarType
                    allSchedulesAfterEditing = allSchedulesOfThisDate
                    console.log("allSchedulesAfterEditing")
                    console.log(allSchedulesAfterEditing)
                }
            }
        }
    } else {
        callback(new Error("No Personal Calendar Found!!"), null)
    }
    privateCalendarModel.updateOne({
            'userId': req.user.id,
            'dailySchedules': {
                '$elemMatch': {
                    'date': date
                }
            }
        }, {
            '$set': {
                'dailySchedules.$.schedules': allSchedulesAfterEditing
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
async function requestAcceptedIntoPersonalCalendarByAnyBusinessCalendar(req, date, userIdOfRequester, appointmentId, callback) {
    let calendar = await privateCalendarModel.findOne({
        userId: userIdOfRequester,
        'dailySchedules.date': date
    }).select('dailySchedules.$');
    let allSchedulesAfterEditing = {}
    let allSchedulesOfThisDate = calendar.dailySchedules[0].schedules
    if (calendar) {
        for (let i = 0; i < allSchedulesOfThisDate.length; i++) {
            if (allSchedulesOfThisDate[i].appointmentId == appointmentId) {
                allSchedulesOfThisDate[i].appointmentApproved = "true"
                allSchedulesAfterEditing = allSchedulesOfThisDate
            }
        }
    } else {
        callback(new Error("No Personal Calendar Found!!"), null)
    }
    privateCalendarModel.updateOne({
            'userId': userIdOfRequester,
            'dailySchedules': {
                '$elemMatch': {
                    'date': date
                }
            }
        }, {
            '$set': {
                'dailySchedules.$.schedules': allSchedulesAfterEditing
            }
        },
        (err, doc) => {
            if (!err) {

                if (doc.ok == 1) {
                    console.log("appointment got accepted by a personal calendar")
                    callback(null, doc)
                } else {
                    console.log('error while adding!')
                }
            } else {
                console.log(err)
            }
        });

}
async function cancelRequestIntoPersonalCalendar(req, date, userIdOfRequester, appointmentId, callback) {
    let calendar = await privateCalendarModel.findOne({
        userId: userIdOfRequester,
        'dailySchedules.date': date
    }).select('dailySchedules.$');
    let allSchedulesAfterEditing = {}
    let allSchedulesOfThisDate = calendar.dailySchedules[0].schedules
    if (calendar) {
        for (let i = 0; i < allSchedulesOfThisDate.length; i++) {
            if (allSchedulesOfThisDate[i].appointmentId == appointmentId) {
                allSchedulesOfThisDate[i].appointmentApproved = "cancel"
                allSchedulesAfterEditing = allSchedulesOfThisDate
            }
        }
    } else {
        callback(new Error("No Personal Calendar Found!!"), null)
    }
    privateCalendarModel.updateOne({
            'userId': userIdOfRequester,
            'dailySchedules': {
                '$elemMatch': {
                    'date': date
                }
            }
        }, {
            '$set': {
                'dailySchedules.$.schedules': allSchedulesAfterEditing
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

// THIS IS THE FUNCTION OF ACCEPTING APPOINTMENT BY PRIVATE CALENDAR WHO GOT THE REQUEST FOR APPOINTMENT
async function acceptingAppointmentInPrivateCalendar(req, date, userIdOfTheBusinessCalendar, appointmentId, callback) {
    console.log('userIdOfTheBusinessCalendar')
    console.log(userIdOfTheBusinessCalendar)
    let calendar = await privateCalendarModel.findOne({
        userId: userIdOfTheBusinessCalendar,
        'dailyAppointments.date': date
    }).select('dailyAppointments.$');
    let allAppointmentsAfterEditing = {}
    let allAppointmentsOfThisDate = calendar.dailyAppointments[0].appointments
    console.log('allAppointmentsOfThisDate')
    console.log(allAppointmentsOfThisDate)
    if (calendar) {
        for (let i = 0; i < allAppointmentsOfThisDate.length; i++) {
            if (allAppointmentsOfThisDate[i]._id == appointmentId) {
                allAppointmentsOfThisDate[i].appointmentApproved = "true"
                allAppointmentsAfterEditing = allAppointmentsOfThisDate
            }
        }
    } else {
        callback(new Error("No Personal Calendar Found!!"), null)
    }
    privateCalendarModel.updateOne({
            'userId': userIdOfTheBusinessCalendar,
            'dailyAppointments': {
                '$elemMatch': {
                    'date': date
                }
            }
        }, {
            '$addToSet': {
                'dailyAppointments.$.acceptedAppointmentList': appointmentId
            },
            '$pull': {
                'dailyAppointments.$.pendingAppointmentList': appointmentId
            },
            '$set': {
                'dailyAppointments.$.appointments': allAppointmentsAfterEditing
            }
        },
        (err, doc) => {
            if (!err) {

                if (doc.ok == 1) {
                    console.log("successfully accepted appointment in personal calendar")
                    callback(null, doc)
                } else {
                    console.log('error while adding!')
                }
            } else {
                console.log(err)
            }
        });

}

// THIS IS THE FUNCTION OF CANCELLING APPOINTMENT BY PRIVATE CALENDAR WHO GOT THE REQUEST FOR APPOINTMENT
async function cancellingAppointmentInPrivateCalendar(req, date, userIdOfTheBusinessCalendar, appointmentId, callback) {
    let calendar = await privateCalendarModel.findOne({
        userId: userIdOfTheBusinessCalendar,
        'dailyAppointments.date': date
    }).select('dailyAppointments.$');
    let allAppointmentsAfterEditing = {}
    let allAppointmentsOfThisDate = calendar.dailyAppointments[0].appointments
    if (calendar) {
        for (let i = 0; i < allAppointmentsOfThisDate.length; i++) {
            if (allAppointmentsOfThisDate[i]._id == appointmentId) {
                allAppointmentsOfThisDate[i].appointmentApproved = "cancel"
                allAppointmentsAfterEditing = allAppointmentsOfThisDate
            }
        }
    } else {
        callback(new Error("No Personal Calendar Found!!"), null)
    }
    privateCalendarModel.updateOne({
            'userId': userIdOfTheBusinessCalendar,
            'dailyAppointments': {
                '$elemMatch': {
                    'date': date
                }
            }
        }, {
            '$addToSet': {
                'dailyAppointments.$.cancelledAppointmentList': appointmentId
            },
            '$pull': {
                'dailyAppointments.$.pendingAppointmentList': appointmentId
            },
            '$set': {
                'dailyAppointments.$.appointments': allAppointmentsAfterEditing
            }
        },
        (err, doc) => {
            if (!err) {
                if (doc.ok == 1) {
                    console.log("successfully cancelled appointment by user who got the request in personal calendar")
                    callback(null, doc)
                } else {
                    console.log('error while adding!')
                }
            } else {
                console.log(err)
            }
        });

}




// THIS IS THE FUNCTION OF EDITING APPOINTMENT OF PRIVATE CALENDAR WHO GOT THE REQUEST FOR APPOINTMENT
async function appointmentGotEditedByUserWhoSeekedAppointment(req, userIdOfTheBusinessCalendar, dateOfSchedule, appointmentId, callback) {
    let calendar = await privateCalendarModel.findOne({
        userId: userIdOfTheBusinessCalendar,
        'dailyAppointments.date': dateOfSchedule
    }).select('dailyAppointments.$');
    let allAppointmentsAfterEditing = {}
    let allAppointmentsOfThisDate = calendar.dailyAppointments[0].appointments
    if (calendar) {
        for (let i = 0; i < allAppointmentsOfThisDate.length; i++) {
            if (allAppointmentsOfThisDate[i]._id == appointmentId) {
                allAppointmentsOfThisDate[i].start = req.body.start
                allAppointmentsOfThisDate[i].end = req.body.end
                allAppointmentsOfThisDate[i].heading = req.body.heading
                allAppointmentsOfThisDate[i].description = req.body.description
                allAppointmentsOfThisDate[i].documentImageInScheduleOrAppointment = req.body.documentImageInScheduleOrAppointment
                allAppointmentsAfterEditing = allAppointmentsOfThisDate
            }
        }
    } else {
        callback(new Error("No Personal Calendar Found!!"), null)
    }
    privateCalendarModel.updateOne({
            'userId': userIdOfTheBusinessCalendar,
            'dailyAppointments': {
                '$elemMatch': {
                    'date': dateOfSchedule
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
                    console.log("successfully edited the personal calendar by user who seeked appointment")
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
    getAppointmentofaDate,
    addScheduleintoPersonalCalendar,
    addAppointmentRequestInPersonalCalendar,
    getScheduleById,
    editScheduleIntoPersonalCalendar,
    editAppointmentIntoPersonalCalendar,

    // THIS FUNCTION WILL BE CALLED WHEN ANY REQUEST OF THE USER WILL BE ACCEPTED 
    requestAcceptedIntoPersonalCalendarByAnyBusinessCalendar,
    cancelRequestIntoPersonalCalendar,


    // THIS IS FOR ACCEPTING APPOINTMENT IN PERSONAL CALENDAR
    acceptingAppointmentInPrivateCalendar,
    // THIS IS FOR CANCELLING APPOINTMENT IN PERSONAL CALENDAR
    cancellingAppointmentInPrivateCalendar,
    // THIS FOR EDITING THE APPOINTMENT WHEN THE USER WHO SEEKED THE APPOINTMENT EDITS HIS APPOINTMENT
    appointmentGotEditedByUserWhoSeekedAppointment
}