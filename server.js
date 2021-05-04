const express = require('express');
const path = require("path");

const bodyParser = require('body-parser');
const connectDB = require('./server/database/connection')

const app = express();

// const PORT = process.env.PORT||8080

connectDB();

app.use(bodyParser.urlencoded({extended : true}));

// set view engine
app.set("view engine" , "ejs")
// app.set("views" , path.resolve(__dirname,"views/ejs"))

// load assests
app.use("/css" , express.static(path.resolve(__dirname,"assets/css")));
app.use("/img" , express.static(path.resolve(__dirname,"assets/img")));
app.use("/js" , express.static(path.resolve(__dirname,"assets/js")));

app.use("/" , require('./server/routes/router'))

app.listen(3000 , ()=>{
    console.log("Server is running at PORT 3000")
});