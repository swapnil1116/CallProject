const {
    v4: uuidv4,
    parse: uuidParse,
    stringify: uuidStringify
} = require('uuid')

const mongoose = require('mongoose');

const appointments = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    dateOfAppointment: {
        type: String,
        required: true
    },
    requester: {
        type: String,
        required: true
    },
    requesterMobileNumber: {
        type: String
    },
    requesterUserId: {
        type: String,
        required: true
    },
    start: {
        type: String
    },
    end: {
        type: String
    },
    description: {
        type: String
    },
    appointmentApproved: {
        type: String
    },
    documentImageInScheduleOrAppointment: {
        type: String,
        default: null
    },
    timeAndDateWhenCreated: {
        type: Date,
        default: Date.now()
    }
});
const dailyAppointment = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        index: true
    },
    appointments: [appointments],
    freeTime: [{
        start: {
            type: String,
        },
        end: {
            type: String,
        }
    }],
    pendingAppointmentList: [{
        type: String,
        refPath: 'dailyAppointments.appointments',
        default: [uuidv4]
    }],
    cancelledAppointmentList: [{
        type: String,
        refPath: 'dailyAppointments.appointments',
        default: [uuidv4]
    }],
    acceptedAppointmentList: [{
        type: String,
        refPath: 'dailyAppointments.appointments',
        default: [uuidv4]
    }]
});


const visitor = new mongoose.Schema({
    visitorName: {
        type: String,
        required: true
    },
    entryTime: {
        type: Date,
        default: Date.now()
    },
    purpose: {
        type: String
    }
});

const dailyVisitors = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        index: true
    },
    visitors: [visitor]
});

const standardCalendarModel = new mongoose.Schema({
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
    dailyVisitors: [dailyVisitors],
    dailyAppointments: [dailyAppointment]
});

module.exports = mongoose.model('standardCalendar', standardCalendarModel);