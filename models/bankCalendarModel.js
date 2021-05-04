const mongoose = require('mongoose');
const dailyVisitor = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    appointments: [{
        type: mongoose.ObjectId,
        ref: 'bankAppointments'
    }],
    
});
const bankModel = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'users',
    },
    calendarId: {
        type: mongoose.ObjectId,
        required: true,
        ref: 'calendars',
        unique: true
    },
    dailyVisitors: [{
        type: dailyVisitor,
        default: []
    }],
});
module.exports = mongoose.model('bank', bankModel, 'bank');