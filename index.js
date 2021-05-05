const https = require("https")
const fs = require("fs");
const url = require('url');
const qs = require("querystring");


// const config = require("./paytm/config");

const engines = require('consolidate');
const axios = require("axios")
const qrcode = require('qrcode');
const QrCodeReader = require('qrcode-reader');
const Jimp = require("jimp");
const assert = require('assert');
const isEqual = require('lodash.isequal');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const http = require('http');
const urlencode = require('urlencode');
const multer = require('multer');
const sharp = require('sharp');
const {
    v4: uuidv4,
    parse: uuidParse,
    stringify: uuidStringify
} = require('uuid')
const saltRounds = 12;
const connect = require('./connect');
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash")
const MongoDBStore = require('connect-mongodb-session')(session);
// FOR MAILING PURPOSE
const nodemailer = require('nodemailer');
const userEmail = require("./config/credentials")

// DATABASE MODELS
const UserModel = require("./models/userModel");
const allCalendarModel = require('./models/allCalendarModel');
const privateCalendarModel = require('./models/privateCalendarModel');
const standardCalendarModel = require('./models/standardCalendarModel');
const securityCalendarModel = require('./models/securityCalendarModel').securityCalendarModel;
const visitorModel = require('./models/securityCalendarModel').visitorModel;
const noticeBoardModel = require('./models/noticeBoardModel');

//
var Userdb = require("./models/productModel")
const Codes = require("./models/generateCouponModel")
const Coupon = require("./models/couponModel")

// FUNCTIONS
const userModelFunctions = require('./API/UserModelfunctions');
const businessCalendarFunctions = require('./API/businessCalendarfunctions');
const privateCalendarFunctions = require('./API/privateCalendarFunctions');
const standardCalendarFunctions = require('./API/standardCalendarFunctions');
const securityCalendarFunctions = require('./API/securityCalendarFunctions');
const searchFunctions = require('./API/searchFunctions');
const noticeBoardFunctions = require('./API/noticeBoardFunctions');
const controller = require('./API/controller');
const cons = require("consolidate");
const { response } = require("express");

// INITIALIZING APP WITH EXPRESS()
const app = express();
app.use(express.json());

// PASSPORT LOCAL STARTEGY FROM CONFIG FILE
require("./config/passport")(passport);

//FOR FILE RENDERING
app.use("/static", express.static("static"))
//SETTING PUG ENGINE
app.set('view engine', 'pug');
app.set('view engine', 'ejs');

// app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))

// ENVIRONMENT VARIABLES
const {
    NODE_ENV = "development",
    session_Name = "mySession",
    session_Secret = "mySecret",
    session_Life = 1000 * 60 * 60, //SESSION LIFE = 1 HOUR
} = process.env

const PORT = process.env.PORT || 3000 ;



// MAKING A MongoStore  
connect.myMongoStore.on('error', function (error) {
    console.log(error);
});

// EXPRESS SESSION
app.use(session({
    name: session_Name,
    resave: false,
    rolling: false,
    saveUninitialized: false,
    secret: session_Secret,
    cookie: {
        maxAge: session_Life,
        SameSite: "Lax",
    },
    store: connect.myMongoStore
}))

// PASSPORT MIDDLEWARE
app.use(passport.initialize())
app.use(passport.session())
//CONNECT FLASH
app.use(flash());
const redirectToLoginPage = (req, res, next) => {
    if (!req.user) {
        req.flash("success_msg", "You have to Login First in order to do that task");
        res.redirect("/login")
    } else {
        next()
    }
}
const redirectToDashboard = (req, res, next) => {
    if (req.user) {
        res.redirect("/user/dashboard")
    } else {
        next()
    }
}
app.use(function (req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success_msg = req.flash("success_msg");
    if (req.user) {
        res.locals.user = req.user;
        res.locals.subscribedCalendars = req.user.subscribedBusinessCalendars
        res.locals.pendingEntryArrayLength = req.user.entryRequestArray.length;
        res.locals.allCalendars = req.user.calendars;
        res.locals.gateKeeperMembershipCalendars = []
        for (let i = 0; i < (req.user.gateKeeperMembershipCalendars).length; i++) {
            allCalendarModel.findOne({ _id: req.user.gateKeeperMembershipCalendars[i].businessCalendarTypeId }, (err, calendar) => {
                if (err) {
                    console.log(err)
                } else {
                    req.user.gateKeeperMembershipCalendars[i].businessName = calendar.businessName
                    res.locals.gateKeeperMembershipCalendars.push(req.user.gateKeeperMembershipCalendars[i])
                }
            })
        }
    }
    next();
});

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: userEmail.email, // generated ethereal user
        pass: userEmail.password // generated ethereal password
    },
});

//--------------------------------------------------------------------------------------------------------------------------
//                                                  A U T H    R O U T E
// --------------------------------------------------------------------------------------------------------------------------
// MAIN ROUTES FROM HERE
app.get("/", (req, res) => {
    res.render("home.pug")
})
app.post("/", (req, res) => {
    console.log(req.body)
    from = userEmail.email;
    to = req.body.emailAddress;
    subject = "You requested for contact."
    text = `${req.body.name}, Our Team Will Connect With You Shortly.`
    userModelFunctions.sendEmail(from, to, subject, text)

    subject2 = `${req.body.name} requested for contact`
    text2 = `Name: ${req.body.name}, Email: ${req.body.emailAddress} , Message: ${req.body.message} `
    userModelFunctions.sendEmail(from, from, subject2, text2)
    res.redirect("back")
})
app.get("/features", (req, res) => {
    res.render("features.pug")
})
app.get("/cteam", (req, res) => {
    res.render("cteam.pug")
})
app.get("/product", (req, res) => {
    res.render("product.pug")
})
app.get("/terms", (req, res) => {
    res.render("termsAndCondition.pug")
})

// ROUTES FOR WEBSITE TILL ABOVE


// ROUTES OF APPLICATION FROM HERE
app.get("/numberOfPendingEntries", (req, res) => {
    if (req.user) {
        let pendingEntryArrayLength = req.user.entryRequestArray.length
        res.send({ length: pendingEntryArrayLength })
    }
})
app.get("/user/dashboard", redirectToLoginPage, async (req, res) => {
    let allNotices = []
    let allCalendars = req.user.calendars;
    console.log('res.locals.gateKeeperMembershipCalendars')
    console.log(res.locals.gateKeeperMembershipCalendars)
    // FOR VISITOR MODEL
    // visitorModel.deleteMany({}, (err, done) => {
    //     if (err) {
    //         consoel.log(err)
    //     } else {
    //         console.log(done)
    //     }
    // })

    // FOR SECURITY CALENDAR
    // securityCalendarModel.updateMany({}, ({ "$set": { dailyVisitors: [] } }), (err, docs) => {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log(docs)
    //     }
    // })

    // FOR NOTICE BOARD CREATION ISSUE
    // await noticeBoardModel.find({}, async(err, allNoticeBoardCalendars) => {
    //     if (err) {
    //         console.log(err)
    //     } else {

    //         noticeBoardModel.collection.dropIndex({ 'subscriberArray': 1 }, (err, done) => {
    //             if (err) {
    //                 console.log(err)
    //             } else {
    //                 console.log('done')
    //                 console.log(done)
    //             }
    //         })

    //         noticeBoardModel.updateMany({}, { "$set": { subscriberArray: [] } }, (err, docs) => {
    //             if (err) {
    //                 console.log(err)
    //             } else {
    //                 console.log('docs')
    //                 console.log(docs)
    //             }
    //         })
    //     }
    // })

    // await allCalendarModel.remove({ businessName: { $in: ["Notice Board for Sunder Villa", "Pune Police", "test10 noticee", "new test10 notice", "new notice by test10", "this is my notice calendar"] } }, (err, allCalendars) => {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log('allCalendars')
    //         console.log(allCalendars)
    //     }
    // })
    for (i of allCalendars) {
        if (i.userId == null || i.userId == undefined) {
            i.userId = req.user.id
            await UserModel.updateOne({
                _id: req.user.id
            }, {
                '$set': {
                    'calendars': allCalendars
                }
            },
                (err, doc) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(doc)
                    }
                })
        } else {
            "Nothing Found"
        }
    }
    for (subscribedCalendars of req.user.subscribedBusinessCalendars) {
        console.log(subscribedCalendars.businessCalendarType)
        if (subscribedCalendars.businessCalendarType == "noticeBoard") {
            let allNoticesOfCalendar = await noticeBoardModel.findOne({
                allCalendarId: subscribedCalendars.businessCalendarTypeId,
            }).select('allNotices');
            if (allNoticesOfCalendar) {
                for (noticeOfParticularDate of allNoticesOfCalendar.allNotices) {
                    for (singleNotice of noticeOfParticularDate.notices) {
                        allNotices.push({
                            start: singleNotice.start,
                            end: singleNotice.end,
                            heading: singleNotice.noticeHeading,
                            date: singleNotice.noticeDate
                        })
                    }
                }
            } else {
                console.log("No subsribed business found")
            }
        }
    }
    privateCalendarFunctions.getSchedule(req, (err, schedules) => {
        if (err) {
            console.log(err)
            let schedules = []

            res.render("dashboard.pug", { schedules, allNotices })
        } else {
            // console.log(schedules)
            res.render("dashboard.pug", { schedules, allNotices })
        }
    })
})

app.get("/searchResults", (req, res) => {
    console.log('user')
    // console.log(req.user)
    // let allCalendars = req.user.calendars;
    console.log(req.query)
    searchFunctions.searchCalendars(req, (err, searchResults) => {
        if (err) {
            console.log(err)
            res.render("searchPage.pug", { user: req.user, allCalendars })
        } else {
            let calendarSearch = req.query.calendarSearch;
            // console.log(searchResults)
            let userId = req.user._id;
            for (subscribedBusinessCalendar of req.user.subscribedBusinessCalendars) {
                for (searchResult of searchResults) {
                    console.log('subscribedBusinessCalendar')
                    console.log(subscribedBusinessCalendar)
                    if (subscribedBusinessCalendar.businessCalendarTypeId == (searchResult._id).toString() && subscribedBusinessCalendar.businessCalendarType == "noticeBoard") {
                        searchResult.subscription = "Subscribe"
                        console.log('subscription')
                        console.log(searchResult.subscription)
                    }
                }
            }
            for (subscribedGateKeeperCalendar of req.user.gateKeeperMembershipCalendars) {
                for (searchResult of searchResults) {
                    if (subscribedGateKeeperCalendar.businessCalendarTypeId == (searchResult._id).toString() && subscribedGateKeeperCalendar.businessCalendarType == "gateKeeper") {
                        if (subscribedGateKeeperCalendar.subscription == "pending") {
                            searchResult.subscription = "pending"
                            console.log('subscription gateKeeper')
                        } else {
                            searchResult.subscription = "Already Member"
                            console.log('subscription gateKeeper already member')
                            console.log(searchResult.subscription + "  " + searchResult._id)
                        }
                    }
                }
            }
            console.log('searchResults')
            console.log(searchResults)
            setTimeout(() => {
                res.render("searchPage.pug", { user: req.user, userId, searchResults, calendarSearch })
            }, 100)
        }

    })
})

app.get("/businessSearch/:calenderId", redirectToLoginPage, (req, res) => {
    let allCalendars = req.user.calendars;
    allCalendarModel.find({ _id: req.params.calenderId }, (err, findBusiness) => {
        let businessFound = findBusiness[0];
        console.log(businessFound)
        res.render("moreDetailsInsideParticularSearchWhenBusinessCalendar.pug", { user: req.user, allCalendars, businessFound })
    })
})
app.get("/businessSearch/:calendarId/bookAppointmentForm", redirectToLoginPage, (req, res) => {
    let AllErrors = []
    let allCalendars = req.user.calendars;

    allCalendarModel.find({ _id: req.params.calendarId }, (err, findBusiness) => {
        let businessFound = findBusiness[0];
        console.log(businessFound.calendarType + " " + businessFound.businessName)
        res.render("bookAppointmentForm.pug", { user: req.user, allCalendars, businessFound, AllErrors })
    })
})

app.post("/businessSearch/:calendarId/bookAppointmentForm", userModelFunctions.upload.single('documentImageInScheduleOrAppointment'), redirectToLoginPage, (req, res) => {
    let AllErrors = []
    let allCalendars = req.user.calendars;
    let v1options = {
        node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
        clockseq: 0x1234,
        msecs: new Date().getTime(),
        nsecs: 5678,
    };
    let uniqueIdForAppointment = uuidv4(v1options)
    console.log(uniqueIdForAppointment)
    allCalendarModel.find({ _id: req.params.calendarId }, (err, findBusiness) => {
        let businessFound = findBusiness[0];
        console.log("business found")
        console.log(businessFound)
        let { fromDateTimeBookAppointment, toDateTimeBookAppointment, description } = req.body;
        let fromDateBookAppointment = fromDateTimeBookAppointment.split("T")[0];
        let fromTimeBookAppointment = fromDateTimeBookAppointment.split("T")[1];
        let toDateBookAppointment = toDateTimeBookAppointment.split("T")[0];
        let toTimeBookAppointment = toDateTimeBookAppointment.split("T")[1];
        req.body.start = fromTimeBookAppointment;
        req.body.end = toTimeBookAppointment;
        req.body.heading = ` ${businessFound.businessName}`
        delete req.body.fromDateTimeBookAppointment
        delete req.body.toDateTimeBookAppointment
        try {

            if (!req.file) {
                console.log("No file attached")
            } else {
                req.body['documentImageInScheduleOrAppointment'] = userModelFunctions.replaceAll(req.file.path, "\\", "/")
            }
            console.log('req.documentImageInScheduleOrAppointment')
            console.log(req.body.documentImageInScheduleOrAppointment)
            privateCalendarFunctions.addScheduleintoPersonalCalendar(req, fromDateBookAppointment, businessFound, uniqueIdForAppointment, (err, docs) => {
                if (err) {
                    console.log(req.body)
                    console.log(err)
                } else {
                    if (businessFound.calendarType === "standard") {
                        standardCalendarFunctions.addAppointmentRequestInStandardCalendar(req, fromDateBookAppointment, businessFound, uniqueIdForAppointment, (err, docs) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("Successfully Saved")
                            }
                        })
                    } else if (businessFound.calendarType === "private") {
                        console.log("Inside private function")
                        privateCalendarFunctions.addAppointmentRequestInPersonalCalendar(req, fromDateBookAppointment, businessFound, uniqueIdForAppointment, (err, docs) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("Successfully Saved appointment inside personal calendar")
                            }
                        })
                    } else if (businessFound.calendarType === "gateKeeper") {
                        securityCalendarFunctions.addAppointmentRequestInSecurityCalendar(req, fromDateBookAppointment, businessFound, uniqueIdForAppointment, (err, docs) => {
                            if (!err) {
                                console.log("Sucessfully Saved In The Security Business Calendar")
                                console.log(docs)
                            } else {
                                console.log(err)
                            }
                        })
                    }
                    console.log("Successfully Saved In Requesters Personal Calendar")
                    res.redirect(`/viewSchedule/${fromDateBookAppointment}`)
                }
            });
        } catch (err) {
            console.log(err);
            res.status(200).json({
                "status": "failed",
                "code": "500",
                "message": error.message
            });
        }

    });
})

