const http = require('http');
const urlencode = require('urlencode');

var number = '9049204207';
var otp = "123456"
var msg = urlencode(`Dear User, OTP for your transaction is ${otp}, Do not share this with anyone. Thank you.`);
console.log(msg)
console.log("msg")

var username = 'suneet@umbrellacomputing.com';

var hash = '7613cfe754f90df623a4fb300daa21137f56356240cb25ef03bac24116cbab93'; // The hash key could be found under Help->All Documentation->Your hash key. Alternatively you can use your Textlocal password in plain text.

var sender = 'CLNDRE';

let data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + number + '&message=' + msg
console.log(data)
var options = {

    host: 'api.textlocal.in',

    path: encodeURI('/send?' + data)

};

callback = function(response) {

    var str = '';

    //another chunk of data has been recieved, so append it to `str`

    response.on('data', function(chunk) {

        str += chunk;

    });

    //the whole response has been recieved, so we just print it out here
    console.log(str)
    console.log("str")
    response.on('end', function() {

        console.log(str);

    });
}

//console.log('hello js'))

http.request(options, callback).end();

//url encode instalation need to use $ npm install urlencode