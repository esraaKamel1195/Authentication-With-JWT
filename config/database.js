const mongoose = require('mongoose');

const { MONGO_URL } = process.env;

exports.connect = () => {
    // Connecting to the database
    mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connected to database");
    })
    .catch((error) => {
        console.log("database connection failed. exitting now...");
        console.error(error);
        process.exit(1);
    })
}