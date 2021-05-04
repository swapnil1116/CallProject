const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const sharp = require('sharp');
const emailRegex = require('email-regex');
const http = require('http');
const urlencode = require('urlencode');
const saltRounds = 12;
const path = require("path")
const privateCalendarModel = require('../models/privateCalendarModel');
const nodemailer = require('nodemailer');
const allCalendarModel = require('../models/allCalendarModel');
const mongoose = require('mongoose');
const multer = require('multer');
const userModel = require('../models/userModel');
const userEmail = require('../config/credentials')

var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: userEmail.email, // generated ethereal user
        pass: userEmail.password // generated ethereal password
    },
});

function getProfileDetails(req, callback) {
    UserModel.findById(req.user.id).then((doc) => callback(null, doc.toJSON())).catch((err) => callback(err, doc));
}

function signUp(req, callback) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (!err) {
            const user = new UserModel({
                name: req.body.name,
                email: req.body.email,
                number: req.body.number,
                password: hash,
                calendars: [{
                    calendarType: 'private',
                    businessName: req.body.name,
                    calendarId: mongoose.Types.ObjectId()
                }],
            });
            const calendar = new allCalendarModel({
                _id: user.calendars[0].calendarId,
                businessName: user.name,
                calendarType: 'private',
                calendarId: mongoose.Types.ObjectId(),
                userId: user.id,
                autoApprove: true,
                services: []
            });
            const privateCalendar = new privateCalendarModel({
                _id: calendar.calendarId,
                userId: user.id,
                allCalendarId: calendar._id,
                dailySchedule: []
            });
            user.save((err, docs) => {
                if (!err) {
                    console.log(docs);
                    calendar.save((err, docs) => {
                        if (!err) {
                            console.log(docs);
                        } else {
                            console.log(err);
                        }
                    });
                    privateCalendar.save((err, docs) => {
                        if (!err) {
                            console.log(docs);
                            callback(null, {
                                msg: "user successfully added"
                            });
                        } else {
                            console.log(err);
                            callback(err, null);
                        }
                    });

                } else {
                    console.log(err);
                    callback(err, null);
                }
            });
        } else {
            callback(new Error("error generating hash password!!"), null);
        }
    });
}
async function editProfileDetails(req, callback) {
    let body = [];
    for (const property in req.body) {
        let obj = {
            key: property,
            value: req.body[property]
        }
        body.push(obj);
    }
    let user = await UserModel.findById(req.user.id);
    if (user) {
        body.forEach(element => {
            if (element.key == "email" && verifyEmail(element.value)) {
                callback(new Error("email already exists"));
            }
            if (element.key == "number" && verifyNumber(element.value)) {
                callback(new Error("number already exists"));
            }
            user[element.key] = element.value;
        });
        user.save((err, doc) => {
            if (err) {
                callback(err, null);
            } else {
                console.log(doc);
                callback(err, {
                    msg: "successfully Edited"
                });
            }
        })
    }
}

function verifyNumber(number) {
    UserModel.findOne({
        number: number
    }, (_, doc) => {
        if (doc) {
            return false;
        } else {
            return true;
        }
    });
}

function verifyEmail(email) {
    UserModel.findOne({
        email: email
    }, (_, doc) => {
        if (!doc) {
            return true;
        } else {
            return false;
        }
    });
}

function changePassword(req, callback) {
    UserModel.findById(req.user.id, (err, user) => {
        if (!err) {
            bcrypt.compare(req.body.oldpassword, user.password, (_, same) => {
                if (same) {
                    bcrypt.hash(req.body.newpassword, saltRounds, function (err, hash) {
                        if (!err) {
                            user.password = hash;
                            user.save();
                            callback(null, {
                                msg: "successfully changed password"
                            });
                        } else {
                            callback(new Error("error while generating hash!"), null);
                        }
                    });
                } else {
                    callback(new Error("wrong previous password"), null);
                }
            });
        } else {
            callback(new Error("no user found!!"), null);
        }
    });
}

function loginWithNumber(req, callback) {
    UserModel.findOne({
        number: req.body.number,
    }).then((doc) => {
        if (doc) {
            bcrypt.compare(req.body.password, doc.password, (_, same) => {
                if (same) {
                    callback(null, doc.toJSON());
                } else {
                    callback(new Error("incorrect credentials"), null);
                }
            });
        } else {
            callback(new Error('Wrong credentials'), null);
        }
    }).catch((err) => {
        callback(err, null);
    });
}

async function forgotPassword(req, callback) {
    let user = await UserModel.findById(req.user.id);
    if (user) {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            if (!err) {
                user.password = hash;
                user.save();
                callback(null, {
                    msg: "successfully changed password"
                });
            } else {
                callback(new Error("error while generating hash!"), null);
            }
        });
    } else {
        callback(new Error("Session Issue"), null);
    }
}

// --------------------------------------------------------------------------------------------------------------------------
//                                             U P L O A D   F U N C T I O N S
// --------------------------------------------------------------------------------------------------------------------------
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './static/img/');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + req.user.id + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (_, file, cb) {
        // Set the filetypes, it is optional 
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb("Error: File upload only supports the " +
            "following filetypes - " + filetypes);
    }
});

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

