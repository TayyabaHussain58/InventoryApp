import mongoose from 'mongoose';
import { Product } from './Product';
import { Transaction } from './Transaction';

export class Inventory {
  async getAllProducts() {
    return Product.find();
  }

  async getTransactionHistory() {
    return Transaction.find().populate('productId');
  }

  async getLowStockProducts() {
    return Product.find({ quantity: { $lt: 10 } });
  }

  async getProductsByCategory() {
    const products = await Product.find();
    return products.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, any[]>);
  }

  async getInventoryStats() {
    const products = await Product.find();
    return {
      totalProducts: products.length,
      totalValue: products.reduce((sum, product) => sum + (product.price * product.quantity), 0),
      lowStockItems: products.filter(p => p.quantity < 10).length,
      outOfStockItems: products.filter(p => p.quantity === 0).length
    };
  }

  async addProduct(product: any, quantity: number, location: string) {
    const newProduct = new Product({
      ...product,
      quantity,
      location
    });
    await newProduct.save();
    
    const transaction = new Transaction({
      type: 'ADD',
      productId: newProduct._id,
      quantity
    });
    await transaction.save();
    
    return newProduct;
  }

  async removeProduct(productId: string, quantity: number) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    if (product.quantity < quantity) throw new Error('Insufficient stock');
    
    product.quantity -= quantity;
    await product.save();
    
    const transaction = new Transaction({
      type: 'REMOVE',
      productId,
      quantity
    });
    await transaction.save();
    
    return product;
  }

  async updateStock(productId: string, newQuantity: number) {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');
    
    const oldQuantity = product.quantity;
    product.quantity = newQuantity;
    await product.save();
    
    const transaction = new Transaction({
      type: 'ADJUST',
      productId,
      quantity: newQuantity - oldQuantity
    });
    await transaction.save();
    
    return product;
  }
} 