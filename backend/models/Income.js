const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    clientName: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    source: { type: String, enum: ['Mess', 'Mahal'], required: true }
}, { timestamps: true });

incomeSchema.virtual('balanceAmount').get(function() {
    return this.totalAmount - this.paidAmount;
});

incomeSchema.set('toJSON', { virtuals: true });
incomeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Income', incomeSchema);
