const mongoose = require('mongoose');
// var randToken = require('rand-token');


const couponSchema = new mongoose.Schema({
    // activation_token : {
    //     type: String,
    //     default: function() {
    //         return randToken.generate(16);
    //     }
    // },
    name : {
        type : String,
    }
    

    
});

const Coupon = mongoose.model('coupon', couponSchema);

module.exports = Coupon;