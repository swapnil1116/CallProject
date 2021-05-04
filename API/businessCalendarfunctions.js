const mongoose = require('mongoose');
const userModelFunctions = require('../API/UserModelfunctions');
const userEmail = require('../config/credentials');
const allCalendarModel = require('../models/allCalendarModel');
const hospitalCalendarModel = require('../models/hospitalCalendarModel');
const userModel = require('../models/userModel');
const pharmacyCalendarModel = require('../models/pharmaceuticalModel');
const standardCalendarModel = require('../models/standardCalendarModel');
const noticeBoardModel = require('../models/noticeBoardModel');
const gateKeeperCalendarModel = require('../models/securityCalendarModel').securityCalendarModel;
const securityCalendarModel = require('../models/securityCalendarModel').securityCalendarModel;


async function removeBusinessCalendar(req, callback) {
    const user = await userModel.findById(req.user.id);
    console.log(user);
    const userCalendar = await user.calendars.id(req.body.allCalendarId);
    await user.calendars.remove(req.body.allCalendarId);
    console.log(userCalendar);
    const calendar = await allCalendarModel.findByIdAndRemove(userCalendar.calendarId);
    console.log(calendar);
    switch (calendar.calendarType) {
        case 'hospital':
            hospitalCalendarModel.findByIdAndRemove(calendar.calendarId).then((_) => {
                user.save();
                callback(null, {
                    msg: "successfully removed!!"
                });
            }).catch((err) => {
                callback(err, null);
            });
            break;
        case 'bank':
            // hospitalCalendarModel.findByIdAndRemove(calendar.calendarId).then((_) => {
            //     user.save();
            //     callback(null, {
            //         msg: "successfully removed!!"
            //     });
            // }).catch((err) => {
            //     callback(err, null);
            // });
            callback(new Error("Calendar Type not found!!"), null);
            break;
        case 'gatekeeper':
            gateKeeperCalendarModel.findByIdAndRemove(calendar.calendarId).then((_) => {
                user.save();
                callback(null, {
                    msg: "successfully removed!!"
                });
            }).catch((err) => {
                callback(err, null);
            });
            break;
        case 'pharmacy':
            pharmacyCalendarModel.findByIdAndRemove(calendar.calendarId).then((_) => {
                user.save();
                callback(null, {
                    msg: "successfully removed!!"
                });
            }).catch((err) => {
                callback(err, null);
            });
            break;
        default:
            callback(new Error("Calendar Type not found!!"), null);
            break;
    }
}

