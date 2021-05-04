const {
    v4: uuidv4,
    parse: uuidParse,
    stringify: uuidStringify
} = require('uuid')

const mongoose = require('mongoose');
const visitor = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    visitorName: {
        type: String,
        required: true
    },
    houseNumber: {
        type: String
    },
    enteredDate: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        default: null
    },
    entryTime: {
        type: Date,
        default: null
    },
    exitTime: {
        type: Date,
        default: null
    },
    cancelledTime: {
        type: Date,
        default: null
    },
    vehicleNumber: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    vehicleType: {
        type: Number,
        default: null
    },
    from: {
        type: String,
        default: null
    },
    to: {
        type: String,
        required: true
    },
    contactNumberOfVisitor: {
        type: String,
        default: null
    },
    idOfVisitor: {
        type: String,
        default: null
    },
    idOfHost: {
        type: String,
        default: null
    },
    entryApproved: {
        type: String
    },
    entryApprovedOrCancelledByUserId: {
        type: String,
        default: null
    },
    typeOfUserCategoryInEntry: {
        type: String,
        refPath: 'securityModel.entryTypeUserCategoryArray'
    },
    allCalendarIdOfTheSecurityCalendar: {
        type: String,
    }
});
const dailyVisitor = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },

    visitors: [{
        type: visitor,
        default: []
    }],
    entered: [{
        type: String,
        refPath: 'dailyVisitors.visitors',
        default: [uuidv4]
    }],
    exited: [{
        type: String,
        refPath: 'dailyVisitors.visitors',
        default: [uuidv4]
    }],
    pendingEntryList: [{
        type: String,
        refPath: 'dailyVisitors.visitors',
        default: [uuidv4]
            // type: mongoose.ObjectId,
            // refPath: 'dailyVisitors.visitors',
            // default: []
    }],
    cancelledEntryList: [{
            type: String,
            refPath: 'dailyVisitors.visitors',
            default: [uuidv4]
        }]
        // acceptedEntryList: [{
        //     type: String,
        //     refPath: 'dailyVisitors.visitors',
        //     default: [uuidv4]
        // }]
});

const appointments = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    dateOfAppointment: {
        type: String,
    },
    requester: {
        type: String,
    },
    requesterMobileNumber: {
        type: String
    },
    requesterUserId: {
        type: String,
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

const costModel = new mongoose.Schema({
    "2": {
        type: Number,
        default: 0
    },
    "4": {
        type: Number,
        default: 0
    }
});
const pendingSubscriber = new mongoose.Schema({
    status: {
        type: String
    },
    userIdOfRequester: {
        type: String
    },
    houseNumber: {
        type: String
    }
})
const subscribers = new mongoose.Schema({
    userIdOfSubscriber: {
        type: String
    },
    houseNumber: {
        type: String
    },
    adminRights: {
        type: Boolean,
        default: true
    },
    recieveEmailNotificationOrNot: {
        type: Boolean,
        default: true
    },
    recieveMsgNotificationOrNot: {
        type: Boolean,
        default: true
    }
})
const securityModel = new mongoose.Schema({
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
    paid: {
        type: Boolean,
        default: false
    },
    cost: {
        type: costModel,
    },
    guards: [{
        type: mongoose.ObjectId,
        ref: 'users',
        default: []
    }],
    dailyVisitors: [{
        type: dailyVisitor,
        default: []
    }],
    dailyMaximumParkingEntry: {
        type: Number,
        default: null
    },
    dailyAppointments: [dailyAppointment],
    subscriberArray: [subscribers],
    pendingSubscriberArray: [pendingSubscriber],
    entryTypeUserCategoryArray: {
        type: Array,
        default: [
            "Committee Member", "Member", "Security Guard", "Maid", "Delivery", "Guest", "House Keeping", "Milk Man", "Hawker"
        ]
    }
});

// securityModel.index({ 'dailyVisitors.date': 'text','dailyVisitors.visitors.contactNumber': 'text', 'dailyVisitors.visitors.vehicleNumber':'text' , 'dailyVisitors.visitors.visitorName' : 'text' });
visitor.index({ enteredDate: 'text', contactNumberOfVisitor: 'text', vehicleNumber: 'text', visitorName: 'text', houseNumber: 'text', });

let securityCalendarModel = mongoose.model('security', securityModel, 'security');
let visitorModel = mongoose.model('visitorModel', visitor)
module.exports = {
    securityCalendarModel,
    visitorModel
}