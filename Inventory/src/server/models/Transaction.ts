import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['ADD', 'REMOVE', 'ADJUST'], required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const Transaction = mongoose.model('Transaction', transactionSchema); 