function editBusinessCalendar(req, callback) {
    let services = [];
    for (i = 0; i < req.body.serviceName.length; i++) {
        let key = 'enabled' + i;
        let service = {
            serviceName: req.body.serviceName[i],
            duration: req.body.duration[i],
            enabled: req.body[key] ? req.body[key] == 'on' ? true : false : false
        }
        req.body[key] ? delete req.body[key] : null;
        services.push(service);
    }
    delete req.body.serviceName;
    delete req.body.duration;
    let days = {
        mon: {
            open: req.body.open[0],
            close: req.body.close[0],
            entry: parseInt(req.body.entry[0]),
            enable: req.body.mon == 'on' ? true : false
        },
        tues: {
            open: req.body.open[1],
            close: req.body.close[1],
            entry: parseInt(req.body.entry[1]),
            enable: req.body.tue == 'on' ? true : false
        },
        wed: {
            open: req.body.open[2],
            close: req.body.close[2],
            entry: parseInt(req.body.entry[2]),
            enable: req.body.wed == 'on' ? true : false
        },
        thurs: {
            open: req.body.open[3],
            close: req.body.close[3],
            entry: parseInt(req.body.entry[3]),
            enable: req.body.thu == 'on' ? true : false
        },
        fri: {
            open: req.body.open[4],
            close: req.body.close[4],
            entry: parseInt(req.body.entry[4]),
            enable: req.body.fri == 'on' ? true : false
        },
        sat: {
            open: req.body.open[5],
            close: req.body.close[5],
            entry: parseInt(req.body.entry[5]),
            enable: req.body.sat == 'on' ? true : false
        },
        sun: {
            open: req.body.open[6],
            close: req.body.close[6],
            entry: parseInt(req.body.entry[6]),
            enable: req.body.sun == 'on' ? true : false
        }
    }
    delete req.body.open;
    delete req.body.close;
    delete req.body.entry;
    delete req.body.mon;
    delete req.body.tue;
    delete req.body.wed;
    delete req.body.thu;
    delete req.body.fri;
    delete req.body.sat;
    delete req.body.sun;
    allCalendarModel.findOne({ _id: req.body.allCalendarTypeId }, async(err, doc) => {
        if (err) {
            callback({ msg: "No calendar Found!!" }, null)
        } else {
            doc["days"] = days;
            doc["services"] = services;
            if (doc.calendarType == "gateKeeper") {
                for (e in req.body) {
                    if (e != "parkingType" && e != "parkingCapacity" && e != "costForParking2" && e != "costForParking4" && e != "allCalendarTypeId") {
                        doc[e] = req.body[e];
                        if (e == "businessName") {
                            await userModel.findOneAndUpdate({ _id: req.user.id, "calendars.calendarTypeId": req.body.allCalendarTypeId }, {
                                "calendars.$.businessName": req.body.businessName
                            }, (err, doc) => {
                                if (doc) {
                                    delete req.body[e];
                                } else {
                                    callback(err, null);
                                }
                            })
                        } else {
                            delete req.body[e];
                        }
                    }
                }
            } else if (doc.calendarType == "standard") {
                for (e in req.body) {
                    if (e != "allCalendarTypeId") {
                        doc[e] = req.body[e];
                        if (e == "businessName") {
                            await userModel.findOneAndUpdate({ _id: req.user.id, "calendars.calendarTypeId": req.body.allCalendarTypeId }, {
                                "calendars.$.businessName": req.body.businessName
                            }, (err, doc) => {
                                if (doc) {
                                    delete req.body[e];
                                } else {
                                    callback(err, null);
                                }
                            })
                        } else {
                            delete req.body[e];
                        }
                    }
                }
            }
            doc.save(async(err, _) => {
                if (err) {
                    console.log(err);
                    callback({ msg: "Some error occured while editing" }, null)
                } else {
                    if (doc.calendarType == "gateKeeper") {
                        let security = await securityCalendarModel.findById(doc.calendarId);
                        let costModel = null;
                        if (req.body.parkingType) {
                            if (req.body.parkingType == "paid") {
                                security.paid = true;
                                costModel = {
                                    "2": req.body.costForParking2 ? req.body.costForParking2 : security.cost.costForParking2,
                                    "4": req.body.costForParking4 ? req.body.costForParking4 : security.cost.costForParking4
                                }

                                security.cost = costModel;
                            } else {
                                req.body.costForParking2 = 0
                                req.body.costForParking4 = 0
                                security.paid = false;
                                security.cost = null;
                                console.log("security")
                                console.log(security)
                            }
                        }
                        security.dailyMaximumParkingEntry = req.body.parkingCapacity ? req.body.parkingCapacity : security.dailyMaximumParkingEntry;
                        security.save((err, _) => {
                            if (err) {
                                console.log(err);
                                callback({ msg: "Some error occured while editing" }, null)
                            } else {
                                callback(null, { msg: "Successfully edited" });
                            }
                        });
                    } else if (doc.calendarType == "standard") {
                        callback(null, { msg: "Successfully edited standard calendar" });
                    }
                }
            });
        }
    })
}

