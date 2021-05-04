const mongoose = require('mongoose');

const timeModel = new mongoose.Schema({
    open: {
        type: String,
        default: null
    },
    close: {
        type: String,
        default: null
    },
    entry: {
        type: Number,
        default: 1
    },
    enabled: {
        type: Boolean,
        default: true
    }
});
const serviceModel = new mongoose.Schema({
    serviceName: {
        type: String,
        default: null
    },
    duration: {
        type: String,
        default: null
    },
    enabled: {
        type: Boolean,
        default: false
    }
});
const daysModel = new mongoose.Schema({
    mon: {
        type: timeModel,
        default: null
    },
    tues: {
        type: timeModel,
        default: null
    },
    wed: {
        type: timeModel,
        default: null
    },
    thurs: {
        type: timeModel,
        default: null
    },
    fri: {
        type: timeModel,
        default: null
    },
    sat: {
        type: timeModel,
        default: null
    },
    sun: {
        type: timeModel,
        default: null
    }
});
const calendarModel = new mongoose.Schema({
    profilePicBusiness: {
        type: String,
        default: null
    },
    businessName: {
        type: String,
    },
    businessDescription: {
        type: String,
    },
    calendarType: {
        type: String,
    },
    calendarId: {
        type: mongoose.ObjectId,
        required: true,
        refPath: 'calendarType'
    },
    userId: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'allUsers'
    },
    days: {
        type: daysModel,
        default: null
    },
    businessaddress: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    },
    country: {
        type: String,
        default: null
    },
    state: {
        type: String,
        default: null
    },
    pin: {
        type: String,
        default: null
    },
    autoApprove: {
        type: Boolean,
        default: false
    },
    appointmentId: {
        type: mongoose.ObjectId,
        ref: 'calendarsAppointmentStatus',
        default: null
    },
    services: [serviceModel]
});
calendarModel.index({ businessName: 'text', businessDescription: 'text', calendarType: 'text' });
module.exports = mongoose.model('allCalendars', calendarModel);