const mongoose = require('mongoose');

const staffSalarySchema = new mongoose.Schema({
    staffName: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('StaffSalary', staffSalarySchema);