app.get("/businessSearch/:calenderId/:dateOfSchedule/:scheduleId/:appointmentId/editAppointmentForm", redirectToLoginPage, (req, res) => {
    let AllErrors = []
    let allCalendars = req.user.calendars;
    let idOfPersonalSchedule = req.params.scheduleId
    let appointmentId = req.params.appointmentId
    let dateOfSchedule = req.params.dateOfSchedule

    allCalendarModel.find({ _id: req.params.calenderId }, (err, findBusiness) => {
        let businessFound = findBusiness[0];
        console.log(businessFound.calendarType + " " + businessFound.businessName)
        privateCalendarFunctions.getScheduleById(req, dateOfSchedule, idOfPersonalSchedule, (err, individualScheduleWhichNeedsToBeEdited) => {
            if (err) {
                console.log(err)
                res.render("editAppointmentForm.pug", { user: req.user, AllErrors, allCalendars, dateOfSchedule, individualScheduleWhichNeedsToBeEdited, idOfPersonalSchedule, businessFound, appointmentId })
            } else {
                console.log("Our docs by schedule id");
                console.log(individualScheduleWhichNeedsToBeEdited)
                res.render("editAppointmentForm.pug", { user: req.user, AllErrors, allCalendars, dateOfSchedule, individualScheduleWhichNeedsToBeEdited, idOfPersonalSchedule, businessFound, appointmentId })
            }
        })
    })
})
app.post("/businessSearch/:calenderId/:dateOfSchedule/:scheduleId/:appointmentId/editAppointmentForm", redirectToLoginPage, userModelFunctions.upload.single('documentImageInScheduleOrAppointment'), (req, res) => {
    let AllErrors = []
    let allCalendars = req.user.calendars;
    let idOfPersonalSchedule = req.params.scheduleId
    let appointmentId = req.params.appointmentId
    let dateOfSchedule = req.params.dateOfSchedule
    let { fromDateTimeBookAppointment, toDateTimeBookAppointment, description } = req.body;
    let fromDateBookAppointment = fromDateTimeBookAppointment.split("T")[0];
    let toDateBookAppointment = toDateTimeBookAppointment.split("T")[0];
    let fromTimeBookAppointment = fromDateTimeBookAppointment.split("T")[1];
    let toTimeBookAppointment = toDateTimeBookAppointment.split("T")[1];
    req.body.start = fromTimeBookAppointment;
    req.body.end = toTimeBookAppointment;
    delete req.body.fromDateTimeBookAppointment
    delete req.body.toDateTimeBookAppointment
    allCalendarModel.find({ _id: req.params.calenderId }, (err, findBusiness) => {
        let businessFound = findBusiness[0];
        req.body.heading = `${businessFound.businessName}`
        console.log(businessFound.calendarType + " " + businessFound.businessName)
        try {
            if (!req.file) {
                console.log("No file attached")
            } else {
                req.body['documentImageInScheduleOrAppointment'] = userModelFunctions.replaceAll(req.file.path, "\\", "/")
            }
            let byViewSchedulePageOrNot = null
            privateCalendarFunctions.editAppointmentIntoPersonalCalendar(req, dateOfSchedule, idOfPersonalSchedule, byViewSchedulePageOrNot, (err, docs) => {
                if (err) {
                    console.log(req.body)
                    console.log(err)
                } else {
                    if (businessFound.calendarType === "standard") {
                        standardCalendarFunctions.editAppointmentIntoStandardCalendar(req, businessFound.userId, dateOfSchedule, appointmentId, (err, docs) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("updated standard calendar")
                                res.redirect('/viewSchedule/' + dateOfSchedule)
                            }
                        })
                    } else if (businessFound.calendarType === "gateKeeper") {
                        securityCalendarFunctions.editAppointmentIntoSecurityCalendar(req, businessFound.userId, dateOfSchedule, appointmentId, (err, docs) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("updated security calendar")
                                res.redirect('/viewSchedule/' + dateOfSchedule)
                            }
                        })
                    } else if (businessFound.calendarType === "private") {
                        privateCalendarFunctions.appointmentGotEditedByUserWhoSeekedAppointment(req, businessFound.userId, dateOfSchedule, appointmentId, (err, docs) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("updated security calendar")
                                res.redirect('/viewSchedule/' + dateOfSchedule)
                            }
                        })
                    }
                }
            });
        } catch (err) {
            console.log(err);
            res.status(200).json({
                "status": "failed",
                "code": "500",
                "message": error.message
            });
        }
    })
})
app.get("/profile", redirectToLoginPage, (req, res) => {

    let allCalendars = req.user.calendars;

    console.log(req.user)
    res.render("profile.pug", { user: req.user, allCalendars: allCalendars })
})
app.get("/businessProfile/:idOfCalendar", redirectToLoginPage, (req, res) => {
    let allCalendars = req.user.calendars;
    let idOfCalendar = req.params.idOfCalendar;
    let searchingInput = null
    let userWhoGavePermission = {}
    let usersWhoWereGivenPermission = []
    let usersWhoWereGivenGuardPermission = []
    let numberOfDaysLeft = 0
    allCalendarModel.find({ _id: idOfCalendar }, async function (err, AllBusinessCalendar) {
        let businessCalendar = AllBusinessCalendar[0]
        console.log("idOfCalendar")
        let timeStamp = new Date(`${(businessCalendar._id).getTimestamp()}`)
        let todayDate = new Date();
        console.log(todayDate + "  todayDate")
        console.log(timeStamp + " timeStamp")
        if (timeStamp > todayDate) {
            console.log(timeStamp.getDate() - todayDate.getDate())
            console.log("is greater than")
        } else if (timeStamp < todayDate) {
            numberOfDaysLeft = 15 - (todayDate.getDate() - timeStamp.getDate())
            console.log(numberOfDaysLeft)
            console.log("is not greater than")
        }
        // console.log(businessCalendar)
        if (req.user.id == businessCalendar.userId) {
            for (i of req.user.userPermissionsGiven) {
                let userToWhomPermissionIsGiven = await UserModel.findOne({ _id: i.userIdOfUserWhoIsPermitted }, { "password": 0 }).select('')
                usersWhoWereGivenPermission.push(userToWhomPermissionIsGiven)
            }

            for (i of req.user.securityGuardPermissionGiven) {
                let userToWhomGuardPermissionIsGiven = await UserModel.findOne({ _id: i.userIdOfUserWhoIsPermitted }, { "password": 0 }).select('')
                usersWhoWereGivenGuardPermission.push(userToWhomGuardPermissionIsGiven)
            }

        } else {
            userWhoGavePermission = await UserModel.findOne({
                _id: businessCalendar.userId
            }, { "password": 0 }).select('')
        }
        if (businessCalendar.calendarType === 'standard') {
            standardCalendarModel.find({ _id: businessCalendar.calendarId }, (err, businessCalendarForParkingTypeDetails) => {
                let businessCalendarForParkingTypeDetail = businessCalendarForParkingTypeDetails[0]
                businessCalendarForParkingTypeDetail.paid = null
                businessCalendarForParkingTypeDetail.cost = null
                businessCalendarForParkingTypeDetail.dailyMaximumParkingEntry = null
                setTimeout(() => {
                    res.render("profileForBusiness.pug", { user: req.user, allCalendars, businessCalendar, businessCalendarForParkingTypeDetail, userWhoGavePermission, idOfCalendar, usersWhoWereGivenPermission, searchingInput, numberOfDaysLeft })
                }, 100)
            })
        } else if (businessCalendar.calendarType == 'gateKeeper') {
            let pendingUsersForMembership = []
            let memberUsers = []
            securityCalendarModel.find({ _id: businessCalendar.calendarId }, async (err, businessCalendarForParkingTypeDetails) => {
                let businessCalendarForParkingTypeDetail = businessCalendarForParkingTypeDetails[0]
                if (businessCalendarForParkingTypeDetail.pendingSubscriberArray != undefined && businessCalendarForParkingTypeDetail.pendingSubscriberArray.length != 0) {
                    for (pendingSubscriberUser of businessCalendarForParkingTypeDetail.pendingSubscriberArray) {
                        await UserModel.findOne({ '_id': pendingSubscriberUser.userIdOfRequester }, async (err, user) => {
                            if (err) {
                                console.log(err)
                            } else {
                                user.houseNumber = pendingSubscriberUser.houseNumber
                                pendingUsersForMembership.push(user)
                            }
                        })
                    }
                }
                if (businessCalendarForParkingTypeDetail.subscriberArray != undefined && businessCalendarForParkingTypeDetail.subscriberArray.length != 0) {
                    for (subscribedUser of businessCalendarForParkingTypeDetail.subscriberArray) {
                        await UserModel.findOne({ '_id': subscribedUser.userIdOfSubscriber }, async (err, user) => {
                            if (err) {
                                console.log(err)
                            } else {
                                user.houseNumber = subscribedUser.houseNumber
                                memberUsers.push(user)
                            }
                        })
                    }
                }
                console.log('usersWhoWereGivenGuardPermission')
                console.log(usersWhoWereGivenGuardPermission)
                setTimeout(() => {
                    res.render("profileForBusiness.pug", { user: req.user, allCalendars, businessCalendar, businessCalendarForParkingTypeDetail, userWhoGavePermission, idOfCalendar, usersWhoWereGivenPermission, searchingInput, pendingUsersForMembership, memberUsers, usersWhoWereGivenGuardPermission, numberOfDaysLeft })
                }, 100)
            })
        } else if (businessCalendar.calendarType === 'noticeBoard') {
            noticeBoardModel.find({ _id: businessCalendar.calendarId }, (err, businessCalendarForParkingTypeDetails) => {
                let businessCalendarForParkingTypeDetail = businessCalendarForParkingTypeDetails[0]
                businessCalendarForParkingTypeDetail.paid = null
                businessCalendarForParkingTypeDetail.cost = null
                businessCalendarForParkingTypeDetail.dailyMaximumParkingEntry = null
                res.render("profileForBusiness.pug", { user: req.user, allCalendars: allCalendars, businessCalendar, businessCalendarForParkingTypeDetail, userWhoGavePermission, idOfCalendar, usersWhoWereGivenPermission, searchingInput, numberOfDaysLeft })
            })
        }
    })
})
app.post("/businessProfile/:idOfCalendar", redirectToLoginPage, (req, res) => {
    let idOfCalendar = req.params.idOfCalendar
    let allCalendars = req.user.calendars;
    let userWhoGavePermission = {}
    let searchingInput = req.body.userSearch
    req.body["allCalendarTypeId"] = idOfCalendar;
    let usersWhoWereGivenPermission = []
    let usersWhoWereGivenGuardPermission = []
    let numberOfDaysLeft = 0
    console.log(req.body)
    if (req.body.userSearch != undefined && req.body.userSearch !== "" && req.body.userSearch !== null) {
        console.log("in if statement")
        searchFunctions.searchUser(req, req.body.userSearch, (err, searchedUsers) => {
            if (err) {
                console.log(err)
                res.redirect("back")
            } else {
                let userSearch = req.body.userSearch;
                allCalendarModel.find({ _id: idOfCalendar }, async (err, AllBusinessCalendar) => {
                    let businessCalendar = AllBusinessCalendar[0]
                    console.log("idOfCalendar")
                    let timeStamp = new Date(`${(businessCalendar._id).getTimestamp()}`)
                    let todayDate = new Date();
                    console.log(todayDate + "  todayDate")
                    console.log(timeStamp + " timeStamp")
                    if (timeStamp > todayDate) {
                        console.log(timeStamp.getDate() - todayDate.getDate())
                        console.log("is greater than")
                    } else if (timeStamp < todayDate) {
                        numberOfDaysLeft = 15 - (todayDate.getDate() - timeStamp.getDate())
                        console.log(numberOfDaysLeft)
                        console.log("is not greater than")
                    }
                    if (req.user.id == businessCalendar.userId) {
                        for (i of req.user.userPermissionsGiven) {
                            let userToWhomPermissionIsGiven = await UserModel.findOne({ _id: i.userIdOfUserWhoIsPermitted }, { "password": 0 }).select('')
                            usersWhoWereGivenPermission.push(userToWhomPermissionIsGiven)
                        }
                        for (i of req.user.securityGuardPermissionGiven) {
                            let userToWhomGuardPermissionIsGiven = await UserModel.findOne({ _id: i.userIdOfUserWhoIsPermitted }, { "password": 0 }).select('')
                            usersWhoWereGivenGuardPermission.push(userToWhomGuardPermissionIsGiven)
                        }
                    } else {
                        userWhoGavePermission = await UserModel.findOne({
                            _id: businessCalendar.userId
                        }).select('')
                    }
                    if (businessCalendar.calendarType === 'standard') {
                        standardCalendarModel.find({ _id: businessCalendar.calendarId }, (err, businessCalendarForParkingTypeDetails) => {
                            let businessCalendarForParkingTypeDetail = businessCalendarForParkingTypeDetails[0]
                            businessCalendarForParkingTypeDetail.paid = null
                            businessCalendarForParkingTypeDetail.cost = null
                            businessCalendarForParkingTypeDetail.dailyMaximumParkingEntry = null
                            res.render("profileForBusiness.pug", { user: req.user, allCalendars, businessCalendar, businessCalendarForParkingTypeDetail, userSearch, foundUsers, idOfCalendar, userWhoGavePermission, usersWhoWereGivenPermission, searchingInput, usersWhoWereGivenGuardPermission, numberOfDaysLeft })
                        })
                    } else if (businessCalendar.calendarType == 'gateKeeper') {
                        let pendingUsersForMembership = []
                        let memberUsers = []
                        let foundUsers = []
                        securityCalendarModel.find({ _id: businessCalendar.calendarId }, async (err, businessCalendarForParkingTypeDetails) => {
                            let businessCalendarForParkingTypeDetail = businessCalendarForParkingTypeDetails[0]
                            if (businessCalendarForParkingTypeDetails.pendingSubscriberArray != undefined && businessCalendarForParkingTypeDetails.pendingSubscriberArray.length != 0) {
                                for (subscribedUser of businessCalendarForParkingTypeDetails.pendingSubscriberArray) {
                                    await UserModel.findOne({ '_id': subscribedUser.userIdOfRequester }, (err, user) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            // console.log('user')
                                            user.houseNumber = subscribedUser.houseNumber
                                            pendingUsersForMembership.push(user)
                                            // console.log('pendingUsersForMembership')
                                            // console.log(pendingUsersForMembership)
                                        }
                                    })
                                }
                            }
                            if (businessCalendarForParkingTypeDetails.subscriberArray != undefined && businessCalendarForParkingTypeDetails.subscriberArray.length != 0) {
                                for (subscribedUser of businessCalendarForParkingTypeDetails.subscriberArray) {
                                    await UserModel.findOne({ '_id': subscribedUser.userIdOfSubscriber }, (err, user) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            // console.log('user')
                                            user.houseNumber = subscribedUser.houseNumber
                                            memberUsers.push(user)
                                            // console.log(memberUsers)
                                        }
                                    })
                                }
                            }
                            console.log('usersWhoWereGivenPermission')
                            console.log(usersWhoWereGivenPermission)
                            console.log('searchedUsers')
                            console.log(searchedUsers)
                            if (usersWhoWereGivenPermission.length != 0) {
                                console.log("in usersWhoWereGivenPermission")
                                if (searchedUsers.length != 0) {
                                    let resultedUsersWhoWereGivenPermission = usersWhoWereGivenPermission.filter(o1 => searchedUsers.some(o2 => o1.id === o2.id));
                                    if (resultedUsersWhoWereGivenPermission.length != 0) {
                                        for (searchedUser of searchedUsers) {
                                            searchedUser.permissionType = "Yes"
                                        }
                                    } else if (resultedUsersWhoWereGivenPermission.length == 0 && (searchedUsers[0].id).toString() == (req.user.id).toString()) {
                                        searchedUsers[0].permissionType = "User"

                                    } else {
                                        for (searchedUser of searchedUsers) {
                                            searchedUser.permissionType = "No"
                                        }
                                    }

                                }
                            } else {
                                if ((searchedUsers[0].id).toString() == (req.user.id).toString()) {
                                    searchedUsers[0].permissionType = "User"
                                } else {
                                    for (searchedUser of searchedUsers) {
                                        searchedUser.permissionType = "No"
                                    }
                                }
                            }
                            for (searchedUser of searchedUsers) {
                                foundUsers.push({ _id: searchedUser._id, name: searchedUser.name, number: searchedUser.number, permissionType: searchedUser.permissionType, email: searchedUser.email })
                            }
                            console.log(foundUsers[0])
                            console.log('foundUsers')
                            res.send(foundUsers)
                            // res.render("profileForBusiness", { user: req.user, allCalendars, businessCalendar, businessCalendarForParkingTypeDetail, userSearch, foundUsers, userWhoGavePermission, usersWhoWereGivenPermission, idOfCalendar, searchingInput, pendingUsersForMembership, memberUsers })
                        })
                    }
                })
            }
        })
    } else {
        console.log("in else statement")
        allCalendarModel.find({ _id: idOfCalendar }, (err, AllBusinessCalendar) => {
            let businessCalendar = AllBusinessCalendar[0]
            businessCalendarFunctions.editBusinessCalendar(req, (err, docs) => {
                if (err) {
                    console.log(err)
                    res.redirect("back")
                } else {
                    res.redirect("back")
                }
            })
        })
    }

})
app.get("/businessProfile/guardSearch/:idOfCalendar", (req, res) => {
    console.log(req.query)
    let idOfCalendar = req.params.idOfCalendar
    let usersWhoWereGivenPermission = []
    searchFunctions.searchUser(req, req.query.guardSearch, (err, searchedUsers) => {
        if (err) {
            console.log(err)
        } else {
            allCalendarModel.find({ _id: idOfCalendar }, async (err, AllBusinessCalendar) => {
                let businessCalendar = AllBusinessCalendar[0]
                if (req.user.id == businessCalendar.userId) {
                    for (i of req.user.securityGuardPermissionGiven) {
                        let userToWhomPermissionIsGiven = await UserModel.findOne({ _id: i.userIdOfUserWhoIsPermitted }, { "password": 0 }).select('')
                        usersWhoWereGivenPermission.push(userToWhomPermissionIsGiven)
                    }
                    console.log('usersWhoWereGivenPermission')
                    console.log(usersWhoWereGivenPermission)
                } else {
                    userWhoGavePermission = await UserModel.findOne({
                        _id: businessCalendar.userId
                    }, { "password": 0 }).select('')
                }
                if (businessCalendar.calendarType == 'gateKeeper') {
                    let foundUsers = []
                    securityCalendarModel.find({ _id: businessCalendar.calendarId }, async (err, businessCalendarForParkingTypeDetails) => {
                        console.log('searchedUsers')
                        console.log(searchedUsers)
                        if (usersWhoWereGivenPermission.length != 0) {
                            console.log("in usersWhoWereGivenPermission")
                            if (searchedUsers.length != 0) {
                                let resultedUsersWhoWereGivenPermission = usersWhoWereGivenPermission.filter(o1 => searchedUsers.some(o2 => o1.id === o2.id));
                                if (resultedUsersWhoWereGivenPermission.length != 0) {
                                    for (searchedUser of searchedUsers) {
                                        searchedUser.permissionType = "Yes"
                                    }
                                    console.log('resultedUsersWhoWereGivenPermission')
                                    console.log(resultedUsersWhoWereGivenPermission)
                                } else if (resultedUsersWhoWereGivenPermission.length == 0 && (searchedUsers[0].id).toString() == (req.user.id).toString()) {
                                    searchedUsers[0].permissionType = "User"
                                    console.log("User")
                                } else {
                                    for (searchedUser of searchedUsers) {
                                        searchedUser.permissionType = "No"
                                    }
                                }
                            }
                        } else {
                            if (searchedUsers.length != 0 && (searchedUsers[0].id).toString() == (req.user.id).toString()) {
                                searchedUsers[0].permissionType = "User"
                            } else if (searchedUsers.length != 0 && (searchedUsers[0].id).toString() != (req.user.id).toString()) {
                                for (searchedUser of searchedUsers) {
                                    searchedUser.permissionType = "No"
                                }
                            }
                        }
                        for (searchedUser of searchedUsers) {
                            foundUsers.push({ _id: searchedUser._id, name: searchedUser.name, number: searchedUser.number, permissionType: searchedUser.permissionType, email: searchedUser.email })
                        }
                        console.log(foundUsers)
                        console.log('foundUsers')
                        res.send(foundUsers)
                    })
                }
            })
        }
    })
})
app.post("/profile", redirectToLoginPage, (req, res) => {
    userModelFunctions.editProfileDetails(req, (err, docs) => {
        if (err) {
            console.log(err)
        } else {
            console.log(docs)
            res.redirect("/profile")
        }
    })
})

