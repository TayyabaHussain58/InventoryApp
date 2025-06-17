import { InventoryItem, Product, InventoryTransaction, InventoryStats } from '../types';

export class Inventory {
  private items: InventoryItem[] = [];
  private transactions: InventoryTransaction[] = [];

  getAllProducts(): InventoryItem[] {
    return this.items;
  }

  getTransactionHistory(): InventoryTransaction[] {
    return this.transactions;
  }

  getLowStockProducts(): InventoryItem[] {
    return this.items.filter(item => item.quantity < 10);
  }

  getProductsByCategory(): Record<string, InventoryItem[]> {
    return this.items.reduce((acc, item) => {
      const category = item.product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, InventoryItem[]>);
  }

  getInventoryStats(): InventoryStats {
    return {
      totalProducts: this.items.length,
      totalValue: this.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      lowStockItems: this.getLowStockProducts().length,
      outOfStockItems: this.items.filter(item => item.quantity === 0).length
    };
  }

  addProduct(product: Product, quantity: number, location: string): void {
    this.items.push({
      product,
      quantity,
      location,
      lastRestocked: new Date()
    });
    this.recordTransaction('ADD', product.id, quantity);
  }

  removeProduct(productId: string, quantity: number): void {
    const item = this.items.find(item => item.product.id === productId);
    if (!item) throw new Error('Product not found');
    if (item.quantity < quantity) throw new Error('Insufficient stock');
    
    item.quantity -= quantity;
    this.recordTransaction('REMOVE', productId, quantity);
  }

  updateStock(productId: string, newQuantity: number): void {
    const item = this.items.find(item => item.product.id === productId);
    if (!item) throw new Error('Product not found');
    
    const difference = newQuantity - item.quantity;
    item.quantity = newQuantity;
    this.recordTransaction('ADJUST', productId, difference);
  }

  private recordTransaction(type: 'ADD' | 'REMOVE' | 'ADJUST', productId: string, quantity: number): void {
    this.transactions.push({
      id: Math.random().toString(36).substr(2, 9),
      type,
      productId,
      quantity,
      timestamp: new Date()
    });
  }
} 