function addBusinessCalendar(req, callback) {
    let services = [];
    for (i = 0; i < req.body.serviceName.length; i++) {
        let key = 'enabled' + i;
        let service = {
            serviceName: req.body.serviceName[i],
            duration: req.body.duration[i],
            enabled: req.body[key] ? req.body[key] == 'on' ? true : false : false
        }
        services.push(service);
    }
    let days = {
        mon: {
            open: req.body.open[0],
            close: req.body.close[0],
            entry: parseInt(req.body.entry[0]),
            enable: req.body.mon == 'on' ? true : false
        },
        tues: {
            open: req.body.open[1],
            close: req.body.close[1],
            entry: parseInt(req.body.entry[1]),
            enable: req.body.tue == 'on' ? true : false
        },
        wed: {
            open: req.body.open[2],
            close: req.body.close[2],
            entry: parseInt(req.body.entry[2]),
            enable: req.body.wed == 'on' ? true : false
        },
        thurs: {
            open: req.body.open[3],
            close: req.body.close[3],
            entry: parseInt(req.body.entry[3]),
            enable: req.body.thu == 'on' ? true : false
        },
        fri: {
            open: req.body.open[4],
            close: req.body.close[4],
            entry: parseInt(req.body.entry[4]),
            enable: req.body.fri == 'on' ? true : false
        },
        sat: {
            open: req.body.open[5],
            close: req.body.close[5],
            entry: parseInt(req.body.entry[5]),
            enable: req.body.sat == 'on' ? true : false
        },
        sun: {
            open: req.body.open[6],
            close: req.body.close[6],
            entry: parseInt(req.body.entry[6]),
            enable: req.body.sun == 'on' ? true : false
        }
    }
    var calendarType;
    const calendar = new allCalendarModel({
        businessName: req.body.businessName,
        businessDescription: req.body.businessDescription,
        calendarType: req.body.calendarType,
        calendarId: new mongoose.Types.ObjectId(),
        userId: req.user.id,
        days: days,
        businessaddress: req.body.businessaddress,
        city: req.body.city,
        state: req.body.state,
        pin: req.body.pin,
        appointmentId: new mongoose.Types.ObjectId(),
        services: services
    });
    if (req.body.autoApprove != null) {
        calendar.autoApprove = true;
    }

    switch (req.body.calendarType) {
        case 'standard':
            calendarType = new standardCalendarModel({
                _id: calendar.calendarId,
                userId: req.user.id,
                allCalendarId: calendar.id,
                dailyVisitors: [],
                dailyAppointments: []
            });
            break;
        case 'hospital':
            calendarType = new hospitalCalendarModel({
                _id: calendar.calendarId,
                userId: req.user.id,
                allCalendarId: calendar.id,
                dailyVisitors: [],
                dailyAppointments: []
            });
            break;
        case 'bank':
            callback(new Error("the type specified isn't yet ready!!"), null);
            break;
        case 'pharmacy':
            calendarType = new pharmacyCalendarModel({
                _id: calendar.calendarId,
                userId: req.user.id,
                allCalendarId: calendar.id,
                dailyRequests: []
            });
            break;
        case 'gateKeeper':
            let costModel = null;
            if (req.body.parkingType == "paid") {
                costModel = {
                    "2": req.body.costForParking2,
                    "4": req.body.costForParking4
                }
            }
            calendarType = new gateKeeperCalendarModel({
                _id: calendar.calendarId,
                userId: req.user.id,
                allCalendarId: calendar.id,
                paid: req.body.parkingType == "paid" ? true : false,
                dailyMaximumParkingSize: req.body.parkingCapacity,
                cost: costModel,
                guards: [],
                dailyVisitors: []
            });
            break;
        case 'noticeBoard':
            calendarType = new noticeBoardModel({
                _id: calendar.calendarId,
                userId: req.user.id,
                allCalendarId: calendar.id,
                subscriberArray: [],
                allNotices: []
            })
            break;
        default:
            callback(new Error("the type specified isn't yet ready!!"), null);
            break;
    };
    calendar.save((err, doc) => {
        if (doc) {
            calendarType.save((err, doc) => {
                if (doc) {
                    var allCalendarInsideUserModel = {
                        calendarTypeId: calendar.id,
                        userId: req.user.id,
                        businessName: req.body.businessName,
                        calendarType: req.body.calendarType
                    }
                    userModel.findByIdAndUpdate(req.user.id, {
                        $push: {
                            "calendars": allCalendarInsideUserModel
                        }
                    }, (err, doc) => {

                        if (doc) {
                            callback(null, {
                                msg: "successfully added Business Calendar"
                            });
                        } else if (err) {
                            callback(err, null)
                        } else {
                            callback(new Error("Some Error occured while adding into user's calendars!!"), null)
                        }

                    });

                } else if (err) {
                    callback(err, null)
                } else {
                    callback(new Error("Some Error occured while creating Hospital Business!!"), null)
                }
            })
        } else if (err) {
            callback(err, null)
        } else {
            callback(new Error("Some Error occured while creating Business Calendar!!"), null)
        }
    })
}

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