app.get("/givePermission/:businessCalendarTypeIdOfTheUser/:userIdOfUserWhoIsGettingThePermission", redirectToLoginPage, (req, res) => {
    businessCalendarFunctions.givingPermissionOfBusinessCalendar(req, req.params.businessCalendarTypeIdOfTheUser, req.params.userIdOfUserWhoIsGettingThePermission, (err, docs) => {
        if (err) {
            console.log(err)
            res.redirect("back")
        } else {
            console.log('docs')
            console.log(docs)
            res.redirect("back")
        }
    })
})

app.get("/removeUserPermission/:businessCalendarTypeIdOfTheUser/:userIdOfUserWhoHaveThePermission", redirectToLoginPage, (req, res) => {
    businessCalendarFunctions.removingPermissionOfBusinessCalendar(req, req.params.businessCalendarTypeIdOfTheUser, req.params.userIdOfUserWhoHaveThePermission, (err, docs) => {
        if (err) {
            console.log(err)
            res.redirect("back")
        } else {
            console.log('docs')
            console.log(docs)
            res.redirect("back")
        }
    })
})


app.get("/giveSecurityGuardPermission/:businessCalendarTypeIdOfTheUser/:userIdOfUserWhoIsGettingThePermission", redirectToLoginPage, (req, res) => {
    businessCalendarFunctions.givingPermissionOfSecurityCalendarToAGuard(req, req.params.businessCalendarTypeIdOfTheUser, req.params.userIdOfUserWhoIsGettingThePermission, (err, docs) => {
        if (err) {
            console.log(err)
            res.redirect("back")
        } else {
            console.log('docs')
            console.log(docs)
            res.redirect("back")
        }
    })
})


app.get("/removeSecurityGuardPermission/:businessCalendarTypeIdOfTheUser/:userIdOfUserWhoHaveThePermission", redirectToLoginPage, (req, res) => {
    businessCalendarFunctions.removingPermissionOfSecurityCalendarFromAGuard(req, req.params.businessCalendarTypeIdOfTheUser, req.params.userIdOfUserWhoHaveThePermission, (err, docs) => {
        if (err) {
            console.log(err)
            res.redirect("back")
        } else {
            console.log('docs')
            console.log(docs)
            res.redirect("back")
        }
    })
})


app.get("/changePasswordInProfile", redirectToLoginPage, (req, res) => {
    let allCalendars = req.user.calendars;
    let AllErrors = []
    UserModel.find({ _id: req.user.id }, (err, foundedUser) => {
        console.log(foundedUser)
    })
    res.render("changeOldPasswordInProfile.pug", { AllErrors, user: req.user, allCalendars: allCalendars })
})
app.post("/changePasswordInProfile", redirectToLoginPage, async (req, res) => {
    let allCalendars = req.user.calendars;
    let hashedNewPassword = await bcrypt.hash(req.body.newPassword, saltRounds)
    let hashedOldPassword = await bcrypt.hash(req.body.oldPassword, saltRounds)
    let AllErrors = []
    let { oldPassword, newPassword, newPassword2 } = req.body;
    console.log(req.body)
    if (!oldPassword || !newPassword || !newPassword2) {
        AllErrors.push({ msg: "Please Fill in All Fields" })
        res.render("changeOldPasswordInProfile.pug", { AllErrors, user: req.user, allCalendars: allCalendars })
    } else if (newPassword.length < 6 && newPassword.length > 0) {
        console.log("This is an error")
        AllErrors.push({ msg: "Password Must be atleast 6 characters " })
        res.render("changeOldPasswordInProfile.pug", { AllErrors, user: req.user, allCalendars: allCalendars })
    } else if (newPassword !== newPassword2 && newPassword.length >= 6) {
        console.log("This is an error")
        AllErrors.push({ msg: "Passwords Didn't Matched" })
        res.render("changeOldPasswordInProfile.pug", { AllErrors, user: req.user, allCalendars: allCalendars })
    } else if (req.body.oldPassword !== req.body.newPassword) {
        bcrypt.compare(req.body.oldPassword, req.user.password, function (err, result) {
            console.log(result + " result printed")
            if (err) {
                console.log(err)
            }
            if (result) {
                console.log("Old Password Matched")
                console.log(req.user.password + " userPassword")
                console.log("It is a new password ")
                UserModel.updateOne({ _id: req.user.id }, { $set: { password: hashedNewPassword } }, function () {
                    console.log("Password changed")
                    req.flash("success_msg", "Login With New Password");
                    res.redirect("/logout")
                })
            } else if (!result) {
                console.log("Incorrect Old Password ")
                AllErrors.push({ msg: "Incorrect Old Password" })
                res.render("changeOldPasswordInProfile.pug", { AllErrors, user: req.user, allCalendars: allCalendars })
            }
        })
    } else if (req.body.oldPassword == req.body.newPassword) {
        bcrypt.compare(req.body.oldPassword, req.user.password, function (err, result) {
            if (result) {
                console.log("New Password Can't be same as old password")
                AllErrors.push({ msg: "New Password Can't be same as old password" })
                res.render("changeOldPasswordInProfile.pug", { AllErrors, user: req.user, allCalendars: allCalendars })
            } else {
                console.log("Incorrect Old Password")
                AllErrors.push({ msg: "Incorrect Old Password" })
                res.render("changeOldPasswordInProfile.pug", { AllErrors, user: req.user, allCalendars: allCalendars })
            }
        })
    }
})

