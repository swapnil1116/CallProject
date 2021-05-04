const mongoose = require('mongoose');
var randToken = require('rand-token');


const codeSchema = new mongoose.Schema({
    activation_token : {
        type: String,
        default: function() {
            return randToken.generate(16);
        }
    },
    // username: {
    //     type: String,
    //     required: true,
    // },
    // email: {
    //     type: String,
    //     required: true,
    // },
    // password: {
    //     type: String,
    // },

    
});

const Codes = mongoose.model('code', codeSchema);

module.exports = Codes;