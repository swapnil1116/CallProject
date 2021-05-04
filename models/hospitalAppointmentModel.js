const mongoose = require('mongoose');
const updateModel = new mongoose.Schema({
    createdBy: {
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    update:{
        type:String,
        required:true
    },
    attachments:[String]
});
const appointmentModel = new mongoose.Schema({
    requester: {
        type: mongoose.ObjectId,
        ref: 'allUsers',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    calendarId: {
        type: mongoose.ObjectId,
        ref: 'allCalendars',
        required: true
    },
    start:{
        type:String,
        required:true
    },
    end:{
        type:String,
        required:true
    },
    service:{
        type:String,
        required:true
    },
    purpose: {
        type: String,
        require: true
    },
    details: {
        type: String,
        require: true
    },
    attachments: [{
        type: String,
        default: []
    }],
    shouldRemind: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    updates:[updateModel]
});
module.exports = mongoose.model('hospitalappointments', appointmentModel, 'hospitalAppointments');