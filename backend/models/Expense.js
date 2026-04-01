const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    expenseName: { type: String, required: true },
    amount: { type: Number, required: true },
    source: { type: String, enum: ['Mess', 'Mahal'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
