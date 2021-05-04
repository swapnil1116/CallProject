const {
    v4: uuidv4,
    parse: uuidParse,
    stringify: uuidStringify
} = require('uuid')

const mongoose = require('mongoose');
const notice = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    noticeDate: {
        type: String
    },
    start: {
        type: String
    },
    end: {
        type: String
    },
    noticeHeading: {
        type: String,
        default: null
    },
    noticeDescription: {
        type: String,
        default: null
    },
    noticeIssueTime: {
        type: Date,
        default: Date.now()
    },
    attachements: {
        type: String,
        default: null
    },
    watchedUsers: []
})
const allNotices = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        index: true
    },
    notices: [notice]
})
const noticeBoardModel = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'allUsers'
    },
    allCalendarId: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'allCalendars'
    },
    subscriberArray: {
        type: Array,
        unique: false,
        sparse: true
    },
    allNotices: [allNotices]
});

module.exports = mongoose.model('noticeBoardModel', noticeBoardModel)