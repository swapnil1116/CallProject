const {
    v4: uuidv4,
    parse: uuidParse,
    stringify: uuidStringify
} = require('uuid')
const mongoose = require('mongoose');

const individualScheduleModel = mongoose.Schema({
    dateOfSchedule: {
        type: String,
        required: true
    },
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    },
    heading: {
        type: String,
        // required: true
    },
    description: {
        type: String,
        default: null
    },
    appointmentId: {
        type: String,
        default: null
    },
    documentImageInScheduleOrAppointment: {
        type: String,
        default: null
    },
    userIdOfTheBusinessWhichYouRequested: {
        type: String,
        default: null
    },
    calendarIdOfTheBusinessWhichYouRequested: {
        type: String,
        default: null
    },
    calendarTypeOfTheBusinessWhichYouRequested: {
        type: String,
        default: null
    },

    nameOfTheBusinessWhichYouRequested: {
        type: String,
        default: null
    },
    appointmentApproved: {
        type: String,
        default: null
    },
    timeAndDateWhenCreated: {
        type: Date,
        default: Date.now()
    }
});
const dailyScheduleModel = mongoose.Schema({
    date: {
        type: String,
        required: true,
        index: true
    },
    schedules: [individualScheduleModel],
    freeTime: [{
        start: {
            type: String,
        },
        end: {
            type: String,
        }
    }]
});


const appointments = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    dateOfAppointment: {
        type: String,
        required: true
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

const personalCalendarModel = mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'allUsers',
        unique: true
    },
    allCalendarId: {
        type: mongoose.ObjectId,
        ref: 'allCalendars',
        unique: true
    },
    dailySchedules: [dailyScheduleModel],
    dailyAppointments: [dailyAppointment]
});
module.exports = mongoose.model('private', personalCalendarModel, 'private');