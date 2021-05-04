const mongoose = require('mongoose');
var randToken = require('rand-token');

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    detail: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String
    },
    users: {
        type: String,
        required: true
    },
    flat: {
        type: Number,
        required: true
    },
    transcations: {
        type: String,
        required: true
    },
    // image : {
    //    type : String,
    //     required : true
    // }, 
    data_size: {
        type: String,
        required: true
    },
    gst: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
})

const Userdb = mongoose.model('userdb', schema);

module.exports = Userdb;