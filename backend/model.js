const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    phone: Number,
    amount: Number


}, {
    timestamps: true,
})

module.exports = mongoose.model('UserData', userSchema)