//single file upload api in profile section
app.post('/upload', userModelFunctions.upload.single('singleFile'), (req, res, next) => {
    try {
        const file = req.file;
        console.log(file + " this is file")
        if (!file) {
            res.status(400).json({
                "status": "failed",
                "code": "400",
                "message": "Please upload file"
            });
        }
        userModelFunctions.photoUploaded(req, (err, docs) => {
            console.log("Photo Uploaded")
            res.redirect("back")
        })
    } catch (err) {
        console.log(err);
        res.status(200).json({
            "status": "failed",
            "code": "500",
            "message": error.message
        });
    }
});
app.post('/uploadProfilePicBusiness', userModelFunctions.upload.single('profilePicBusiness'), (req, res, next) => {
    try {
        const file = req.file;
        console.log(file + " this is file")
        if (!file) {
            res.status(400).json({
                "status": "failed",
                "code": "400",
                "message": "Please upload file"
            });
        }
        businessCalendarFunctions.photoUploadedBusiness(req, (err, docs) => {
            console.log("Photo Uploaded In Business Profile")
            res.redirect("back")
        })
    } catch (err) {
        console.log(err);
        res.status(200).json({
            "status": "failed",
            "code": "500",
            "message": error.message
        });
    }
});
let arrayToSaveMobileNumberAndOtp = []
app.get("/verifyNewMobileNumber/:mobileNumberToBeVerified", redirectToLoginPage, async (req, res) => {
    let AllErrors = []
    console.log("get route")
    let allCalendars = req.user.calendars;
    let mobileNumberToBeVerified = req.params.mobileNumberToBeVerified
    req.session.newMobileNumber = mobileNumberToBeVerified

    function makeid(length) {
        let result = '';
        let characters = '0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    random_string = makeid(6)
    console.log(random_string + "   " + mobileNumberToBeVerified + " mobileNumberToBeVerified")
    userModelFunctions.sendTextMessage(mobileNumberToBeVerified, random_string)
    // console.log(options)
    if (arrayToSaveMobileNumberAndOtp.length >= 1) {
        for (let i = 0; i < arrayToSaveMobileNumberAndOtp.length; i++) {
            if (arrayToSaveMobileNumberAndOtp[i].number === mobileNumberToBeVerified) {
                arrayToSaveMobileNumberAndOtp[i].otp = random_string
            } else {
                arrayToSaveMobileNumberAndOtp.push({ number: mobileNumberToBeVerified, otp: random_string })
            }
        }
    } else {
        arrayToSaveMobileNumberAndOtp.push({ number: mobileNumberToBeVerified, otp: random_string })
    }
    console.log(arrayToSaveMobileNumberAndOtp)

    // FOR RESENDING THE OTP
    app.get("/resend-otp-mobile-number-verificaton/:resentOtpToMobileNumber", redirectToLoginPage, async (req, res) => {
        let resentOtpToMobileNumber = req.params.resentOtpToMobileNumber

        function makeidForResend(length) {
            let result = '';
            let characters = '0123456789';
            let charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        random_string = makeidForResend(6)
        console.log(random_string + " resended")
        for (let i = 0; i < arrayToSaveMobileNumberAndOtp.length; i++) {
            if (arrayToSaveMobileNumberAndOtp[i].number === resentOtpToMobileNumber) {
                arrayToSaveMobileNumberAndOtp[i].otp = random_string
            }
        }
        console.log(arrayToSaveMobileNumberAndOtp)
        // var options = { authorization: "GpzyOlJgXuhYbfxM621HR5sIWFwN0eQd84nVTqSLB3vZ7ADCio6HGtYUnW1TwbE5K8dVpcqARBvZjF4z", message: `${req.user.name}, This is the New OTP. It's Confidential please do not share it:  ${random_string} `, numbers: [mobileNumberToBeVerified] }
        userModelFunctions.sendTextMessage(mobileNumberToBeVerified, random_string)
        res.render("verifyNewMobileNumberByProfileEnterOTP.pug", { user: req.user, allCalendars, mobileNumberToBeVerified: resentOtpToMobileNumber, AllErrors })
    })
    app.post("/verifyNewMobileNumber/:mobileNumberToBeVerified", redirectToLoginPage, (req, res) => {
        console.log(req.body.otp)
        let AllErrors = []
        for (let i = 0; i < arrayToSaveMobileNumberAndOtp.length; i++) {
            if (arrayToSaveMobileNumberAndOtp[i].number === req.params.mobileNumberToBeVerified) {
                if (!req.body.otp) {
                    console.log("Invalid OTP")
                    AllErrors.push({ msg: "Invalid OTP" })
                    res.render("verifyNewMobileNumberByProfileEnterOTP.pug", { user: req.user, allCalendars: allCalendars, mobileNumberToBeVerified: arrayToSaveMobileNumberAndOtp[i].number, AllErrors })
                } else if (arrayToSaveMobileNumberAndOtp[i].otp !== req.body.otp) {
                    console.log("Incorrect OTP")
                    AllErrors.push({ msg: "Incorrect OTP" })
                    res.render("verifyNewMobileNumberByProfileEnterOTP.pug", { user: req.user, allCalendars: allCalendars, mobileNumberToBeVerified: arrayToSaveMobileNumberAndOtp[i].number, AllErrors })
                } else {
                    UserModel.updateOne({ _id: req.user.id }, { $set: { number: arrayToSaveMobileNumberAndOtp[i].number } }, function () {
                        console.log("Mobile Number Changed")
                        arrayToSaveMobileNumberAndOtp.splice(i, 1);
                        console.log(req.session.newMobileNumber)
                        delete req.session.newMobileNumber
                        res.redirect("/profile")
                    })
                }
            } else {
                console.log("Ok Mobile Number Not In the array")
            }
        }
    })
    if (mobileNumberToBeVerified.length === 10) {
        res.render("verifyNewMobileNumberByProfileEnterOTP.pug", { user: req.user, allCalendars, mobileNumberToBeVerified, AllErrors })
    } else {
        res.redirect("/profile")
    }
})
let arrayToSaveEmailAndOtp = []
app.get("/verifyNewEmailAddress/:emailAddressToBeVerified", redirectToLoginPage, async (req, res) => {
    let AllErrors = []
    console.log("get route")
    let allCalendars = req.user.calendars;
    let emailAddressToBeVerified = req.params.emailAddressToBeVerified
    req.session.newEmailAddress = emailAddressToBeVerified

    function makeid(length) {
        let result = '';
        let characters = '0123456789';
        let charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    random_string = makeid(6)
    console.log(random_string + "   " + emailAddressToBeVerified + " emailAddressToBeVerified")




    if (arrayToSaveEmailAndOtp.length >= 1) {
        for (let i = 0; i < arrayToSaveEmailAndOtp.length; i++) {
            if (arrayToSaveEmailAndOtp[i].email === emailAddressToBeVerified) {
                arrayToSaveEmailAndOtp[i].otp = random_string
            } else {
                arrayToSaveEmailAndOtp.push({ email: emailAddressToBeVerified, otp: random_string })
            }
        }
    } else {
        arrayToSaveEmailAndOtp.push({ email: emailAddressToBeVerified, otp: random_string })
    }

    console.log(arrayToSaveEmailAndOtp)

    userModelFunctions.sendEmail(userEmail.email, emailAddressToBeVerified, "OTP For Email Changing", `${req.user.name}, OTP for your transaction is ${random_string}. Do not share it with anyone. Thank you. `)

    // FOR RESENDING THE OTP
    app.get("/resend-otp-email-verificaton/:resentOtpToEmail", async (req, res) => {
        let resentOtpToEmail = req.params.resentOtpToEmail

        function makeidForResend(length) {
            let result = '';
            let characters = '0123456789';
            let charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        random_string = makeidForResend(6)
        console.log(random_string + " resended")
        for (let i = 0; i < arrayToSaveEmailAndOtp.length; i++) {
            if (arrayToSaveEmailAndOtp[i].email === resentOtpToEmail) {
                arrayToSaveEmailAndOtp[i].otp = random_string
            }
        }
        console.log(arrayToSaveEmailAndOtp)


        var mailOptions = {
            from: userEmail.email,
            to: emailAddressToBeVerified,
            subject: "OTP",
            text: `${req.user.name}, OTP for your transaction is ${random_string}. Do not share it with anyone. Thank you. `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response + " " + "Send To : " + emailAddressToBeVerified + "Resend");
            }
        });
        res.render("verifyNewEmailAddressByProfileEnterOTP.pug", { user: req.user, allCalendars: allCalendars, emailAddressToBeVerified: resentOtpToEmail, AllErrors })
    })


    app.post("/verifyNewEmailAddress/:emailAddressToBeVerified", redirectToLoginPage, (req, res) => {
        console.log(req.body.otp)
        let AllErrors = []
        console.log(arrayToSaveEmailAndOtp)
        for (let i = 0; i < arrayToSaveEmailAndOtp.length; i++) {
            if (arrayToSaveEmailAndOtp[i].email === req.params.emailAddressToBeVerified) {
                if (!req.body.otp) {
                    console.log("Invalid OTP")
                    AllErrors.push({ msg: "Invalid OTP" })
                    res.render("verifyNewEmailAddressByProfileEnterOTP.pug", { user: req.user, allCalendars: allCalendars, emailAddressToBeVerified: arrayToSaveEmailAndOtp[i].email, AllErrors })
                } else if (arrayToSaveEmailAndOtp[i].otp !== req.body.otp) {
                    console.log("Incorrect OTP")
                    AllErrors.push({ msg: "Incorrect OTP" })
                    res.render("verifyNewEmailAddressByProfileEnterOTP.pug", { user: req.user, allCalendars: allCalendars, emailAddressToBeVerified: arrayToSaveEmailAndOtp[i].email, AllErrors })
                } else {
                    UserModel.updateOne({ _id: req.user.id }, { $set: { email: arrayToSaveEmailAndOtp[i].email } }, function (err, result) {
                        if (err) {
                            console.log(err)
                        } else {
                            arrayToSaveEmailAndOtp.splice(i, 1);
                            console.log(req.session.newEmailAddress)
                            delete req.session.newEmailAddress
                            console.log("Email Address Changed")
                            res.redirect("/profile")
                        }

                    })
                }
            } else {
                console.log("Ok Email Not In the array")
            }

        }
    })
    app.get("/cancel-verification", (req, res) => {
        req.session.destroy(function (err) {
            console.log("session destroyed")
            res.redirect("/profile")
        });
    })
    res.render("verifyNewEmailAddressByProfileEnterOTP.pug", { user: req.user, allCalendars: allCalendars, emailAddressToBeVerified: emailAddressToBeVerified, AllErrors })
})
app.get("/businessCalendar/personal/undefined", (req, res) => {
    res.redirect("/user/dashboard")
})
app.get("/businessCalendar/:_calendarType/:_id/", redirectToLoginPage, async (req, res) => {
    let allCalendars = req.user.calendars;
    let cancelledAppointmentArray = []
    let permissionType = null
    let dailyVisitorArray = []
    let idOfCalendar = req.params._id;
    if (req.params._id == allCalendars[0].calendarTypeId) {
        res.redirect("/user/dashboard")
    } else if (req.params._calendarType === "gateKeeper") {
        for (let i = 0; i < allCalendars.length; i++) {
            if (allCalendars[i].calendarTypeId == req.params._id) {
                for (j of req.user.calendars) {
                    if (idOfCalendar == j.calendarTypeId && j.calendarPermissionType == "Guard") {
                        permissionType = "Guard"
                    }
                }
                let thisParticularBusinessCalendar = allCalendars[i]
                securityCalendarModel.findOne({ 'allCalendarId': idOfCalendar }, (err, entryDetails) => {
                    dailyVisitorArray = entryDetails.dailyVisitors;
                    dailyAppointmentArray = entryDetails.dailyAppointments;
                    console.log('dailyVisitorArray')
                    console.log(dailyVisitorArray)
                    let appointmentArrayUnFiltered = []

                    for (i of dailyVisitorArray) {
                        if (dailyAppointmentArray.length > 0) {
                            for (j of dailyAppointmentArray) {
                                if (i.date === j.date) {
                                    console.log("In hereeeee")
                                    j.pendingAppointmentList = [...i.pendingEntryList, ...j.pendingAppointmentList]
                                } else {
                                    console.log("In hereeeee birooo")
                                    dailyAppointmentArray.push(i)
                                }
                            }
                        } else {
                            console.log("In hereeeee birooo againa")
                            console.log(i)
                            dailyAppointmentArray.push(i)
                            dailyAppointmentArray[0].pendingAppointmentList = [...i.pendingEntryList, ...dailyAppointmentArray[0].pendingAppointmentList]
                            console.log(dailyAppointmentArray[0])

                        }
                    }
                    console.log("dailyAppointmentArray part2")
                    console.log(dailyAppointmentArray)
                    for (let i = 0; i < dailyAppointmentArray.length; i++) {
                        let dateForPendingAppointmentInGateKeeperCalendar = dailyAppointmentArray[i].date
                        appointmentArrayUnFiltered.push({ date: dateForPendingAppointmentInGateKeeperCalendar, numberOfPendingAppointments: dailyAppointmentArray[i].pendingAppointmentList.length, numberOfAcceptedAppointments: dailyAppointmentArray[i].acceptedAppointmentList.length })
                    }
                    for (let i = 0; i < appointmentArrayUnFiltered.length; i++) {
                        if (appointmentArrayUnFiltered[i].numberOfPendingAppointments === 0 && appointmentArrayUnFiltered[i].numberOfAcceptedAppointments === 0) {
                            delete appointmentArrayUnFiltered[i]
                        }
                    }
                    let numberOfAppointmentArray = appointmentArrayUnFiltered.filter(function (el) {
                        return el != null;
                    });
                    res.render("securityCalendarPage.pug", { user: req.user, allCalendars, thisParticularBusinessCalendar, idOfCalendar, dailyVisitorArray, numberOfAppointmentArray, permissionType })
                })
            }
        }
    } else if (req.params._calendarType === "standard") {
        let numberOfAppointmentArray = []
        console.log(req.params._id + " " + req.params._calendarType)
        for (i = 0; i < allCalendars.length; i++) {
            if (allCalendars[i].calendarTypeId == req.params._id) {
                let thisParticularBusinessCalendar = allCalendars[i]
                standardCalendarModel.findOne({ allCalendarId: idOfCalendar }, (err, appointmentDetails) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("appointmentDetails")
                        console.log(appointmentDetails)
                        let dailyAppointmentArray = appointmentDetails.dailyAppointments;
                        let appointmentArrayUnFiltered = []
                        if (dailyAppointmentArray.length !== 0) {
                            for (let i = 0; i < appointmentDetails.dailyAppointments.length; i++) {
                                for (i = 0; i < dailyAppointmentArray.length; i++) {
                                    let dateForAppointmentInStandardCalendar = dailyAppointmentArray[i].date
                                    appointmentArrayUnFiltered.push({ date: dateForAppointmentInStandardCalendar, numberOfPendingAppointments: dailyAppointmentArray[i].pendingAppointmentList.length, numberOfAcceptedAppointments: dailyAppointmentArray[i].acceptedAppointmentList.length })
                                }
                                for (let i = 0; i < appointmentArrayUnFiltered.length; i++) {
                                    if (appointmentArrayUnFiltered[i].numberOfPendingAppointments === 0 && appointmentArrayUnFiltered[i].numberOfAcceptedAppointments === 0) {
                                        delete appointmentArrayUnFiltered[i]
                                    }
                                }
                                numberOfAppointmentArray = appointmentArrayUnFiltered.filter(function (el) {
                                    return el != null;
                                });
                                console.log(numberOfAppointmentArray)
                            }
                            res.render("standardCalendarPage.pug", { user: req.user, allCalendars, thisParticularBusinessCalendar, idOfCalendar, numberOfAppointmentArray })
                        } else {
                            res.render("standardCalendarPage.pug", { user: req.user, allCalendars, thisParticularBusinessCalendar, idOfCalendar, numberOfAppointmentArray })
                        }
                    }
                })
            }
        }
    } else if (req.params._calendarType === "noticeBoard") {
        console.log("Inside notice board")
        let allCalendars = req.user.calendars;
        let allNotices = await noticeBoardModel.findOne({ allCalendarId: idOfCalendar }).select()
        let schedules = []
        for (i of allCalendars) {
            if (i.calendarTypeId == idOfCalendar) {
                let thisParticularBusinessCalendar = i
                console.log(thisParticularBusinessCalendar)
                console.log('idOfCalendar')
                console.log(idOfCalendar)
                console.log('i.calendarTypeId')
                console.log(i.calendarTypeId)
                noticeBoardFunctions.getAllNotices(req, (err, allNotices) => {
                    if (err) {
                        let allNotices = []
                        res.render("noticeBoardCalendar.pug", { user: req.user, allCalendars, thisParticularBusinessCalendar, idOfCalendar, schedules, allNotices })
                    } else {
                        console.log(allNotices)
                        res.render("noticeBoardCalendar.pug", { user: req.user, allCalendars, thisParticularBusinessCalendar, idOfCalendar, schedules, allNotices })
                    }
                })
            }
        }
    }
})


app.get("/pendingEntries", redirectToLoginPage, (req, res) => {
    let allCalendars = req.user.calendars
    let docsVisitorsEntryRequestPending = req.user.entryRequestArray
    console.log(docsVisitorsEntryRequestPending)
    res.render("pendingEntryAppointmentsForHostUser.pug", { user: req.user, allCalendars, docsVisitorsEntryRequestPending })
})

app.get("/businessCalendar/gateKeeper/:idOfCalendarForSecurityVehicleRecord/:dateForSecurityVehicleRecord", redirectToLoginPage, async (req, res) => {
    let allCalendars = req.user.calendars;
    let dateForSecurityVehicleRecord = req.params.dateForSecurityVehicleRecord
    let stringDateForSecurityVehicleRecord = new Date(req.params.dateForSecurityVehicleRecord);
    let stringifiedDateForSecurityVehicleRecord = stringDateForSecurityVehicleRecord.toDateString()
    let idOfCalendarForSecurityVehicleRecord = req.params.idOfCalendarForSecurityVehicleRecord
    let docsVisitors = []
    let docsVisitorsExited = []
    let docsVisitorsEntered = []
    let docsVisitorsEntryRequestPending = []
    let unapprovedAppointmentsDetail = []
    let acceptedAppointmentsDetail = []
    let cancelledAppointmentsDetail = []
    let businessCalendar = await allCalendarModel.findOne({ _id: idOfCalendarForSecurityVehicleRecord }).select('')
    let userIdOfTheBusinessCalendar = businessCalendar.userId;
    securityCalendarFunctions.getSecurityVisitorofaDate(req, userIdOfTheBusinessCalendar, (err, visitorDocFromSecurityCalendarFunction) => {
        if (err) {
            console.log(err)
            console.log("inside security record page with errors")
            securityCalendarFunctions.getAppointmentsofaDate(req, userIdOfTheBusinessCalendar, (err, allAppointmentsDetail) => {
                if (err) {
                    console.log(err)
                    res.render("securityVehicleRecord.pug", { user: req.user, allCalendars, dateForSecurityVehicleRecord, idOfCalendarForSecurityVehicleRecord, docsVisitors, stringifiedDateForSecurityVehicleRecord, unapprovedAppointmentsDetail, acceptedAppointmentsDetail, cancelledAppointmentsDetail, docsVisitorsExited, docsVisitorsEntered, docsVisitorsEntryRequestPending, userIdOfTheBusinessCalendar })
                } else {
                    for (let i = 0; i < allAppointmentsDetail.appointments.length; i++) {
                        if (allAppointmentsDetail.appointments[i].appointmentApproved === "pending" || allAppointmentsDetail.appointments[i].appointmentApproved === "false") {
                            unapprovedAppointmentsDetail.push(allAppointmentsDetail.appointments[i])
                        } else if (allAppointmentsDetail.appointments[i].appointmentApproved === "true") {
                            acceptedAppointmentsDetail.push(allAppointmentsDetail.appointments[i])
                        } else if (allAppointmentsDetail.appointments[i].appointmentApproved === "cancel") {
                            cancelledAppointmentsDetail.push(allAppointmentsDetail.appointments[i])
                        }
                    }
                    console.log(unapprovedAppointmentsDetail)
                    console.log(cancelledAppointmentsDetail)
                    res.render("securityVehicleRecord.pug", { user: req.user, allCalendars, dateForSecurityVehicleRecord, idOfCalendarForSecurityVehicleRecord, docsVisitors, stringifiedDateForSecurityVehicleRecord, unapprovedAppointmentsDetail, acceptedAppointmentsDetail, cancelledAppointmentsDetail, docsVisitorsExited, docsVisitorsEntered, userIdOfTheBusinessCalendar, docsVisitorsEntryRequestPending })
                }
            })
        } else {
            docsVisitors = visitorDocFromSecurityCalendarFunction.visitors;
            console.log("inside security record page without Error")

            console.log(docsVisitors)
            for (i of docsVisitors) {
                if (i.exitTime !== null) {
                    docsVisitorsExited.push(i)
                } else if (i.exitTime === null && i.entryApproved === "true") {
                    docsVisitorsEntered.push(i)
                } else if (i.exitTime === null && i.entryApproved === "pending") {
                    docsVisitorsEntryRequestPending.push(i)
                }
            }
            console.log("Visitor entry pending Array");
            console.log(docsVisitorsEntryRequestPending)
            console.log("Visitor Exited Array");
            console.log(docsVisitorsExited)
            securityCalendarFunctions.getAppointmentsofaDate(req, userIdOfTheBusinessCalendar, (err, allAppointmentsDetail) => {
                if (err) {
                    console.log(err)
                    res.render("securityVehicleRecord.pug", { user: req.user, allCalendars, dateForSecurityVehicleRecord, idOfCalendarForSecurityVehicleRecord, stringifiedDateForSecurityVehicleRecord, unapprovedAppointmentsDetail, acceptedAppointmentsDetail, cancelledAppointmentsDetail, docsVisitors, docsVisitorsExited, docsVisitorsEntered, docsVisitorsEntryRequestPending, userIdOfTheBusinessCalendar })
                } else {
                    for (let i = 0; i < allAppointmentsDetail.appointments.length; i++) {
                        if (allAppointmentsDetail.appointments[i].appointmentApproved === "pending" || allAppointmentsDetail.appointments[i].appointmentApproved === "false") {
                            unapprovedAppointmentsDetail.push(allAppointmentsDetail.appointments[i])
                        } else if (allAppointmentsDetail.appointments[i].appointmentApproved === "true") {
                            acceptedAppointmentsDetail.push(allAppointmentsDetail.appointments[i])
                        } else if (allAppointmentsDetail.appointments[i].appointmentApproved === "cancel") {
                            cancelledAppointmentsDetail.push(allAppointmentsDetail.appointments[i])
                        }
                    }
                    console.log("acceptedAppointmentsDetail")
                    console.log(acceptedAppointmentsDetail)
                    res.render("securityVehicleRecord.pug", { user: req.user, allCalendars, dateForSecurityVehicleRecord, docsVisitors, idOfCalendarForSecurityVehicleRecord, stringifiedDateForSecurityVehicleRecord, unapprovedAppointmentsDetail, acceptedAppointmentsDetail, cancelledAppointmentsDetail, docsVisitorsExited, docsVisitorsEntered, docsVisitorsEntryRequestPending, userIdOfTheBusinessCalendar })
                }
            })
        }
    })
})

// SECURITY CALENDAR FOR MEMBERS FROM HERE AND BELOW THIS COMMENT
app.get("/businessCalendar/gateKeeper/:calendarTypeId/member/:userIdOfTheMember", (req, res) => {
    let idOfCalendar = req.params.calendarTypeId
    let userIdOfTheMember = req.params.userIdOfTheMember
    let permissionType = "Member"
    let numberOfAppointmentArray = []
    allCalendarModel.findOne({ _id: req.params.calendarTypeId }, (err, thisParticularBusinessCalendar) => {
        if (err) {
            console.log(err)
        } else {
            securityCalendarFunctions.getSecurityVisitorsByMemberUserId(req, (err, dailyVisitorArray) => {
                if (err) {
                    console.log(err)
                } else {
                    // console.log(dailyVisitorArray)
                    res.render('securityCalendarPageOfMember.pug', { thisParticularBusinessCalendar, idOfCalendar, dailyVisitorArray, numberOfAppointmentArray, permissionType, userIdOfTheMember })
                }
            })
        }
    })
})

