const mongoose = require('mongoose');
const dailyrequest = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        index: true
    },
    pendingRequests: [{
        type: mongoose.ObjectId,
        ref: 'pharmacyAppointments'
    }],
    doneRequests:[{
        type: mongoose.ObjectId,
        ref: 'pharmacyAppointments'
    }]
});

const pharmacyModel = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'allUsers',
    },
    allCalendarId: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'allCalendars',
        unique: true
    },
    dailyRequests:[dailyrequest]
});
module.exports = mongoose.model('pharmacy', pharmacyModel, 'pharmacy');