const session=require("express-session");
const  MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');

const uri = "mongodb+srv://swapnil:swapnil@cluster0.sycob.mongodb.net/demo?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB Connected…")
})
.catch(err => console.log(err))
// INITIALIZING MONGOSTORE
const myMongoStore = new MongoDBStore({
  
    uri: "mongodb+srv://swapnil:swapnil@cluster0.sycob.mongodb.net/demo?retryWrites=true&w=majority",
    collection: 'mySessions'
});

module.exports = {myMongoStore}
