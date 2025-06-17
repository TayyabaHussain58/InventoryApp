import express, { RequestHandler } from 'express';
import { Transaction } from '../models/Transaction';
import { Product } from '../models/Product';

const router = express.Router();

// Get all transactions
const getTransactions: RequestHandler = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('productId');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};

// Add transaction
const addTransaction: RequestHandler = async (req, res) => {
  try {
    const { productId, type, quantity } = req.body;
    const product = await Product.findById(productId);
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    // Update product quantity
    if (type === 'ADD') {
      product.quantity += quantity;
    } else if (type === 'REMOVE') {
      if (product.quantity < quantity) {
        res.status(400).json({ message: 'Insufficient stock' });
        return;
      }
      product.quantity -= quantity;
    }
    
    await product.save();
    
    // Record transaction
    const transaction = new Transaction({
      type,
      productId,
      quantity
    });
    await transaction.save();
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: 'Error creating transaction' });
  }
};

router.get('/', getTransactions);
router.post('/', addTransaction);

export default router; 