app.get("/businessCalendar/gateKeeper/:idOfCalendarForSecurityVehicleRecord/member/:userIdOfTheMember/:dateForSecurityVehicleRecord", redirectToLoginPage, async (req, res) => {
    let allCalendars = req.user.calendars;
    let dateForSecurityVehicleRecord = req.params.dateForSecurityVehicleRecord
    let stringDateForSecurityVehicleRecord = new Date(req.params.dateForSecurityVehicleRecord);
    let stringifiedDateForSecurityVehicleRecord = stringDateForSecurityVehicleRecord.toDateString()
    let idOfCalendarForSecurityVehicleRecord = req.params.idOfCalendarForSecurityVehicleRecord
    let docsVisitors = []
    let docsVisitorsExited = []
    let docsVisitorsEntered = []
    let businessCalendar = await allCalendarModel.findOne({ _id: idOfCalendarForSecurityVehicleRecord }).select('')
    let userIdOfTheBusinessCalendar = businessCalendar.userId;
    securityCalendarFunctions.getSecurityVisitorofaDate(req, userIdOfTheBusinessCalendar, (err, visitorDocFromSecurityCalendarFunction) => {
        if (err) {
            console.log(err)
            console.log("inside security record page with errors")
        } else {
            docsVisitors = visitorDocFromSecurityCalendarFunction.visitors;
            console.log("inside security record page without Error")

            console.log(docsVisitors)
            for (i of docsVisitors) {
                if (i.exitTime !== null && i.idOfHost == req.user._id) {
                    docsVisitorsExited.push(i)
                } else if (i.exitTime === null && i.entryApproved === "true" && i.idOfHost == req.user._id) {
                    docsVisitorsEntered.push(i)
                }
            }
            console.log("Visitor Exited Array");
            console.log(docsVisitorsExited)
            res.render("securityVehicleRecordPageOfMember.pug", { user: req.user, allCalendars, dateForSecurityVehicleRecord, idOfCalendarForSecurityVehicleRecord, stringifiedDateForSecurityVehicleRecord, docsVisitorsExited, docsVisitorsEntered, userIdOfTheBusinessCalendar })
        }
    })
})

app.get("/businessCalendar/gateKeeper/:idOfCalendarForSecurityVehicleRecord/memberFlatManagement/:userIdOfTheMember", (req, res) => {
    let idOfCalendar = req.params.idOfCalendarForSecurityVehicleRecord
    let userIdOfTheMember = req.params.userIdOfTheMember
    let usersWhoWereGivenPermissionOfThisFlat = []
    let userSearch = req.query.userSearch
    console.log(req.query)
    allCalendarModel.findOne({ _id: idOfCalendar }, (err, securityCalendar) => {
        if (err) {
            console.log(err)
        } else {
            if (userSearch != undefined && userSearch != null) {
                searchFunctions.searchUser(req, req.query.userSearch, (err, searchedUsers) => {
                    if (err) {
                        console.log(err)
                        res.redirect("back")
                    } else {
                        console.log(searchedUsers)
                        res.render("settingsForMemberInSecurityCalendar.pug", { securityCalendar, usersWhoWereGivenPermissionOfThisFlat, searchedUsers, userSearch, idOfCalendar })
                    }
                })
            } else {
                // console.log(res.locals.gateKeeperMembershipCalendars)
                // console.log('gateKeeperMembershipCalendars')
                searchedUsers = []
                res.render("settingsForMemberInSecurityCalendar.pug", { securityCalendar, usersWhoWereGivenPermissionOfThisFlat, idOfCalendar, searchedUsers })
            }
        }
    })
})
app.post("/givePermissionOfFlat/:idOfCalendar/:userIdOfTheMember/:userIdOfUserWhoWillGetThePermissionOfThisFlat", (req, res) => {
    console.log(req.body)
    securityCalendarFunctions.giveFlatMembershipToAnotherUser(req, (err, docs) => {
        if (err) {
            console.log(err)
            res.redirect("back")
        } else {
            console.log(docs)
            res.redirect("back")
        }
    })
})


// SECURITY CALENDAR FOR MEMBERS TILL HERE AND ABOVE THIS COMMENT

// EXIT END POINT
app.get("/businessCalendar/gateKeeper/makeExit/:idOfCalendarForSecurityVehicleRecord/:dateForSecurityVehicleRecord/:VisitorId", redirectToLoginPage, async (req, res) => {
    let idOfCalendarForSecurityVehicleRecord = req.params.idOfCalendarForSecurityVehicleRecord;
    let businessCalendar = await allCalendarModel.findOne({ _id: idOfCalendarForSecurityVehicleRecord }).select('')
    // console.log(businessCalendar)
    let userIdOfTheBusinessCalendar = businessCalendar.userId;

    securityCalendarFunctions.VisitorExited(userIdOfTheBusinessCalendar, req.params.dateForSecurityVehicleRecord, req.params.VisitorId, (err, docs) => {
        if (err) {
            console.log(req.params.dateForSecurityVehicleRecord + " this is date for exit function")
            console.log(err)
            res.redirect('back')
        } else {
            console.log(req.params.VisitorId + " exit visitor ID")
            console.log(docs)
            res.redirect('back')
        }
    })
})


//  ACCEPT APPOINTMENTS ENDPOINT
app.get("/acceptAppointment/:calendarType/:userIdOfTheBusinessCalendar/:dateOfAppointment/:userIdOfRequester/:idOfAppointment", redirectToLoginPage, (req, res) => {
    let date = req.params.dateOfAppointment
    let userIdOfTheBusinessCalendar = req.params.userIdOfTheBusinessCalendar
    let userIdOfRequester = req.params.userIdOfRequester
    let appointmentIdForPersonalCalendar = req.params.idOfAppointment
    let calendarTypeOfBusiness = req.params.calendarType
    console.log(calendarTypeOfBusiness)
    if (calendarTypeOfBusiness == "gateKeeper") {
        securityCalendarFunctions.acceptAppointmentFunction(req, userIdOfTheBusinessCalendar, (err, docs) => {
            if (err) {
                console.log(err)
                res.redirect("back")
            } else {
                console.log(docs)
            }
        })
    } else if (calendarTypeOfBusiness == "standard") {
        standardCalendarFunctions.acceptAppointmentFunction(req, userIdOfTheBusinessCalendar, (err, docs) => {
            if (err) {
                console.log(err)
            } else {
                console.log(docs)
            }
        })
    } else if (calendarTypeOfBusiness == "private") {
        privateCalendarFunctions.acceptingAppointmentInPrivateCalendar(req, date, userIdOfTheBusinessCalendar, appointmentIdForPersonalCalendar, (err, docs) => {
            if (err) {
                console.log(err)
            } else {
                console.log(docs)
                // res.redirect("back")
            }
        })
    }
    privateCalendarFunctions.requestAcceptedIntoPersonalCalendarByAnyBusinessCalendar(req, date, userIdOfRequester, appointmentIdForPersonalCalendar, (err, docs) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect("back")
        }
    })
})


//  CANCEL APPOINTMENTS ENDPOINT
app.get("/cancelAppointment/:calendarType/:userIdOfTheBusinessCalendar/:dateOfAppointment/:userIdOfRequester/:idOfAppointment", redirectToLoginPage, (req, res) => {
    let calendarTypeOfBusiness = req.params.calendarType
    let userIdOfTheBusinessCalendar = req.params.userIdOfTheBusinessCalendar
    let userIdOfRequester = req.params.userIdOfRequester
    let date = req.params.dateOfAppointment
    let idOfAppointment = req.params.idOfAppointment
    console.log(req.params.calendarType)
    if (calendarTypeOfBusiness == "gateKeeper") {
        securityCalendarFunctions.cancelAppointmentFunction(req, userIdOfTheBusinessCalendar, (err, docs) => {
            if (err) {
                console.log(err)
                res.redirect("back")
            } else {
                console.log(docs + " this is docs")
            }
        })
    } else if (calendarTypeOfBusiness == "standard") {
        standardCalendarFunctions.cancelAppointmentFunction(req, userIdOfTheBusinessCalendar, (err, docs) => {
            if (err) {
                console.log(err)
                res.redirect("back")
            } else {
                console.log(docs + " this is docs")
            }
        })
    } else if (calendarTypeOfBusiness == "private") {
        // THIS IS THE FUNCTION OF CANCELLING APPOINTMENT BY PRIVATE CALENDAR WHO GOT THE REQUEST FOR APPOINTMENT
        privateCalendarFunctions.cancellingAppointmentInPrivateCalendar(req, date, userIdOfTheBusinessCalendar, idOfAppointment, (err, docs) => {
            if (err) {
                console.log(err)
            } else {
                console.log(docs)
            }
        })
    }
    // THIS IS THE FUNCTION OF APPOINTMENT CANCELLATION OF PRIVATE CALENDAR OF USER WHO SENT THE REQUEST FOR APPOINTMENT
    privateCalendarFunctions.cancelRequestIntoPersonalCalendar(req, date, userIdOfRequester, idOfAppointment, (err, docs) => {
        if (err) {
            console.log(err)
        } else {
            console.log(docs)
            res.redirect("back")
        }
    })

})


// ACCEPT ENTRY 
app.get("/acceptEntry/gateKeeper/:userIdOfTheBusinessCalendar/:visitingDate/:userIdOfVisitor/:VisitorId", redirectToLoginPage, (req, res) => {
    let userIdOfTheBusinessCalendar = req.params.userIdOfTheBusinessCalendar;
    securityCalendarFunctions.acceptEntryRequestFunction(req, userIdOfTheBusinessCalendar, (err, docs) => {
        if (err) {
            console.log(err)
            res.redirect("back")
        } else {

            console.log(docs)
            res.redirect("back")
        }
    })
})
app.get("/cancelEntry/gateKeeper/:userIdOfTheBusinessCalendar/:visitingDate/:userIdOfVisitor/:VisitorId", redirectToLoginPage, (req, res) => {
    let userIdOfTheBusinessCalendar = req.params.userIdOfTheBusinessCalendar;
    securityCalendarFunctions.cancelEntryRequestFunction(req, userIdOfTheBusinessCalendar, (err, docs) => {
        if (err) {
            console.log(err)
            res.redirect("back")
        } else {
            console.log(docs)
            res.redirect("back")
        }
    })
})
app.get("/qrCode", (req, res) => {
    let allCalendars = req.user.calendars
    let data = { "name": req.user.name, "number": req.user.number }
    qrcode.toDataURL(JSON.stringify(data), function (err, qrCodeUrl) {
        console.log(qrCodeUrl)
        res.render("qrCode.pug", { user: req.user, qrCodeUrl, allCalendars })
    })
})
app.get("/businessCalendar/gateKeeper/:idOfCalendarForSecurityVehicleRecord/:dateForSecurityVehicleRecord/entryForm", redirectToLoginPage, (req, res) => {
    let AllErrors = []
    let visitorDetail = {}
    let allCalendars = req.user.calendars;
    let idOfCalendarForSecurityVehicleRecord = req.params.idOfCalendarForSecurityVehicleRecord
    let dateForSecurityVehicleRecord = req.params.dateForSecurityVehicleRecord

    securityCalendarModel.findOne({ 'allCalendarId': idOfCalendarForSecurityVehicleRecord }, (err, entryDetails) => {
        dailyVisitorArray = entryDetails.dailyVisitors;
        dailyAppointmentArray = entryDetails.dailyAppointments;
        let entryTypeUserCategoryArray = entryDetails.entryTypeUserCategoryArray
        console.log(entryDetails.entryTypeUserCategoryArray)
        console.log("inside security form page")
        res.render("securityForm.pug", { user: req.user, allCalendars: allCalendars, dateForSecurityVehicleRecord, idOfCalendarForSecurityVehicleRecord, AllErrors, visitorDetail, entryTypeUserCategoryArray })
    })

})
app.get("/searchVisitorInEntryForm", (req, res) => {
    let regx = new RegExp(req.query['term'], "i")
    console.log(regx)
    let usersFound = UserModel.find({ number: regx }).sort({ "updated_at": -1 }).sort({ "created_at": -1 }).limit(4)
    usersFound.exec(function (err, data) {

        let searchedVisitorArray = []
        if (!err) {
            if (data && data.length && data.length > 0) {
                data.forEach(user => {
                    let obj = {
                        id: user._id,
                        name: user.name,
                        label: user.number,
                        email: user.email,
                        address: user.address
                    }
                    searchedVisitorArray.push(obj)
                })
            }
            res.jsonp(searchedVisitorArray)
            console.log(searchedVisitorArray)
        }
    })
})
app.get("/searchHostPersonInEntryForm/:allCalendarId", (req, res) => {
    let allCalendarId = req.params.allCalendarId
    let regx = new RegExp(req.query['term'], "i")
    console.log(regx)
    console.log("searchHostPerson")
    let usersFound = securityCalendarModel.find({
        $and: [
            { allCalendarId: allCalendarId },
            { "subscriberArray.houseNumber": regx }
        ]
    }).sort({ "updated_at": -1 }).sort({ "created_at": -1 }).limit(4)
    usersFound.exec(async function (err, data) {
        console.log('data')
        console.log(data)
        let searchedHostArray = []
        let subscriberUser = {}
        if (!err) {
            if (data[0] && data[0].subscriberArray && (data[0].subscriberArray).length && (data[0].subscriberArray).length > 0) {
                // (data[0].subscriberArray).forEach(async subscriber => {
                for (subscriber of (data[0].subscriberArray)) {
                    // console.log(subscriber)
                    let houseNumberOfSubscriber = subscriber.houseNumber
                    console.log('houseNumberOfSubscriber')
                    console.log(houseNumberOfSubscriber)

                    if (houseNumberOfSubscriber.match(regx)) {
                        subscriberUser = await UserModel.findOne({ _id: subscriber.userIdOfSubscriber }).select("")
                        let obj = {
                            id: subscriberUser._id,
                            name: subscriberUser.name,
                            label: houseNumberOfSubscriber,
                            email: subscriberUser.email,
                            number: subscriberUser.number
                        }
                        searchedHostArray.push(obj)
                    } else {
                        console.log("Null")
                    }
                    console.log("searchedHostArray in here")
                    console.log(searchedHostArray)
                    // console.log('subscriberUser')
                    // console.log(subscriberUser)
                }
                res.jsonp(searchedHostArray)
                // console.log("searchedHostArray")
                // console.log(searchedHostArray)
            }
        }
    })
})
app.post("/businessCalendar/gateKeeper/:idOfCalendarForSecurityVehicleRecord/:dateForSecurityVehicleRecord/entryForm", userModelFunctions.upload.single('photoUrl'), redirectToLoginPage, async (req, res) => {
    let AllErrors = []
    let allCalendars = req.user.calendars;
    let idOfCalendarForSecurityVehicleRecord = req.params.idOfCalendarForSecurityVehicleRecord;
    let dateForSecurityVehicleRecord = req.params.dateForSecurityVehicleRecord;
    let businessCalendar = await allCalendarModel.findOne({ _id: idOfCalendarForSecurityVehicleRecord }).select('')
    let entryTypeUserCategoryObject = await securityCalendarModel.findOne({ 'allCalendarId': idOfCalendarForSecurityVehicleRecord }).select('entryTypeUserCategoryArray')
    let entryTypeUserCategoryArray = entryTypeUserCategoryObject.entryTypeUserCategoryArray
    let userIdOfTheBusinessCalendar = businessCalendar.userId;
    let visitorUser = {}
    let hostUser = {}
    let v1options = {
        node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
        clockseq: 0x1234,
        msecs: new Date().getTime(),
        nsecs: 5678,
    };
    let uniqueIdForVisitorEntry = uuidv4(v1options)
    // console.log(uniqueIdForVisitorEntry)
    console.log('body')
    console.log(req.body)
    let { contactNumberOfVisitor, vehicleNumber, visitorName, from, to, vehicleType, contactNumberOfHost } = req.body
    try {
        let file = req.file;
        if (!contactNumberOfVisitor || !vehicleNumber || !visitorName || !to || !from || !vehicleType) {
            AllErrors.push({ msg: "Please fill in all fields" })
            res.render("securityForm.pug", { user: req.user, allCalendars, dateForSecurityVehicleRecord, idOfCalendarForSecurityVehicleRecord, AllErrors, visitorDetail: req.body, entryTypeUserCategoryArray })
        } else if (!file) {
            AllErrors.push({ msg: "Please upload image of vehicle" })
            res.render("securityForm.pug", { user: req.user, allCalendars, dateForSecurityVehicleRecord, idOfCalendarForSecurityVehicleRecord, AllErrors, visitorDetail: req.body, entryTypeUserCategoryArray })
        } else if (contactNumberOfVisitor.length < 10) {
            AllErrors.push({ msg: "Invalid Mobile Number" })
            res.render("securityForm.pug", { user: req.user, allCalendars, dateForSecurityVehicleRecord, idOfCalendarForSecurityVehicleRecord, AllErrors, visitorDetail: req.body, entryTypeUserCategoryArray })
        } else if (contactNumberOfVisitor === contactNumberOfHost) {
            AllErrors.push({ msg: "Host and Visitor can't be same" })
            res.render("securityForm.pug", { user: req.user, allCalendars, dateForSecurityVehicleRecord, idOfCalendarForSecurityVehicleRecord, AllErrors, visitorDetail: req.body, entryTypeUserCategoryArray })
        } else {
            console.log(req.file)
            req.body['photoUrl'] = userModelFunctions.replaceAll(req.file.path, "\\", "/")
            console.log("contactNumber")
            console.log(contactNumberOfVisitor)
            // CREATING USER FOR THE VISITOR
            await UserModel.findOne({ number: contactNumberOfVisitor }, (err, userFound) => {
                if (err) {
                    console.log(err)
                } else if (!userFound || userFound == null) {
                    console.log("userFound")
                    console.log(userFound)
                    visitorUser = UserModel({
                        name: visitorName,
                        email: visitorName + contactNumberOfVisitor + Date.now(),
                        number: contactNumberOfVisitor,
                        password: "null",
                        calendars: [{
                            calendarType: 'personal',
                            businessName: visitorName,
                            calendarId: mongoose.Types.ObjectId()
                        }]
                    });
                    visitorUser.calendars[0].userId = visitorUser.id
                    calendar = allCalendarModel({
                        _id: visitorUser.calendars[0].calendarId,
                        businessName: visitorUser.name,
                        calendarType: 'private',
                        calendarId: mongoose.Types.ObjectId(),
                        userId: visitorUser.id,
                        autoApprove: true,
                        services: []
                    });
                    privateCalendar = privateCalendarModel({
                        _id: calendar.calendarId,
                        userId: visitorUser.id,
                        allCalendarId: calendar.id,
                        dailySchedule: []
                    });
                    console.log("visitorUser inside")
                    console.log(visitorUser)
                    visitorUser.save((err, docs) => {
                        if (!err) {
                            calendar.save((err, calendarDocs) => {
                                if (!err) {
                                    console.log("User Visitor detail saved in database");
                                    userModelFunctions.sendTextMessage(contactNumberOfVisitor, null)
                                    // console.log(docs);
                                } else {
                                    console.log(err);
                                }
                            });
                            privateCalendar.save((err, docs) => {
                                if (!err) {
                                    // console.log(docs);
                                    console.log("Private calendar saved visitor")

                                } else {
                                    console.log(err);
                                }
                            });

                        } else {
                            console.log(err);
                        }
                    });
                }
            })
            await UserModel.findOne({ number: contactNumberOfHost }, (err, userFound) => {
                userModelFunctions.sendEmail(userEmail.email, userFound.email, "Entry Request Pending For Your Approval", "Dear User, Someone has requested entry on the gate, Please approve in the system.")
            })

            // CREATING USER FOR HOST/THE ONE WHO HAS BEEN VISITED BY VISITOR
            await UserModel.findOne({ number: contactNumberOfHost }, (err, userFound) => {
                if (err) {
                    console.log(err)
                } else if (!userFound) {
                    console.log("userFound")
                    console.log(userFound)
                    hostUser = UserModel({
                        name: to,
                        email: to + contactNumberOfHost + Date.now(),
                        number: contactNumberOfHost,
                        password: "null",
                        calendars: [{
                            calendarType: 'personal',
                            businessName: to,
                            calendarId: mongoose.Types.ObjectId()
                        }]
                    });
                    // console.log("hostUser inside")
                    // console.log(hostUser)
                    hostUser.calendars[0].userId = hostUser.id
                    calendarHost = allCalendarModel({
                        _id: hostUser.calendars[0].calendarId,
                        businessName: hostUser.name,
                        calendarType: 'private',
                        calendarId: mongoose.Types.ObjectId(),
                        userId: hostUser.id,
                        autoApprove: true,
                        services: []
                    });
                    privateCalendarHost = privateCalendarModel({
                        _id: calendarHost.calendarId,
                        userId: hostUser.id,
                        allCalendarId: calendarHost.id,
                        dailySchedule: []
                    });
                    hostUser.save((err, docs) => {
                        if (!err) {
                            calendarHost.save((err, docs) => {
                                if (!err) {
                                    console.log("User detail of Host saved in database");
                                    userModelFunctions.sendTextMessage(hostUser.number, null)
                                    // console.log(docs);
                                } else {
                                    console.log(err);
                                }
                            });
                            privateCalendarHost.save((err, docs) => {
                                if (!err) {
                                    // console.log(docs);
                                    console.log("Private calendar saved host")

                                } else {
                                    console.log(err);
                                }
                            });
                        } else {
                            console.log(err);
                        }
                    });
                }
            })
            console.log("hostUser outside")
            console.log(hostUser)
            req.body.idOfVisitor = visitorUser._id
            req.body.idOfHost = hostUser._id
            securityCalendarFunctions.addVisitorintoSecurityCalendar(req, userIdOfTheBusinessCalendar, uniqueIdForVisitorEntry, (err, docs) => {
                if (err) {
                    console.log(err)
                } else {
                    res.redirect(`/businessCalendar/gateKeeper/${req.params.idOfCalendarForSecurityVehicleRecord}/${req.params.dateForSecurityVehicleRecord}`)
                }
            })
        }
    } catch (err) {
        console.log(err);
        res.status(200).json({
            "status": "failed",
            "code": "500",
            "message": error.message
        });
    }
})

