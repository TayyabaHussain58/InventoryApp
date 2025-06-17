import express, { RequestHandler } from 'express';
import { Product } from '../models/Product';
import { Transaction } from '../models/Transaction';

const router = express.Router();

// Get all products
router.get('/', (async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
}) as RequestHandler);

// Add new product
router.post('/', (async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    // Record transaction
    const transaction = new Transaction({
      type: 'ADD',
      productId: product._id,
      quantity: product.quantity
    });
    await transaction.save();
    
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product' });
  }
}) as RequestHandler);

// Update product stock
router.patch('/:id/stock', (async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const oldQuantity = product.quantity;
    product.quantity = quantity;
    await product.save();
    
    // Record transaction
    const transaction = new Transaction({
      type: 'ADJUST',
      productId: product._id,
      quantity: quantity - oldQuantity
    });
    await transaction.save();
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating stock' });
  }
}) as RequestHandler);

// Remove product
router.delete('/:id', (async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting product' });
  }
}) as RequestHandler);

export default router; 