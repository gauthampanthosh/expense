const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  method: {
    type: String,
    enum: ['UPI', 'Cash', 'Bank'],
    default: 'UPI'
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
