const mongoose = require('mongoose')
require('dotenv').config()

const mongoURI = process.env.MONGO_URI;

async function connectToDatabase() {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error when connecting to MongoDB:', error);
    }
}

module.exports = {
    connectToDatabase,
    mongoose, // You might want to export the mongoose instance as well for defining models
};
