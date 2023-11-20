const mongoose = require('mongoose')
require('dotenv').config()

const mongoURI = process.env.MONGO_URI;

async function connectToDatabase() {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to Muongo_DB');
    } catch (error) {
        console.error('Error when connecting to MuongoDB:', error);
    }
}

module.exports = {
    connectToDatabase,
    mongoose, // You might want to export the mongoose instance as well for defining models
};
