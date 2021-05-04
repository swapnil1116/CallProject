const mongoose = require('mongoose');
const userModel = require('../models/userModel');
const allCalendarModel = require('../models/allCalendarModel');


async function searchUser(req, searchText, callback) {
    let result = await userModel.find({
        $text: {
            $search: searchText,
            $caseSensitive: false
        }
    });

    if (result) {
        // console.log(result);
        callback(null, result);
    } else {
        callback({ msg: "No Users found" }, null);
    }
}

async function searchCalendars(req, callback) {
    req.query.calendarSearch = req.query.calendarSearch.replace(/\\/g, '');
    console.log(req.query.calendarSearch)
    let result = await allCalendarModel.find({
        $or: [
            { "calendarType": { '$regex': req.query.calendarSearch, '$options': 'i' } },
            { "businessName": { '$regex': req.query.calendarSearch, '$options': 'i' } },
            { "businessDescription": { '$regex': req.query.calendarSearch, '$options': 'i' } }
        ]
    });
    // let result = await allCalendarModel.find({
    //     "calendarType": { $in: ["bank", "hospital", "gateKeeper", "pharmacy", "private", "standard"] },
    //     $text: {
    //         $search: req.query.calendarSearch,
    //         $caseSensitive: false
    //     }
    // });

    if (result) {
        callback(null, result);
    } else {
        callback({ msg: "No Calendars found" }, null);
    }
}
module.exports = {
    searchUser,
    searchCalendars
}