export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface InventoryItem {
    product: Product;
    quantity: number;
    location: string;
    lastRestocked: Date;
}

export type Category = 'Electronics' | 'Clothing' | 'Food' | 'Books' | 'Other';

export interface InventoryTransaction {
    id: string;
    type: 'ADD' | 'REMOVE' | 'ADJUST';
    productId: string;
    quantity: number;
    timestamp: Date;
    notes?: string;
}

export interface InventoryStats {
    totalProducts: number;
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
} 