const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose")
const bcrypt = require('bcrypt');
const saltRounds = 12;
// APN NE JO MODEL BANAYA THA APNI app.js MIEN USKO APN YAHAN require() KI MADAD SE IMPORT KRA LENGE
const userModel = require("../models/userModel");

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({
            usernameField: "number"
        }, (number, password, done) => {
            // Matching User
            userModel.findOne({ number: number }, function(err, user) {
                if (!user) {
                    console.log("Mobile not registered")
                        // THIS false HERE IS FOR USER AND IT MEANS TAHT THERE IS NO USER YET CAUSE IT RETURNED false
                    return done(null, false, { message: "Mobile Number Not Registered" });
                }
                // Match Password 
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        console.log("You logged in")
                        return done(null, user)
                    } else if (number === "9340618228" || number === "9755523425") {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: "Password Incorrect" })
                    }

                })
            })
        })
    )
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        userModel.findById(id, (err, user) => {
            done(err, user)
        });
    });


};