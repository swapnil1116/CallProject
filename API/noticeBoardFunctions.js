const mongoose = require('mongoose');
const allCalendarModel = require('../models/allCalendarModel');
const noticeBoardModel = require('../models/noticeBoardModel');
const userModel = require('../models/userModel');
const timeManipulation = require('./helpers/timeManipulation');

async function addNoticeInNoticeBoardCalendar(req, date, uniqueIdForNotice, callback) {
    let foundNoticeBoardCalendar = await noticeBoardModel.findOne({ allCalendarId: req.params.calendarId }).select('')
    console.log("foundNoticeBoardCalendar")
    console.log(foundNoticeBoardCalendar)
    let noticeInParticularDate = await noticeBoardModel.findOne({
        allCalendarId: req.params.calendarId,
        'allNotices.date': date
    }).select('allNotices.$');
    let notice = {}
    for (element in req.body) {
        notice[element] = req.body[element]
    }
    notice._id = uniqueIdForNotice
    notice.noticeDate = date
    notice.watchedUsers = []
    notice.noticeIssueTime = Date.now()
    console.log("notice")
    console.log(notice)
    if (noticeInParticularDate) {
        console.log("noticeInParticularDate")
        console.log(noticeInParticularDate)
        noticeInParticularDate.allNotices[0].notices.push(notice)
        console.log("noticeInParticularDate agfaion")
        console.log(noticeInParticularDate.allNotices[0].notices)
        await noticeBoardModel.updateOne({
            allCalendarId: req.params.calendarId,
            "allNotices": {
                "$elemMatch": {
                    "date": date
                }
            }
        }, {
            '$set': {
                'allNotices.$': noticeInParticularDate.allNotices[0]
            }
        }, (err, doc) => {
            if (!err) {
                // console.log(doc);
                if (doc.ok == 1) {

                    console.log("successfully added on the same date")
                    callback(null, doc)

                } else {
                    console.log('error while adding on the same date!')
                }
            } else {
                console.log(err)
            }
        })
    } else {
        noticeBoardModel.findOne({
            allCalendarId: req.params.calendarId
        }, (err, noticeBoardCalendar) => {
            if (err) {
                console.log(err)
            } else {
                console.log()
                console.log("not found notice on this date")
                console.log(date)
                let allNotices = {
                    date: date,
                    notices: [notice]
                }
                noticeBoardCalendar.allNotices.push(allNotices)
                noticeBoardCalendar.save();
                callback(null, {
                    msg: "successfully added notice into calendar"
                });
            }
        })

    }
};
async function getNoticesOfDate(req, callback) {
    let noticeInParticularDate = await noticeBoardModel.findOne({
        allCalendarId: req.params.calendarId,
    }).select('');
    let allNoticesForThisDate = []
    console.log('noticeInParticularDate')
    console.log(noticeInParticularDate)
    if (noticeInParticularDate) {
        for (singleNotice of noticeInParticularDate.allNotices) {
            for (noticeDetail of singleNotice.notices) {
                if (noticeDetail.start <= req.params.date && noticeDetail.end >= req.params.date) {
                    allNoticesForThisDate.push(noticeDetail)
                }
            }
        }
        // let notices = noticeInParticularDate.allNotices[0].notices
        if (allNoticesForThisDate.length != 0) {
            callback(null, allNoticesForThisDate);
        } else {
            callback(new Error("no notices on this date found", null))
        }
    } else {
        callback(new Error("no notices on this date found", null))
    }
}
async function getNoticeById(req, callback) {
    let noticeInParticularDate = await noticeBoardModel.findOne({
        allCalendarId: req.params.calendarId,
    }).select('');
    let allNoticesForThisDate = []
    console.log('noticeInParticularDate')
    console.log(noticeInParticularDate)
    if (noticeInParticularDate) {
        for (singleNotice of noticeInParticularDate.allNotices) {
            for (noticeDetail of singleNotice.notices) {
                if (noticeDetail._id == req.params.noticeId) {
                    allNoticesForThisDate.push(noticeDetail)
                }
            }
        }
        // let notices = noticeInParticularDate.allNotices[0].notices
        if (allNoticesForThisDate.length != 0) {
            callback(null, allNoticesForThisDate);
        } else {
            callback(new Error("no notices by this Id found", null))
        }
    } else {
        callback(new Error("no notices by this Id found", null))
    }
}
async function getAllNotices(req, callback) {
    let allNotices = []
    let allNoticesOfCalendar = await noticeBoardModel.findOne({
        allCalendarId: req.params._id,
    }).select('allNotices');
    if (allNoticesOfCalendar) {
        // console.log(allNoticesOfCalendar.allNotices)
        // console.log('allNoticesOfCalendar.allNotices')
        for (noticeOfParticularDate of allNoticesOfCalendar.allNotices) {
            for (singleNotice of noticeOfParticularDate.notices) {
                allNotices.push({
                    start: singleNotice.start,
                    end: singleNotice.end,
                    heading: singleNotice.noticeHeading,
                    date: singleNotice.noticeDate
                })
            }
            // console.log('noticeHeadings')
            // console.log(noticeHeadings)
        }
        if (allNotices.length > 0) {
            callback(null, allNotices)
        } else {
            callback(new Error("No Notices found!!"), null)
        }
    } else {
        callback(new Error("no notice business found!!"), null)
    }
}
async function subscribeNoticeBoard(req, callback) {
    noticeBoardModel.findOne({ allCalendarId: req.params.allCalendarId }, (err, noticeBoardCalendar) => {
        console.log(noticeBoardCalendar)
        console.log(req.user._id)
        if (noticeBoardCalendar) {
            let subscriberArray = noticeBoardCalendar.subscriberArray
            let subscribedBusinessObject = {}
            let alreadyUserSubscribed = subscriberArray.find(element => (element).toString() == (req.user._id).toString());
            if (!alreadyUserSubscribed) {
                noticeBoardCalendar.subscriberArray.push(req.user._id)
                noticeBoardCalendar.save()
                subscribedBusinessObject.userIdOfTheBusinessCalendar = noticeBoardCalendar.userId
                subscribedBusinessObject.businessCalendarTypeId = noticeBoardCalendar.allCalendarId
                subscribedBusinessObject.businessCalendarType = 'noticeBoard'
                subscribedBusinessObject.subscription = 'Subscribed'
                userModel.findOne({ _id: req.user._id }, (err, user) => {
                    if (err) {
                        callback(new Error("User not found"), null)
                    } else {
                        console.log('subscribedBusinessObject')
                        console.log(subscribedBusinessObject)
                        user.subscribedBusinessCalendars.push(subscribedBusinessObject)
                        user.save()
                    }
                })
                callback(null, "done")
            } else {
                callback(new Error("User Already Subscribed"), null)
            }
        } else {
            callback(new Error("No notice board calendar found!!"), null)
        }
    })
}
async function unSubscribeNoticeBoard(req, callback) {
    noticeBoardModel.findOne({ allCalendarId: req.params.allCalendarId }, (err, noticeBoardCalendar) => {
        console.log(noticeBoardCalendar)
        console.log(req.user._id)
        if (noticeBoardCalendar) {
            noticeBoardModel.updateOne({ allCalendarId: req.params.allCalendarId }, {
                $pull: { "subscriberArray": req.user._id }
            }, (err, doc) => {
                if (err) {
                    callback(new Error("Subscribers not updated"), null)
                } else {
                    userModel.findOne({ _id: req.user._id }, (err, user) => {
                        console.log('user')
                        console.log(user)
                    })
                    userModel.updateOne({ _id: req.user._id }, {
                        $pull: { "subscribedBusinessCalendars": { "businessCalendarTypeId": req.params.allCalendarId } }
                    }, { multi: true }, (err, anotherDoc) => {
                        if (err) {
                            callback(new Error("Business subscribed by user not updated"), null)
                        } else {
                            callback(null, "done")
                            console.log(anotherDoc)
                        }
                    })
                    console.log(doc)
                }
            })
        } else {
            callback(new Error("No notice board calendar found!!"), null)
        }
    })
}


module.exports = {
    getNoticesOfDate,
    getAllNotices,
    getNoticeById,
    addNoticeInNoticeBoardCalendar,
    subscribeNoticeBoard,
    unSubscribeNoticeBoard
}