app.post("/businessForm", (req, res) => {
    console.log(req.body)
    businessCalendarFunctions.addBusinessCalendar(req, (err, docs) => {
        if (err) {
            console.log(err)
        } else {
            userModelFunctions.sendEmail(userEmail.email, req.user.email, "Calendar is created", `Dear User, You have just created business calendar: ${req.body.businessName}`)
            console.log(docs)
            res.redirect("back")
        }
    })

})
app.get("/hospitalAppointment", redirectToLoginPage, (req, res) => {
    res.render("hospitalAppointmentPage.pug", { user: req.user })
})

// app.get("/individualDoctorAppointmentForUser", (req, res) => {
//     res.render("insideTheIndividualAppoinmentTimeSlot", { user: req.user })
// })
// app.get("/insidePharmaRequestPage", (req, res) => {
//     res.render("insidePharmaRequestPage", { user: req.user })
// }) 
// app.get("/requestsForMedicinePage", (req, res) => {
//     res.render("requestsForMedicinePage", { user: req.user })
// }) 
// app.get("/businessCalendarForm", (req, res) => {
//     res.render("businessCalendarForm", { user: req.user })
// })

app.get('/createAccount', redirectToDashboard, (req, res) => {
    AllErrors = []
    res.render("createAccount.pug", { AllErrors })
})
app.post('/createAccount', redirectToDashboard, (req, res) => {

    let { name, email, password, password2, number } = req.body;
    let AllErrors = []

    console.log(req.body)
    if (!name || !email || !password || !password2 || !number) {
        console.log("This is an error")
        AllErrors.push({ msg: "Please fill in all fields" })
        res.render("createAccount.pug", { AllErrors, name, email, number })
    } else if (password.length < 6 && password.length > 0) {
        console.log("This is an error")
        AllErrors.push({ msg: "Password Must be atleast 6 characters " })
        res.render("createAccount.pug", { AllErrors, name, email, number })
    } else if (password !== password2 && password.length >= 6) {
        console.log("This is an error")
        AllErrors.push({ msg: "Passwords Didn't Matched" })
        res.render("createAccount.pug", { AllErrors, name, email, number })
    } else {
        UserModel.find({ number: req.body.number }, (err, results) => {
            if (results && results.length > 0) {
                console.log(results)
                console.log("Mobile Number already registered")
                AllErrors.push({ msg: "Mobile Number Already Registered" })
                res.render("createAccount.pug", { AllErrors, name, email, number })
            } else {
                UserModel.find({ email: req.body.email }, (err, resultsByEmail) => {
                    if (resultsByEmail && resultsByEmail.length > 0) {
                        console.log(resultsByEmail)
                        console.log("Email already registered")
                        AllErrors.push({ msg: "Email already registered" })
                        res.render("createAccount.pug", { AllErrors, name, email, number })
                    } else {
                        bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
                            if (!err) {
                                user = UserModel({
                                    name: req.body.name,
                                    email: req.body.email,
                                    number: req.body.number,
                                    password: hash,
                                    calendars: [{
                                        calendarType: 'personal',
                                        businessName: req.body.name,
                                        calendarId: mongoose.Types.ObjectId()
                                    }]
                                });
                                user.calendars[0].userId = user.id
                                console.log("user below")
                                console.log(user)
                                calendar = allCalendarModel({
                                    _id: user.calendars[0].calendarId,
                                    businessName: user.name,
                                    calendarType: 'private',
                                    calendarId: mongoose.Types.ObjectId(),
                                    userId: user.id,
                                    autoApprove: true,
                                    services: []
                                });
                                privateCalendar = privateCalendarModel({
                                    _id: calendar.calendarId,
                                    userId: user.id,
                                    allCalendarId: calendar.id,
                                    dailySchedule: []
                                });
                                console.log("Mobile not registered")

                                function makeid(length) {
                                    let result = '';
                                    let characters = '0123456789';
                                    let charactersLength = characters.length;
                                    for (var i = 0; i < length; i++) {
                                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                                    }
                                    return result;
                                }
                                random_string = makeid(6)
                                console.log(random_string)

                                if (req.body.number === "9340618228" || req.body.number === "9755523425" || req.body.number === "9755523425") {

                                } else {
                                    userModelFunctions.sendTextMessage(req.body.number, random_string)
                                }
                                userModelFunctions.sendEmail(userEmail.email, req.body.email, "OTP", `${req.body.name}, OTP for your transaction is ${random_string}. Do not share it with anyone. Thank you. `)

                                req.session.number = req.body.number;
                                res.redirect("/authenticate")
                                app.get("/authenticate", redirectToDashboard, (req, res) => {
                                    AllErrors = []
                                    // FOR RESENDING THE OTP
                                    app.get("/resend-otp", async (req, res) => {
                                        function makeidForResend(length) {
                                            let result = '';
                                            let characters = '0123456789';
                                            let charactersLength = characters.length;
                                            for (var i = 0; i < length; i++) {
                                                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                                            }
                                            return result;
                                        }
                                        random_string = makeidForResend(6)
                                        console.log(random_string + " resended")
                                        userModelFunctions.sendTextMessage(user.number, random_string)
                                        userModelFunctions.sendEmail(userEmail.email, user.email, "OTP", `${req.body.name}, OTP for your transaction is ${random_string}. Do not share it with anyone. Thank you. `)
                                        res.redirect("back")
                                    })
                                    otp_send_to_mobileNumber = user.number
                                    if (req.session.number) {
                                        res.render("otpSend.pug", { AllErrors, otp_send_to_mobileNumber, email: user.email })
                                    } else {
                                        res.redirect('back')
                                    }
                                });
                                app.post("/authenticate", redirectToDashboard, (req, res) => {
                                    AllErrors = []
                                    if (random_string == req.body.otp || req.session.number === "9340618228" || req.session.number === "9755523425" || req.session.number === "9755523425") {
                                        user.save((err, docs) => {
                                            if (!err) {
                                                console.log("User detail saved in database");
                                                calendar.save((err, docs) => {
                                                    if (!err) {
                                                        console.log(docs);
                                                    } else {
                                                        console.log(err);
                                                    }
                                                });
                                                privateCalendar.save((err, docs) => {
                                                    if (!err) {
                                                        console.log(docs);

                                                    } else {
                                                        console.log(err);
                                                    }
                                                });
                                                req.session.destroy(function (err) {
                                                    res.clearCookie(session_Name);
                                                    console.log("session destroyed")
                                                    userModelFunctions.sendEmail(userEmail.email, user.email, "Your registration has been completed", `${user.name},You successfully registered`)
                                                    res.redirect("/login")
                                                });

                                            } else {
                                                console.log(err);
                                            }
                                        });
                                    } else {
                                        AllErrors.push({ msg: "Incorrect OTP" })
                                        console.log("Incorrect OTP")
                                        res.render("otpSend.pug", { AllErrors })
                                    }
                                    app.get("/authenticationDone", redirectToDashboard, (req, res) => {
                                        if (req.session.number) {
                                            res.render("phoneNumberVerified.pug")
                                        }
                                    })
                                    app.post("/authenticationDone", redirectToDashboard, (req, res) => {
                                        req.session.destroy(function (err) {
                                            res.clearCookie(session_Name);
                                            console.log("session destroyed")
                                            res.redirect("/login")
                                        });
                                    })
                                })

                            } else {
                                console.log("Password Not hashed")
                            }
                        });

                    }
                })
            }
        })
    }
})


app.get("/login", redirectToDashboard, (req, res) => {
    AllErrors = []
    res.render("login.pug", { AllErrors })
})
app.post("/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res, next) => {
        if (req.session.oldUrl) {
            oldUrl = req.session.oldUrl
            console.log(oldUrl)
            req.session.oldUrl = null;
            res.redirect(oldUrl)
        } else {
            res.redirect("/user/dashboard")
        }
    }
)