function photoUploaded(req, callback) {
    // FOR REDUCING SIZE OF IMAGE AND MAKING IT PREVIEW IMAGE
    req.body['singleFile'] = replaceAll(req.file.path, "\\", "/")
    let imageNameForSharp = (((req.body.singleFile).replace(".jpg", "")).replace(".png", "")).replace(".jpeg", "")
    console.log('imageNameForSharp')
    console.log(imageNameForSharp)
    sharp(`${req.body.singleFile}`).resize(640, 480)
        .jpeg({ quality: 80 }).toFile(`${imageNameForSharp}_preview.jpg`);
    let newProfilePic = `${imageNameForSharp}_preview.jpg`
    console.log(newProfilePic)

    userModel.findByIdAndUpdate(req.user.id, {
        $set: {
            profilePic: `${imageNameForSharp}_preview.jpg`
        }
    }, (err, docs) => {
        if (!err) {
            console.log(docs);
            if (docs.ok == 1) {
                callback(null, {
                    msg: "successfully added"
                });
            } else {
                callback(new Error('error while adding!'), null);
            }
        } else {
            callback(err, null);
        }
    });
}


// SENDING TEXT MESSAGES
function sendTextMessage(number, otp) {
    let msg = ""
    if (otp) {
        msg = urlencode(`Dear User, OTP for your transaction is ${otp}, Do not share this with anyone. Thank you.`);
    } else if (!otp) {
        console.log("No otp")
        msg = urlencode(`Welcome , for better experience, complete your profile. Do Forgot Password to get your password on WebApp. Thank you.`)
    }
    let data = 'username=' + userCredentials.userNameForTextLocal + '&hash=' + userCredentials.hashCodeForTextLocal + '&sender=' + userCredentials.senderTextLocal + '&numbers=' + number + '&message=' + msg
    console.log(data)
    var options = {

        host: 'api.textlocal.in',

        path: encodeURI('/send?' + data)

    };

    callback = function (response) {

        var str = '';

        //another chunk of data has been recieved, so append it to `str`

        response.on('data', function (chunk) {

            str += chunk;

        });

        //the whole response has been recieved, so we just print it out here
        console.log(str)
        console.log("str")
        response.on('end', function () {

            console.log(str);

        });
    }
    http.request(options, callback).end();
}

function sendEmail(from, to, subject, text) {
    var mailOptions = {
        from: from,
        to: to,
        cc: "email.com",
        subject: subject,
        text: text
    };
    if (emailRegex({ exact: true }).test(to)) {
        console.log(to + "  to")
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response + " " + "Send To : " + to);
            }
        });
    }
    else {
        console.log("Invalid Email Address   " + to)
    }
}
// -----------------------------------------------------------------------------------------------------------------------
//                                         U P L O A D   F U N C T I O N S   E N D
// --------------------------------------------------------------------------------------------------------------------------


module.exports = {
    sendTextMessage,
    sendEmail,
    //callback consists of 2 parameters err and doc as callback(err,doc) if err is empty then there is no error but if doc is empty there is some error which is stored in err variable
    // get function that outputs the complete user model without password to the callback body
    getProfileDetails,
    /* ---------------------- output --------------------------
    {
    "enabled": true,
    "_id": "5f8976f1feafa21a60144bb8",
    "name": "test1",
    "email": "test1@gmail.com",
    "number": "4557946132",
    "vault": [],
    "calendars": [],
    "appointments": [],
    "__v": 0
    }
    ----------------------------------------------------------*/
    signUp,
    upload,
    /* ---------------------- input --------------------------
    {
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        password: hash
    }
     ---------------------- output --------------------------
    {
         msg: "user successfully added"
    }
    ----------------------------------------------------------*/
    editProfileDetails,
    /* ---------------------- input --------------------------
    {
    [
        {
            "key":"name",
            "value":"test3"
        }
    ]
    }
    ---------------------- output --------------------------
    {
         msg: "successfully Edited"
    }
    ----------------------------------------------------------*/
    changePassword,
    /* ---------------------- input --------------------------
    
    "oldpassword": "test",
    "newpassword":"test2"
    }
    ---------------------- output --------------------------
    {
    "msg": "successfully changed password"
    }
    ------------------------------------------------------*/
    forgotPassword,
    /* ---------------------- input --------------------------
    {
    "password":"test2"
    }
    ---------------------- output --------------------------
    {
    "msg": "successfully changed password"
    }
    ------------------------------------------------------*/
    loginWithNumber,
    /*
    {
    "number":"42543133535",
    "password":"test"
    }
     --------------------------------------
                  O U T P U T 
     --------------------------------------
     {
    "_id": "5f75aafd3596c0534c2c80dc",
    "name": "test2",
    "email": "test2@gmail.com",
    "number": "4454846132",
    "calendars": [
        {
            "_id": "5f75aafd3596c0534c2c80dd",
            "calendarType": "personal",
            "calendarId": "5f75aafd3596c0534c2c80db"
        },
        {
            "_id": "5f75b07bbac91c53dc516d0c",
            "calendarType": "bank",
            "calendarId": "5f75b07bbac91c53dc516d09"
        },
        {
            "_id": "5f75b082bac91c53dc516d12",
            "calendarType": "hospital",
            "calendarId": "5f75b082bac91c53dc516d0f"
        }
    ],
    "bankDocuments": [],
    "medicalReports": [],
    "__v": 2
    }
    */
    photoUploaded,
    replaceAll,
}