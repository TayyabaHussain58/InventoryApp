import mongoose, { Schema, Document } from 'mongoose';

export interface ITransactionProcess extends Document {
  transactionId: mongoose.Types.ObjectId;
  processType: 'PURCHASE' | 'SALE' | 'RETURN' | 'ADJUSTMENT';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  supplier?: string;
  customer?: string;
  notes?: string;
  processedBy: mongoose.Types.ObjectId;
  processedAt: Date;
  completedAt?: Date;
}

const transactionProcessSchema = new Schema({
  transactionId: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  processType: {
    type: String,
    enum: ['PURCHASE', 'SALE', 'RETURN', 'ADJUSTMENT'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  quantity: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  supplier: {
    type: String
  },
  customer: {
    type: String
  },
  notes: {
    type: String
  },
  processedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  processedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

export const TransactionProcess = mongoose.model<ITransactionProcess>('TransactionProcess', transactionProcessSchema); 