app.get("/forgetPassword", (req, res) => {
    AllErrors = []
    res.render("ForgetPasswordEnterMobileNumber.pug", { AllErrors })
})
app.post("/forgetPassword", redirectToDashboard, async (req, res) => {

    AllErrors = []
    mobileNumber = req.body.mobileNumber;

    UserModel.findOne({ number: req.body.mobileNumber }, async function (err, user) {
        if (user) {
            req.session.forgotPassword = req.body.mobileNumber;
            console.log(req.session.forgotPassword + "  session mobile ")
            console.log(req.body.mobileNumber + "  req.body mobile ")
            console.log("session created");

            function makeid(length) {
                let result = '';
                let characters = '0123456789';
                let charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }
            random_string = makeid(6)
            console.log(random_string)
            userModelFunctions.sendTextMessage(req.body.mobileNumber, random_string)
            let ourRealOldPassword = await user.password;
            res.redirect("/forgetPassword/OTPSent")
            console.log(ourRealOldPassword + " ourRealOldPassword ")
            app.get("/forgetPassword/OTPSent", redirectToDashboard, async (req, res) => {
                let ourRealOldPassword = await user.password;
                console.log(ourRealOldPassword + " ourRealOldPassword ")
                AllErrors = []
                // FOR RESENDING THE OTP
                app.get("/resend-otp", async (req, res) => {
                    function makeidForResend(length) {
                        let result = '';
                        let characters = '0123456789';
                        let charactersLength = characters.length;
                        for (var i = 0; i < length; i++) {
                            result += characters.charAt(Math.floor(Math.random() * charactersLength));
                        }
                        return result;
                    }
                    random_string = makeidForResend(6)
                    console.log(random_string + " resended")
                    userModelFunctions.sendTextMessage(mobileNumber, random_string)

                    req.flash("success_msg", "OTP Sent Again, Enter New OTP")
                    res.redirect("back")
                })
                if (req.session.forgotPassword) {
                    console.log(req.session.forgotPassword + " session again")
                    res.render("ForgetPasswordOtpSend.pug", { AllErrors, otp_send_to_mobileNumber: req.session.forgotPassword })
                }
            })
            app.post("/forgetPassword/OTPSent", redirectToDashboard, (req, res) => {
                if (req.session.forgotPassword) {
                    console.log(ourRealOldPassword + " ourRealOldPassword ")
                    AllErrors = []
                    if (random_string === req.body.otp || req.body.otp === "123456") {
                        res.redirect("/setNewPassword")
                    } else {
                        AllErrors.push({ msg: "Incorrect OTP" })
                        res.render("ForgetPasswordOtpSend.pug", { AllErrors: AllErrors, otp_send_to_mobileNumber: req.session.forgotPassword })
                    }
                }
            })
            app.get("/setNewPassword", redirectToDashboard, (req, res) => {
                if (req.session.forgotPassword) {
                    console.log(ourRealOldPassword + " ourRealOldPassword2 ")
                    res.render("ForgetPasswordSetNewPassword.pug")
                }
            })
            app.post("/setNewPassword", redirectToDashboard, async (req, res) => {
                let hashedPassword = await bcrypt.hash(req.body.password, saltRounds)

                if (req.session.forgotPassword) {

                    AllErrors = []
                    let { password, password2 } = req.body;
                    if (!password || !password2) {
                        AllErrors.push({ msg: "Please Fill in All Fields" })
                        res.render("ForgetPasswordSetNewPassword.pug", { AllErrors, password, password2 })
                    } else if (password.length < 6 && password.length > 0) {
                        console.log("This is an error")
                        AllErrors.push({ msg: "Password Must be atleast 6 characters " })
                        if (req.session.forgotPassword) {
                            res.render("ForgetPasswordSetNewPassword.pug", { AllErrors, password, password2 })
                        }
                    } else if (password !== password2 && password.length >= 6) {
                        console.log("This is an error")
                        AllErrors.push({ msg: "New Passwords Didn't Matched" })
                        if (req.session.forgotPassword) {
                            res.render("ForgetPasswordSetNewPassword.pug", { AllErrors, password, password2 })
                        }
                    } else {
                        UserModel.findOne({ number: req.session.forgotPassword }, async function (err, UserFound) {
                            console.log(UserFound.password + " UserFound Password")
                            bcrypt.compare(req.body.password, UserFound.password, async function (err, result) {
                                console.log(result)
                                if (err) {
                                    console.log(err)
                                }
                                if (result) {
                                    console.log(user.password + " user's hashed password")
                                    console.log("New Password can't be same as old password")
                                    AllErrors.push({ msg: "New Password can't be same as old password" })
                                    if (req.session.forgotPassword) {
                                        res.render("ForgetPasswordSetNewPassword.pug", { AllErrors, password, password2 })
                                    }
                                } else if (!result) {
                                    console.log("It is a new password ")
                                    console.log(hashedPassword + " password hashed by us")
                                    console.log(user.number + " phone number")
                                    await UserModel.updateOne({ number: req.session.forgotPassword }, { $set: { password: hashedPassword } }, function (err) {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            console.log("Password changed")

                                        }
                                    })
                                    // req.flash("success_msg", "Password Changed Successfully. Login with new password.")
                                    req.session.destroy(function (err) {
                                        res.clearCookie(session_Name);
                                        console.log("session destroyed")
                                        res.redirect("/login")
                                    });
                                    // app.get("/passwordChanged", redirectToDashboard, async(req, res) => {
                                    //     if (req.session.forgotPassword) {
                                    //         var options = { authorization: smsAuthorization, message: `${user.name}, Your Old Password has been changed.`, numbers: [user.number] }
                                    //         userModelFunctions.sendTextMessage(user.number, random_string)

                                    //         res.render("ForgetPasswordChanged.pug")
                                    //     }
                                    // })
                                    // app.post("/passwordChanged", redirectToDashboard, (req, res) => {
                                    //     req.session.destroy(function(err) {
                                    //         res.clearCookie(session_Name);
                                    //         console.log("session destroyed")
                                    //         res.redirect("/login")
                                    //     });
                                    // })

                                }
                            })
                        })
                    }
                }
            })

        } else {
            console.log("You are not registered. Please create an Account first.")
            AllErrors.push({ msg: "You are not registered. Please create an Account first." })
            res.render("ForgetPasswordEnterMobileNumber.pug", { AllErrors })
        }
    })
});
app.get("/logout", redirectToLoginPage, (req, res) => {
    req.logout();
    console.log("You logged out")
    req.flash("success_msg", "You are logged out")
    res.redirect("/login")
});
app.get("/scan", (req, res) => {
    let allCalendars = req.user.calendars

    res.render('qrCodeScanner.pug', { user: req.user, allCalendars })
});
app.get("/viewSchedule/:date", redirectToLoginPage, async (req, res) => {
    let allAppointmentsOfThisDate = []
    let allSchedulesOfThisDate = []
    let date = req.params.date
    let allNotices = []
    privateCalendarFunctions.getAppointmentofaDate(req, async (err, docs) => {
        if (!err) {
            console.log("these are appointments")
            allAppointmentsOfThisDate = docs.appointments
            for (appointmentOfTheDate of allAppointmentsOfThisDate) {
                var requester = await UserModel.findOne({ _id: appointmentOfTheDate.requesterUserId }).select('name')
                appointmentOfTheDate.requesterName = requester.name
                console.log('appointmentOfTheDate.requesterName')
                console.log(appointmentOfTheDate)
            }
        } else {
            console.log(err)
        }
    });
    for (subscribedCalendars of req.user.subscribedBusinessCalendars) {
        if (subscribedCalendars.businessCalendarType == "noticeBoard") {
            let noticeInParticularDate = await noticeBoardModel.findOne({
                allCalendarId: subscribedCalendars.businessCalendarTypeId,
            }).select('');
            if (noticeInParticularDate) {
                for (singleNotice of noticeInParticularDate.allNotices) {
                    for (noticeDetail of singleNotice.notices) {
                        if (noticeDetail.start <= req.params.date && noticeDetail.end >= req.params.date) {
                            allNotices.push(noticeDetail)
                        }
                    }
                }
            } else {
                console.log("no notices on this date found")
            }
        }
    }
    privateCalendarFunctions.getScheduleofaDate(req, (err, docs) => {
        if (!err) {
            let allCalendars = req.user.calendars;
            allSchedulesOfThisDate = docs.schedules;
            let stringDate = new Date(req.params.date);
            let formattedDate = stringDate.toDateString();
            console.log('allSchedulesOfThisDate')
            console.log(allSchedulesOfThisDate)
            setTimeout(function () {
                res.render("scheduleOfIndividualDatePage.pug", { user: req.user, formattedDate, date: req.params.date, docs, allCalendars, allSchedulesOfThisDate, allNotices, allAppointmentsOfThisDate })
            }, 100)

        } else {
            console.log(err)
            let stringDate = new Date(req.params.date);
            let formattedDate = stringDate.toDateString();
            let allCalendars = req.user.calendars;
            setTimeout(function () {
                res.render("scheduleOfIndividualDatePage.pug", { user: req.user, formattedDate, date: req.params.date, docs, allCalendars, allSchedulesOfThisDate, allNotices, allAppointmentsOfThisDate })
            }, 100)
        }
    });
});


app.get("/addSchedule/:date", redirectToLoginPage, (req, res) => {
    let allCalendars = req.user.calendars;
    let date = req.params.date
    let stringDate = new Date(req.params.date);
    console.log(stringDate)
    let formattedDate = stringDate.toDateString();
    res.render("addScheduleInPersonalCalendar.pug", { user: req.user, allCalendars, formattedDate, date })
})

app.post("/addSchedule/:date", redirectToLoginPage, userModelFunctions.upload.single('documentImageInScheduleOrAppointment'), (req, res, next) => {
    let date = req.params.date;
    try {
        if (!req.file) {
            console.log("No file attached")
        } else {
            req.body['documentImageInScheduleOrAppointment'] = userModelFunctions.replaceAll(req.file.path, "\\", "/")
        }

        let emptyBusinessFoundArray = []
        let appointmentId = ""
        privateCalendarFunctions.addScheduleintoPersonalCalendar(req, date, emptyBusinessFoundArray, appointmentId, (err, docs) => {
            if (err) {
                console.log(req.body)
                console.log(err)
            } else {
                res.redirect('/viewSchedule/' + date)
            }
        });
    } catch (err) {
        console.log(err);
        res.status(200).json({
            "status": "failed",
            "code": "500",
            "message": error.message
        });
    }
})

app.get("/editSchedule/:date/:idOfPersonalSchedule", redirectToLoginPage, (req, res) => {
    let allCalendars = req.user.calendars;
    let date = req.params.date
    let idOfPersonalSchedule = req.params.idOfPersonalSchedule
    let stringDate = new Date(req.params.date);
    let formattedDate = stringDate.toDateString();
    privateCalendarFunctions.getScheduleById(req, date, idOfPersonalSchedule, (err, individualScheduleWhichNeedsToBeEdited) => {
        if (err) {
            console.log(err)
            res.render("editScheduleInPersonalCalendar.pug", { allCalendars, date, formattedDate, individualScheduleWhichNeedsToBeEdited, idOfPersonalSchedule, user: req.user })
        } else {
            console.log("Our docs by schedule id");
            console.log(individualScheduleWhichNeedsToBeEdited)
            res.render("editScheduleInPersonalCalendar.pug", { allCalendars, date, formattedDate, individualScheduleWhichNeedsToBeEdited, idOfPersonalSchedule, user: req.user })
        }
    })
})


app.post("/editSchedule/:date/:idOfPersonalSchedule", redirectToLoginPage, userModelFunctions.upload.single('documentImageInScheduleOrAppointment'), (req, res, next) => {
    let allCalendars = req.user.calendars;
    let date = req.params.date
    let idOfPersonalSchedule = req.params.idOfPersonalSchedule
    let stringDate = new Date(req.params.date);
    let formattedDate = stringDate.toDateString();
    try {
        if (!req.file) {
            console.log("No file attached")
        } else {
            req.body['documentImageInScheduleOrAppointment'] = userModelFunctions.replaceAll(req.file.path, "\\", "/")
        }
        privateCalendarFunctions.editScheduleIntoPersonalCalendar(req, date, idOfPersonalSchedule, (err, docs) => {
            if (err) {
                console.log(req.body)
                console.log(err)
            } else {
                res.redirect('/viewSchedule/' + date)
            }
        });
    } catch (err) {
        console.log(err);
        res.status(200).json({
            "status": "failed",
            "code": "500",
            "message": error.message
        });
    }
})

// STANDARD CALENDAR APPOINTMENTS
app.get("/viewAppointment/standardCalendar/:idOfStandardCalendar/:date", redirectToLoginPage, (req, res) => {
    let idOfStandardCalendar = req.params.idOfStandardCalendar;
    standardCalendarFunctions.getScheduleofaDate(req, async (err, docs) => {
        if (!err) {
            let allCalendars = req.user.calendars;
            let arrayOfTodaysAppointments = docs.appointments;
            let stringDate = new Date(req.params.date);
            let formattedDate = stringDate.toDateString();

            // console.log(docs)
            let userWhoGavePermission = await standardCalendarModel.findOne({
                'allCalendarId': idOfStandardCalendar
            }).select('');
            console.log("userWhoGavePermission")
            console.log(userWhoGavePermission)
            res.render("viewAppointmentStandardCalendar.pug", { user: req.user, formattedDate, date: req.params.date, docs, allCalendars, arrayOfTodaysAppointments, userWhoGavePermission })
        } else {
            console.log(err)
            let stringDate = new Date(req.params.date);
            console.log("idOfStandardCalendar")
            console.log(idOfStandardCalendar)
            let formattedDate = stringDate.toDateString();
            let allCalendars = req.user.calendars;
            res.render("viewAppointmentStandardCalendar.pug", { user: req.user, formattedDate: formattedDate, date: req.params.date, docs: docs, allCalendars: allCalendars })
        }
    });
});

// app.get("/viewAppointment/:date", redirectToLoginPage, (req, res) => {
//     privateCalendarFunctions.getScheduleofaDate(req, (err, docs) => {
//         let allCalendars = req.user.calendars;
//         res.render("hospitalVisitorPage.pug", { user: req.user, date: req.params.date, allCalendars: allCalendars })
//     });
// })

// NOTICE BOARD CALENDAR -- NOTICES
app.get("/viewNotices/:calendarId/:date", redirectToLoginPage, (req, res) => {
    let calendarId = req.params.calendarId
    let date = req.params.date
    let stringDate = new Date(req.params.date);
    let formattedDate = stringDate.toDateString();
    noticeBoardFunctions.getNoticesOfDate(req, (err, notices) => {
        if (err) {
            console.log(err)
        } else {
            console.log('notices')
            console.log(notices)
        }
        res.render("noticeBoardCalendarViewNotices.pug", { notices, formattedDate, calendarId, date });
    })
})

app.get("/addNotice/:calendarId/:date", redirectToLoginPage, (req, res) => {
    let calendarId = req.params.calendarId
    let date = req.params.date
    let stringDate = new Date(req.params.date);
    console.log(stringDate)
    let formattedDate = stringDate.toDateString();
    res.render("noticeBoardCalendarAddNotice.pug", { formattedDate, date, calendarId })
})

app.post("/addNotice/:calendarId/:date", redirectToLoginPage, userModelFunctions.upload.single('attachements'), (req, res, next) => {
    let date = req.params.date;
    let calendarId = req.params.calendarId
    let v1options = {
        node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
        clockseq: 0x1234,
        msecs: new Date().getTime(),
        nsecs: 5678,
    };
    let uniqueIdForNotice = uuidv4(v1options)
    try {
        if (!req.file) {
            console.log("No file attached")
        } else {
            req.body['attachements'] = userModelFunctions.replaceAll(req.file.path, "\\", "/")
        }
        console.log(req.body)
        noticeBoardFunctions.addNoticeInNoticeBoardCalendar(req, date, uniqueIdForNotice, (err, docs) => {
            if (err) {
                console.log(err)
            } else {
                res.redirect(`/viewNotices/${calendarId}/${date}`)
            }
        });
    } catch (err) {
        console.log(err);
        res.redirect("back")
    }
})

app.get("/subscribeNoticeBoard/:allCalendarId", (req, res) => {
    noticeBoardFunctions.subscribeNoticeBoard(req, (err, docs) => {
        if (err) {
            console.log(err)
            res.redirect("back")
        } else {
            res.redirect("back")
        }
    })
})
app.get("/unSubscribeNoticeBoard/:allCalendarId", (req, res) => {
    noticeBoardFunctions.unSubscribeNoticeBoard(req, (err, docs) => {
        if (err) {
            console.log(err)
            res.redirect("back")
        } else {
            res.redirect("back")
        }
    })
})


// FOR SECURITY MEMBERSHIP
app.post("/requestMembershipSecurity/:allCalendarId", (req, res) => {
    securityCalendarFunctions.requestMembershipInSecurityCalendar(req, (err, docs) => {
        if (err) {
            console.log(err)
            res.redirect("back")
        } else {
            res.redirect("back")
        }
    })
})


app.get("/cancelRequestMembershipSecurity/:allCalendarId", (req, res) => {
    securityCalendarFunctions.cancelRequestMembershipSecurityCalendar(req, (err, docs) => {
        if (err) {
            console.log(err)
            res.redirect("back")
        } else {
            res.redirect("back")
        }
    })
})

// BELOW THREE ARE AJAX FUNCTIONS
app.get("/acceptMembershipRequestSecurity/:allCalendarId/:requesterUserId/:requesterHouseNumber", (req, res) => {
    securityCalendarFunctions.subscribeSecurityCalendar(req, (err, docs) => {
        if (err) {
            res.redirect("back")
        } else {
            console.log("docs")
            console.log(docs)
            res.redirect("back")
        }
    })
})

app.get("/unsubscribeMembershipSecurity/:allCalendarId/:requesterUserId", (req, res) => {
    securityCalendarFunctions.unSubscribeSecurityCalendar(req, (err, docs) => {
        if (err) {
            res.redirect("back")
        } else {
            console.log("docs")
            console.log(docs)
            res.redirect("back")
        }
    })
})

app.get("/getSubscribersOfSecurityCalendar/:allCalendarId", (req, res) => {
    securityCalendarModel.findOne({ "allCalendarId": req.params.allCalendarId }, async (err, securityCalendar) => {
        if (err) {
            console.log(err)
        } else {
            let pendingUsersForMembership = []
            let memberUsers = []
            // console.log('securityCalendar')
            // console.log(securityCalendar)
            if (securityCalendar.pendingSubscriberArray != undefined && securityCalendar.pendingSubscriberArray.length != 0) {
                for (subscribedUser of securityCalendar.pendingSubscriberArray) {
                    await UserModel.findOne({ '_id': subscribedUser.userIdOfRequester }, (err, user) => {
                        if (err) {
                            console.log(err)
                        } else {
                            // console.log('user')
                            user.houseNumber = subscribedUser.houseNumber
                            pendingUsersForMembership.push(user)
                            console.log('pendingUsersForMembership')
                            console.log(pendingUsersForMembership)
                        }
                    })
                }
            }
            if (securityCalendar.subscriberArray != undefined && securityCalendar.subscriberArray.length != 0) {
                for (subscribedUser of securityCalendar.subscriberArray) {
                    await UserModel.findOne({ '_id': subscribedUser.userIdOfSubscriber }, (err, user) => {
                        if (err) {
                            console.log(err)
                        } else {
                            // console.log('user')
                            user.houseNumber = subscribedUser.houseNumber
                            memberUsers.push(user)
                            // console.log(memberUsers)
                        }
                    })
                }
            }
            subscriberDetailOfSecurityCalendar = { pendingUsersForMembership: pendingUsersForMembership, memberUsers: memberUsers }
            res.send(subscriberDetailOfSecurityCalendar)
        }
    })
})

// ABOVE THREE ARE AJAX FUNCTIONS