function photoUploadedBusiness(req, callback) {
    allCalendarModel.findOneAndUpdate({ userId: req.user.id, calendarType: { $ne: 'private' } }, {
        $set: {
            profilePicBusiness: replaceAll(req.file.path, "\\", "/")
        }
    }, (err, docs) => {
        if (!err) {
            console.log(docs);
            if (docs.ok == 1) {
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

function givingPermissionOfBusinessCalendar(req, businessCalendarTypeIdOfTheUser, userIdOfUserWhoIsGettingThePermission, callback) {
    let objectToInsertInCalendarArrayOfUserWhoGotPermission = {}
    userModel.findOne({ _id: userIdOfUserWhoIsGettingThePermission }, (err, foundUser) => {
        if (err) {
            callback(err, null);
        } else {
            allCalendarModel.findOne({ _id: businessCalendarTypeIdOfTheUser }, (err, foundCalendarWhosePermissionWillBeGiven) => {
                if (err) {
                    callback(err, null);
                } else {
                    console.log(foundCalendarWhosePermissionWillBeGiven)
                    objectToInsertInCalendarArrayOfUserWhoGotPermission = {
                        _id: new mongoose.Types.ObjectId(),
                        calendarPermissionType: "Permitted",
                        businessName: foundCalendarWhosePermissionWillBeGiven.businessName,
                        calendarType: foundCalendarWhosePermissionWillBeGiven.calendarType,
                        calendarTypeId: businessCalendarTypeIdOfTheUser,
                        userId: req.user.id
                    }
                    console.log("objectToInsertInCalendarArrayOfUserWhoGotPermission")
                    console.log(objectToInsertInCalendarArrayOfUserWhoGotPermission)
                    userModel.updateOne({ _id: userIdOfUserWhoIsGettingThePermission }, {
                            '$push': {
                                'calendars': objectToInsertInCalendarArrayOfUserWhoGotPermission
                            }
                        },
                        (err, doc) => {
                            if (err) {
                                callback(err, null);
                            } else {
                                console.log(doc)
                            }
                        }
                    )
                }
            })
            let objectToInsertInPermissionArrayOfUserWhoGavePermission = {
                businessCalendarTypeId: businessCalendarTypeIdOfTheUser,
                userIdOfUserWhoIsPermitted: userIdOfUserWhoIsGettingThePermission,
            }

            userModel.updateOne({ _id: req.user.id }, {
                    '$push': {
                        'userPermissionsGiven': objectToInsertInPermissionArrayOfUserWhoGavePermission
                    }
                },
                (err, doc) => {
                    if (err) {
                        callback(err, null);
                    } else {
                        console.log(doc)
                        callback(null, { msg: "Gave Permission Successfully" })
                    }
                }
            )
        }
    })
}

function removingPermissionOfBusinessCalendar(req, businessCalendarTypeIdOfTheUser, userIdOfUserWhoHaveThePermission, callback) {
    userModel.findOne({ _id: userIdOfUserWhoHaveThePermission }, (err, foundUser) => {
        if (err) {
            callback(err, null);
        } else {
            userModel.updateOne({ _id: userIdOfUserWhoHaveThePermission }, {
                    '$pull': { calendars: { calendarTypeId: businessCalendarTypeIdOfTheUser } }
                },
                (err, doc) => {
                    if (err) {
                        callback(err, null);
                    } else {
                        console.log(doc)
                    }
                }
            )
        }

        userModel.updateOne({ _id: req.user.id }, {
                '$pull': { userPermissionsGiven: { userIdOfUserWhoIsPermitted: userIdOfUserWhoHaveThePermission } }
            },
            (err, doc) => {
                if (err) {
                    callback(err, null);
                } else {
                    console.log(doc)
                    callback(null, { msg: "Removed Permission Successfully" })
                }
            }
        )
    })
}


function givingPermissionOfSecurityCalendarToAGuard(req, businessCalendarTypeIdOfTheUser, userIdOfUserWhoIsGettingThePermission, callback) {
    let objectToInsertInCalendarArrayOfUserWhoGotPermission = {}
    userModel.findOne({ _id: userIdOfUserWhoIsGettingThePermission }, (err, foundUser) => {
        if (err) {
            callback(err, null);
        } else {
            allCalendarModel.findOne({ _id: businessCalendarTypeIdOfTheUser }, (err, foundCalendarWhosePermissionWillBeGiven) => {
                if (err) {
                    callback(err, null);
                } else {
                    console.log(foundCalendarWhosePermissionWillBeGiven)
                    objectToInsertInCalendarArrayOfUserWhoGotPermission = {
                        _id: new mongoose.Types.ObjectId(),
                        calendarPermissionType: "Guard",
                        businessName: foundCalendarWhosePermissionWillBeGiven.businessName,
                        calendarType: foundCalendarWhosePermissionWillBeGiven.calendarType,
                        calendarTypeId: businessCalendarTypeIdOfTheUser,
                        userId: req.user.id
                    }
                    console.log("objectToInsertInCalendarArrayOfUserWhoGotPermission")
                    console.log(objectToInsertInCalendarArrayOfUserWhoGotPermission)
                    userModel.updateOne({ _id: userIdOfUserWhoIsGettingThePermission }, {
                            '$push': {
                                'calendars': objectToInsertInCalendarArrayOfUserWhoGotPermission
                            }
                        },
                        (err, doc) => {
                            if (err) {
                                callback(err, null);
                            } else {
                                console.log(doc)
                                userModelFunctions.sendEmail(userEmail.email, foundUser.email, "Permissions given to you.", `You have been given permission of  ${foundCalendarWhosePermissionWillBeGiven.businessName} Society by ${req.user.name}`)
                            }
                        }
                    )
                }
            })
            let objectToInsertInPermissionArrayOfUserWhoGavePermission = {
                businessCalendarTypeId: businessCalendarTypeIdOfTheUser,
                userIdOfUserWhoIsPermitted: userIdOfUserWhoIsGettingThePermission,
            }

            userModel.updateOne({ _id: req.user.id }, {
                    '$push': {
                        'securityGuardPermissionGiven': objectToInsertInPermissionArrayOfUserWhoGavePermission
                    }
                },
                (err, doc) => {
                    if (err) {
                        callback(err, null);
                    } else {
                        console.log(doc)
                        callback(null, { msg: "Gave Permission Successfully" })
                    }
                }
            )
        }
    })
}

function removingPermissionOfSecurityCalendarFromAGuard(req, businessCalendarTypeIdOfTheUser, userIdOfUserWhoHaveThePermission, callback) {
    userModel.findOne({ _id: userIdOfUserWhoHaveThePermission }, (err, foundUser) => {
        if (err) {
            callback(err, null);
        } else {
            userModel.updateOne({ _id: userIdOfUserWhoHaveThePermission }, {
                    '$pull': { calendars: { calendarTypeId: businessCalendarTypeIdOfTheUser } }
                },
                (err, doc) => {
                    if (err) {
                        callback(err, null);
                    } else {
                        console.log(doc)
                    }
                }
            )
        }

        userModel.updateOne({ _id: req.user.id }, {
                '$pull': { securityGuardPermissionGiven: { userIdOfUserWhoIsPermitted: userIdOfUserWhoHaveThePermission } }
            },
            (err, doc) => {
                if (err) {
                    callback(err, null);
                } else {
                    console.log(doc)
                    allCalendarModel.findOne({ _id: businessCalendarTypeIdOfTheUser }, (err, foundCalendarWhosePermissionWillBeGiven) => {
                        userModelFunctions.sendEmail(userEmail.email, foundUser.email, "Permissions removed", `You have been removed from Permission List of  ${foundCalendarWhosePermissionWillBeGiven.businessName} Society by ${req.user.name}`)
                        callback(null, { msg: "Removed Permission Successfully" })
                    })
                }
            }
        )
    })
}


module.exports = {
    addBusinessCalendar,
    removeBusinessCalendar,
    editBusinessCalendar,
    photoUploadedBusiness,

    // NORMAL USER PERMISSIONS OF A CALENDAR
    givingPermissionOfBusinessCalendar,
    removingPermissionOfBusinessCalendar,

    // SECURITY GUARD PERMISSION OF A SECURITY CALENDAR
    givingPermissionOfSecurityCalendarToAGuard,
    removingPermissionOfSecurityCalendarFromAGuard
}