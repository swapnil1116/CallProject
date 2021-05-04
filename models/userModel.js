const {
    v4: uuidv4,
    parse: uuidParse,
    stringify: uuidStringify
} = require('uuid')
const mongoose = require('mongoose');

const documentModel = mongoose.Schema({
    description: {
        type: String
    },
    url: {
        type: String,
        required: true,
    }
});

const CalendarEntryModel = mongoose.Schema({
    calendarTypeId: {
        type: mongoose.ObjectId,
    },
    businessName: {
        type: String,
    },
    calendarType: {
        type: String
    },
    calendarPermissionType: {
        type: String,
        default: null
    },
    userId: {
        type: String
    }
});

const appointmentEntryModel = mongoose.Schema({
    timeOfBooking: {
        type: Date,
        default: Date.now
    },
    appointmentId: {
        type: mongoose.ObjectId,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});
const permissionsGiven = mongoose.Schema({
    businessCalendarTypeId: {
        type: String
    },
    userIdOfUserWhoIsPermitted: {
        type: String
    }
})
const securityGuardPermissions = mongoose.Schema({
    businessCalendarTypeId: {
        type: String
    },
    userIdOfUserWhoIsPermitted: {
        type: String
    }
})
const entryRequests = mongoose.Schema({
    userIdOfTheBusinessCalendar: {
        type: String,
        default: null
    },
    _id: {
        type: String,
        default: uuidv4
    },
    visitorName: {
        type: String,
        required: true
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
    }
})
const subscribedCalendars = mongoose.Schema({
    userIdOfTheBusinessCalendar: {
        type: String
    },
    businessCalendarTypeId: {
        type: String
    },
    businessCalendarType: {
        type: String
    },
    subscription: {
        type: String
    }
})

const gateKeeperMembershipCalendars = mongoose.Schema({
    userIdOfTheBusinessCalendar: {
        type: String
    },
    businessCalendarTypeId: {
        type: String
    },
    businessCalendarType: {
        type: String
    },
    subscription: {
        type: String
    },
    adminRights: {
        type: Boolean,
        default: true
    },
    userIdOfMemberWhoSharedMembershipWithYou: {
        type: String,
        default: null
    }
})

const userModel = mongoose.Schema({
    profilePic: {
        type: String,
        default: null
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        default: null
    },
    dob: {
        type: String,
        default: null
    },
    email: {
        type: String,
        unique: true,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    number: {
        type: String,
        required: true,
        unique: true,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    vault: [documentModel],
    enabled: {
        type: Boolean,
        default: true
    },
    calendars: [
        CalendarEntryModel
    ],
    appointments: [
        appointmentEntryModel
    ],
    latitude: {
        type: String,
        default: null
    },
    longitude: {
        type: String,
        default: null
    },
    userPermissionsGiven: [permissionsGiven],
    securityGuardPermissionGiven: [securityGuardPermissions],
    entryRequestArray: [entryRequests],
    subscribedBusinessCalendars: [subscribedCalendars],
    gateKeeperMembershipCalendars: [gateKeeperMembershipCalendars]
});

userModel.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password
    return obj
}

userModel.methods.toCalendars = function() {
    var obj = this.toObject();
    delete obj.name
    delete obj.email
    delete obj.password
    delete obj.number
    delete obj.vault
    delete obj.enabled
    delete obj.appointments
    delete obj.latitude
    delete obj.longitude
    delete obj.address
    delete obj.dob
    delete obj.gender
    delete obj.profilePic
    return obj
}

userModel.methods.toAppointments = function() {
    var obj = this.toObject();
    delete obj.name
    delete obj.email
    delete obj.password
    delete obj.number
    delete obj.vault
    delete obj.enabled
    delete obj.calendars
    delete obj.latitude
    delete obj.longitude
    delete obj.address
    delete obj.dob
    delete obj.gender
    delete obj.profilePic
    return obj
}

userModel.methods.toVault = function() {
    var obj = this.toObject();
    delete obj.name
    delete obj.email
    delete obj.password
    delete obj.number
    delete obj.appointments
    delete obj.enabled
    delete obj.calendars
    delete obj.latitude
    delete obj.longitude
    delete obj.address
    delete obj.dob
    delete obj.gender
    delete obj.profilePic
    return obj
}

userModel.index({ name: 'text', number: 'text', email: 'text' });

module.exports = mongoose.model("allUsers", userModel, 'allUsers');