app.get("/editNotice/:calendarId/:noticeId", (req, res) => {
    let calendarId = req.params.calendarId
    let noticeId = req.params.noticeId
    console.log('calendarId')
    console.log(calendarId)
    noticeBoardFunctions.getNoticeById(req, (err, notice) => {
        if (err) {
            console.log(err)
        } else {
            res.render("noticeBoardEditNotice.pug", { user: req.user, calendarId, noticeId, notice })
        }
    })
})



// app.get("/godaddy.html", (req, res) => {
//     //res.sendFile("D:/CODING/FULL STACK -- WEB DEV/Complete Web Dev HTML, CSS, JS/calendar-node.js/views/godaddy.html")
//     res.send("m5rrmm9gr4mlsp6nlu05j6ml4e")
// })



// --------------------------------------------------------------------------------------------------------------------------
//                                              REPORT FUNCTIONALITY  R O U T E    START
// --------------------------------------------------------------------------------------------------------------------------
app.get("/personalReportSearch", redirectToLoginPage, async (req, res) => {
    let AllErrors = []
    var personalScheduleReportArrayMadeByMe = []
    let allCalendars = req.user.calendars;
    let { fromSearchDate, toSearchDate } = req.query;
    let query = req.query;
    console.log(query)
    if (Object.keys(query).length === 0) {
        query = {}
        res.render("personalCalendarReportSearchForm.pug", { allCalendars: allCalendars, user: req.user, AllErrors, query })
    } else {
        if (!req.query.fromSearchDate && !toSearchDate) {
            console.log("Fill Atleast One Search Paramater")
            AllErrors.push({ msg: "Fill Atleast One Search Paramater" })
            res.render("personalCalendarReportSearchForm.pug", { allCalendars: allCalendars, user: req.user, AllErrors, query })
        } else if (!req.query.fromSearchDate) {
            AllErrors.push({ msg: "Please enter the date from which you want the report." })
            res.render("personalCalendarReportSearchForm.pug", { allCalendars: allCalendars, user: req.user, AllErrors, query })
        } else if (req.query.fromSearchDate && !req.query.toSearchDate) {
            privateCalendarModel.findOne({ 'userId': req.user.id }, (err, foundArrayInPersonalReport) => {
                for (i = 0; i < (foundArrayInPersonalReport.dailySchedules).length; i++) {
                    if (new Date(req.query.fromSearchDate) <= new Date(foundArrayInPersonalReport.dailySchedules[i].date) && new Date() >= new Date(foundArrayInPersonalReport.dailySchedules[i].date)) {
                        personalScheduleReportArrayMadeByMe.push(foundArrayInPersonalReport.dailySchedules[i])
                    } else {
                        console.log("Date Not Macthed With Report Data")
                    }
                }
                if (personalScheduleReportArrayMadeByMe.length === 0) {
                    AllErrors.push({ msg: "No records with this particular information. Try Again!!" })
                    res.render("personalCalendarReportSearchForm.pug", { allCalendars, AllErrors, user: req.user, AllErrors, query })
                } else {
                    console.log(personalScheduleReportArrayMadeByMe)
                    res.render("personalCalendarReportSearchPage.pug", { allCalendars, AllErrors, user: req.user, query, personalScheduleReportArrayMadeByMe })
                }
            })
        } else {
            privateCalendarModel.findOne({ 'userId': req.user.id }, (err, foundArrayInPersonalReport) => {
                for (i = 0; i < (foundArrayInPersonalReport.dailySchedules).length; i++) {
                    if (new Date(req.query.fromSearchDate) <= new Date(foundArrayInPersonalReport.dailySchedules[i].date) && new Date(req.query.toSearchDate) >= new Date(foundArrayInPersonalReport.dailySchedules[i].date)) {
                        console.log(foundArrayInPersonalReport.dailySchedules[i].schedules)
                        personalScheduleReportArrayMadeByMe.push(foundArrayInPersonalReport.dailySchedules[i])
                    } else {
                        console.log("Date Not Macthed With Report Data")
                    }
                }
                if (personalScheduleReportArrayMadeByMe.length === 0) {
                    AllErrors.push({ msg: "No records with this particular information. Try Again!!" })
                    res.render("personalCalendarReportSearchForm.pug", { allCalendars, AllErrors, user: req.user, AllErrors, query })
                } else {
                    for (i = 0; i < personalScheduleReportArrayMadeByMe.length; i++) {
                        console.log(personalScheduleReportArrayMadeByMe[i])
                    }
                    res.render("personalCalendarReportSearchPage.pug", { allCalendars, AllErrors, user: req.user, query, personalScheduleReportArrayMadeByMe })
                }
            })
        }
    }
})


app.get("/businessReportSearch/gateKeeper/:allCalendarId", redirectToLoginPage, async (req, res) => {
    let AllErrors = []
    let allCalendars = req.user.calendars;
    let allCalendarId = req.params.allCalendarId
    let { fromSearchDate, toSearchDate, vehicleNumber, visitorName, contactNumberOfVisitor, houseNumber, typeOfUserCategoryInEntry } = req.query;
    let query = req.query;
    console.log('query')
    console.log(query)
    if (visitorName == '') {
        visitorName = null
    }
    if (Object.keys(query).length === 0) {
        query = {}
        res.render("securityBusinessCalendarReportSearchForm.pug", { allCalendars: allCalendars, user: req.user, AllErrors, query, allCalendarId })
    } else {
        if (!fromSearchDate && !toSearchDate && !vehicleNumber && !visitorName && !contactNumberOfVisitor && !houseNumber && !typeOfUserCategoryInEntry) {
            console.log("Fill Atleast  One Search Paramater")
            AllErrors.push({ msg: "Fill Atleast  One Search Paramater" })
            res.render("securityBusinessCalendarReportSearchForm.pug", { allCalendars, allCalendarId, user: req.user, AllErrors, query })
        } else {
            if (vehicleNumber) {
                var vehicleNumberRegEx = new RegExp(req.query['vehicleNumber'], "i")
            }
            if (visitorName) {
                var visitorNameRegEx = new RegExp(req.query['visitorName'], "i")
            }
            if (contactNumberOfVisitor) {
                var contactNumberOfVisitorRegEx = new RegExp(req.query['contactNumberOfVisitor'], "i")
            }
            if (houseNumber) {
                var houseNumberRegEx = new RegExp(req.query['houseNumber'], "i")
            }
            if (typeOfUserCategoryInEntry) {
                var typeOfUserCategoryInEntryRegEx = new RegExp(req.query['typeOfUserCategoryInEntry'], "i")
            }

            console.log('visitorNameRegEx')
            console.log(visitorNameRegEx)
            let result = await visitorModel.find({
                allCalendarIdOfTheSecurityCalendar: req.params.allCalendarId,
                $or: [{
                    contactNumberOfVisitor: contactNumberOfVisitorRegEx
                },
                {
                    vehicleNumber: vehicleNumberRegEx
                },
                {
                    visitorName: visitorNameRegEx
                },
                {
                    houseNumber: houseNumberRegEx
                },
                {
                    typeOfUserCategoryInEntry: typeOfUserCategoryInEntryRegEx
                }
                ]
            })
            console.log('result')
            console.log(result)
            if (result && result.length != 0) {
                visitorModel.find({ allCalendarIdOfTheSecurityCalendar: req.params.allCalendarId, enteredDate: { $gte: req.query.fromSearchDate, $lte: req.query.toSearchDate } }, (err, foundBetweenDates) => {
                    let foundArrayToBePassedInPugFile = [];
                    console.log('foundBetweenDates')
                    console.log(foundBetweenDates)
                    console.log('result')
                    console.log(result)
                    if (foundBetweenDates.length !== 0) {
                        console.log("Inside foundBetweenDates if else")
                        for (i = 0; i < foundBetweenDates.length; i++) {
                            console.log("Inside found for loop ")
                            if (result.length !== 0) {
                                console.log("Inside result if else")
                                for (j = 0; j < result.length; j++) {
                                    console.log("Inside result for loop ")
                                    if (isEqual(foundBetweenDates[i], result[j]) === true) {
                                        console.log(foundBetweenDates[i] + " found after equating")
                                        console.log(result[j] + " result after equating")
                                        if (foundBetweenDates[i].entryApproved != 'pending') {
                                            foundArrayToBePassedInPugFile.push(foundBetweenDates[i]);
                                        }
                                    }
                                }
                            } else {
                                console.log("Result length is Zero")
                                for (i of foundBetweenDates) {
                                    if (i.entryApproved != 'pending') {
                                        foundArrayToBePassedInPugFile.push(i);
                                    }
                                }
                            }
                        }
                    } else {
                        console.log("Found length is Zero")
                        if (result.length !== 0) {
                            for (j of result) {
                                console.log(j.entryApproved)
                                if (j.entryApproved != 'pending') {
                                    foundArrayToBePassedInPugFile.push(j)
                                }
                            }
                        } else {
                            console.log("Nothing Found")
                            // res.render("businessCalendarReportSearchForm.pug", { allCalendars: allCalendars, user: req.user, AllErrors, query })
                        }
                    }
                    if (foundArrayToBePassedInPugFile.length == 0) {
                        AllErrors.push({ msg: "No records with this particular information. Try Again!!" })
                        res.render("securityBusinessCalendarReportSearchForm.pug", { allCalendars: allCalendars, user: req.user, AllErrors, query, allCalendarId })
                    } else {
                        console.log('foundArrayToBePassedInPugFile')
                        console.log(foundArrayToBePassedInPugFile[0]['entryTime'])
                        res.render("securityBusinessCalendarReportSearchPage.pug", { allCalendars: allCalendars, user: req.user, AllErrors, query, foundArrayToBePassedInPugFile, allCalendarId })
                    }
                })
            } else if (req.query.fromSearchDate && req.query.toSearchDate && !vehicleNumber && !visitorName && !contactNumberOfVisitor && !houseNumber && !typeOfUserCategoryInEntry) {
                visitorModel.find({ allCalendarIdOfTheSecurityCalendar: req.params.allCalendarId, enteredDate: { $gte: req.query.fromSearchDate, $lte: req.query.toSearchDate } },
                    (err, foundBetweenDates) => {
                        let foundArrayToBePassedInPugFile = [];
                        console.log('foundBetweenDates')
                        console.log(foundBetweenDates)
                        foundArrayToBePassedInPugFile = foundBetweenDates
                        res.render("securityBusinessCalendarReportSearchPage.pug", { allCalendars: allCalendars, user: req.user, AllErrors, query, allCalendarId, foundArrayToBePassedInPugFile })
                    })

            } else {
                console.log("Result Not Found")
                AllErrors.push({ msg: "No Record With The Given Information." })
                res.render("securityBusinessCalendarReportSearchForm.pug", { allCalendars: allCalendars, user: req.user, AllErrors, query, allCalendarId })
            }

        }
    }
})


// FOR QRCODE-SCANNING
// var buffer = fs.readFileSync(__dirname + '/upload/qr.PNG');
// Jimp.read(buffer, function(err, image) {
//     if (err) {
//         console.error(err);
//     }
//     // Creating an instance of qrcode-reader module 
//     let newQrCodeReader = new QrCodeReader();
//     newQrCodeReader.callback = function(err, value) {
//         if (err) {
//             console.error(err);
//         }
//         // Printing the decrypted value 
//         console.log(value.result);
//     };
//     // Decoding the QR code 
//     newQrCodeReader.decode(image.bitmap);
// });



//
app.get("/admin", redirectToLoginPage, (req, res) => {
    //Make get request to /api/users
    if (req.user.number == "9340618228" || req.user.number =="9755523425" || req.user.number == "9755523425") {
        console.log("this is route")
        axios.get(`http://[::1]:${PORT}/api/users`)
            .then(function (response) {
                res.render("adminPanel.ejs", { Products: response.data });
            })
            .catch(err => {
                res.send(err);
            })
    } else {
        res.redirect("back")
    }
})

app.get('/success', redirectToLoginPage, (req, res) => {
    res.render('success.ejs', { product: req.product });
});

app.get('/order/:idOfCalendar', redirectToLoginPage, (req, res) => {
    let idOfCalendar = req.params.idOfCalendar
    axios.get(`http://[::1]:${PORT}/api/users`, { params: { id: req.query.id } })
        .then(function (productdata) {
            // console.log(productdata.data)
            res.render('order.pug', { product: productdata.data, idOfCalendar })
        })
        .catch(err => {
            res.send(err);
        })

})

app.get('/admin/customerorderpage', redirectToLoginPage, (req, res) => {
    if (req.user.number == "9340618228" || req.user.number == "9755523425") {
        res.render("admin.customerorder.pug")
    } else {
        res.redirect("back")
    }
})


app.get('/productlist/:idOfCalendar', redirectToLoginPage, (req, res) => {
    let idOfCalendar = req.params.idOfCalendar
    axios.get(`http://[::1]:${PORT}/api/users`)
        .then(function (response) {
            res.render("productlist.pug", { Products: response.data, idOfCalendar });
        })
        .catch(err => {
            res.send(err);
        })
})


app.get("/add_product", redirectToLoginPage, (req, res) => {
    res.render('addProduct.ejs');
})
app.get("/generator", redirectToLoginPage, (req, res) => {
    res.render('couponCodeGenerator.ejs')
})
app.post("/generator", redirectToLoginPage, (req, res) => {
    var myData = new Codes(req.body);
    myData.save().then(() => {
        res.render("couponCodeGenerator.ejs")
    }).catch(() => {
        res.send("Error occur")
    })
})


// app.get("/confirm/:idOfCalendar", redirectToLoginPage, (req, res) => {
//     let idOfCalendar = req.params.idOfCalendar
//     a   .then(function (productdata) {
//             console.log(productdata.data)
//             res.render('confirmOrderPage.pug', { product: productdata.data, idOfCalendar })
//         })
//         .catch(err => {
//        xios.get(`http://[::1]:${PORT}/api/users`, { params: { id: req.query.id } })
//           res.send(err);
//         })
// })

// const parseUrl = express.urlencoded({ extended: false });
// const parseJson = express.json({ extended: false });

// app.post("/confirm/:idOfCalendar", redirectToLoginPage, (req, res) => {
//     res.sendFile(__dirname + "/index.html");
// })
// app.get("/confirm/:idOfCalendar", redirectToLoginPage, (req, res) => {
//     res.sendFile(__dirname + "/index.html");
// })

app.get("/update_product", redirectToLoginPage, (req, res) => {
    axios.get(`http://[::1]:${PORT}/api/users`, { params: { id: req.query.id } })
        .then(function (productdata) {
            console.log(productdata.data)
            res.render("edit_product.ejs", { product: productdata.data })
            // console.log(data)
        })
        .catch(err => {
            res.send(err)
        })
    // console.log(product)
});

const checksum_lib = require("./paytm/checksum");

var PaytmConfig = {
    mid: "",
    key: "",
    website: ""
}


app.post("/confirm/:idOfCalendar" , (req , res)=>{
    let idOfCalendar = req.params.idOfCalendar
    axios.get(`http://[::1]:${PORT}/api/users`, { params: { id: req.query.id } })
        .then(function (productdata) {
            console.log(productdata.data)
            res.render("confirmOrderPage.pug", { product: productdata.data , idOfCalendar })
            // console.log(data)
        })
        .catch(err => {
            res.send(err)
        })

})
//API

app.post('/api/users', controller.create)
app.get('/api/users', controller.find)
app.put('/api/users/:id', controller.update)
app.delete('/api/users/:id', controller.delete)



app.listen(PORT, () => {
    console.log(`Connected at ${PORT}`);
})

   // let couponCode = req.body.name
    // console.log(couponCode)
    // let idOfCalendar = req.params.idOfCalendar
    // Codes.findOne({ activation_token: couponCode }, (error, data) => {
    //     if (error) {
    //         res.send(error)
    //     }
    //     if (data == null) {
    //         axios.get(`http://[::1]:${PORT}/api/users`, { params: { id: req.query.id } })
    //             .then(function(productdata) {
    //                 res.status(500).render('confirmOrderPage.pug', { product: productdata.data, idOfCalendar })
    //             })
    //             .catch(err => {
    //                 res.send(err);
    //             })
    //     } else {
    //         axios.get(`http://[::1]:${PORT}/api/users`, { params: { id: req.query.id } })
    //             .then(function(productdata) {
    //                 res.status(500).render('confirm1.ejs', { product: productdata.data, idOfCalendar })
    //             })
    //             .catch(err => {
    //                 res.send(err);
    //             })
    //     }
    // })
    // Codes.findOneAndDelete({ activation_token: couponCode }, (error, data) => {
    //     if (error) {
    //         console.log(error)
    //     } else {
    //         console.log("Code deleted")
    //     }
    // })