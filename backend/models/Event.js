const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    deliveryTime: { type: String, required: true },
    menuDetails: { type: String, required: true },
    clientName: { type: String, required: true },
    clientPhone: { type: String, required: true },
    location: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
