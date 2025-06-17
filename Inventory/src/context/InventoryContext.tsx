import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';
import { InventoryItem, Product, InventoryTransaction } from '../types';

interface InventoryContextType {
  products: InventoryItem[];
  transactions: InventoryTransaction[];
  refreshProducts: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  addProduct: (product: Product, quantity: number, location: string) => Promise<void>;
  removeProduct: (productId: string, quantity: number) => Promise<void>;
  updateStock: (productId: string, newQuantity: number) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);

  const refreshProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const refreshTransactions = async () => {
    try {
      const data = await api.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const addProduct = async (product: Product, quantity: number, location: string) => {
    try {
      await api.addProduct({ ...product, quantity, location });
      await refreshProducts();
      await refreshTransactions();
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const removeProduct = async (productId: string, quantity: number) => {
    try {
      await api.addTransaction({
        productId,
        type: 'REMOVE',
        quantity
      });
      await refreshProducts();
      await refreshTransactions();
    } catch (error) {
      console.error('Error removing product:', error);
      throw error;
    }
  };

  const updateStock = async (productId: string, newQuantity: number) => {
    try {
      await api.updateStock(productId, newQuantity);
      await refreshProducts();
      await refreshTransactions();
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  };

  useEffect(() => {
    refreshProducts();
    refreshTransactions();
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        products,
        transactions,
        refreshProducts,
        refreshTransactions,
        addProduct,
        removeProduct,
        updateStock,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
} 