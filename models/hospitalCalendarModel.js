const mongoose = require('mongoose');

const dailyAppointment = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        index: true
    },
    appointments: [{
        type: mongoose.ObjectId,
        ref: 'hospitalAppointments'
    }],
    freeTime: [{
        start: {
            type: String,
        },
        end: {
            type: String,
        }
    }]
});

const visitor = new mongoose.Schema({
    patientName: {
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

const dailyPatients = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        index: true
    },
    visitors: [visitor]
});

const hospitalModel = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'allUsers',
    },
    allCalendarId: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'allCalendars',
    },
    dailyVisitors: [dailyPatients],
    dailyAppointments: [dailyAppointment]
});

module.exports = mongoose.model('hospital', hospitalModel, 'hospital');