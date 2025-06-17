import inquirer from 'inquirer';
import { Inventory } from './server/models/Inventory';
import { Product, Category } from './types';
import { Document, Types } from 'mongoose';

interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  location: string;
}

interface ITransaction extends Document {
  type: 'ADD' | 'REMOVE' | 'ADJUST';
  productId: Types.ObjectId;
  quantity: number;
  timestamp: Date;
  notes?: string;
}

const inventory = new Inventory();

async function main() {
    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'Add Product',
                    'Remove Product',
                    'Update Stock',
                    'View All Products',
                    'View Low Stock Products',
                    'View Inventory Stats',
                    'View Transaction History',
                    'Exit'
                ]
            }
        ]);

        switch (action) {
            case 'Add Product':
                await addProduct();
                break;
            case 'Remove Product':
                await removeProduct();
                break;
            case 'Update Stock':
                await updateStock();
                break;
            case 'View All Products':
                await viewAllProducts();
                break;
            case 'View Low Stock Products':
                await viewLowStockProducts();
                break;
            case 'View Inventory Stats':
                await viewInventoryStats();
                break;
            case 'View Transaction History':
                await viewTransactionHistory();
                break;
            case 'Exit':
                console.log('Goodbye!');
                return;
        }
    }
}

async function addProduct() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Product name:'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Product description:'
        },
        {
            type: 'number',
            name: 'price',
            message: 'Product price:'
        },
        {
            type: 'number',
            name: 'quantity',
            message: 'Initial quantity:'
        },
        {
            type: 'list',
            name: 'category',
            message: 'Product category:',
            choices: ['Electronics', 'Clothing', 'Food', 'Books', 'Other']
        },
        {
            type: 'input',
            name: 'location',
            message: 'Storage location:'
        }
    ]);

    const product: Product = {
        id: Math.random().toString(36).substr(2, 9),
        name: answers.name,
        description: answers.description,
        price: answers.price,
        quantity: answers.quantity,
        category: answers.category,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    inventory.addProduct(product, answers.quantity, answers.location);
    console.log('Product added successfully!');
}

async function removeProduct() {
    const products = await inventory.getAllProducts();
    const { productId, quantity } = await inquirer.prompt([
        {
            type: 'list',
            name: 'productId',
            message: 'Select product to remove:',
            choices: products.map((p: IProduct) => ({
                name: `${p.name} (${p.quantity} in stock)`,
                value: p._id
            }))
        },
        {
            type: 'number',
            name: 'quantity',
            message: 'Quantity to remove:'
        }
    ]);

    try {
        await inventory.removeProduct(productId, quantity);
        console.log('Product removed successfully!');
    } catch (error: any) {
        console.error('Error:', error?.message || 'An unknown error occurred');
    }
}

async function updateStock() {
    const products = await inventory.getAllProducts();
    const { productId, newQuantity } = await inquirer.prompt([
        {
            type: 'list',
            name: 'productId',
            message: 'Select product to update:',
            choices: products.map((p: IProduct) => ({
                name: `${p.name} (${p.quantity} in stock)`,
                value: p._id
            }))
        },
        {
            type: 'number',
            name: 'newQuantity',
            message: 'New quantity:'
        }
    ]);

    try {
        await inventory.updateStock(productId, newQuantity);
        console.log('Stock updated successfully!');
    } catch (error: any) {
        console.error('Error:', error?.message || 'An unknown error occurred');
    }
}

async function viewAllProducts() {
    const products = await inventory.getAllProducts();
    console.log('\nAll Products:');
    products.forEach((product: IProduct) => {
        console.log(`\nName: ${product.name}`);
        console.log(`Description: ${product.description}`);
        console.log(`Price: $${product.price}`);
        console.log(`Quantity: ${product.quantity}`);
        console.log(`Category: ${product.category}`);
        console.log(`Location: ${product.location}`);
    });
}

async function viewLowStockProducts() {
    const lowStockProducts = await inventory.getLowStockProducts();
    console.log('\nLow Stock Products:');
    lowStockProducts.forEach((product: IProduct) => {
        console.log(`\nName: ${product.name}`);
        console.log(`Current Quantity: ${product.quantity}`);
        console.log(`Location: ${product.location}`);
    });
}

async function viewInventoryStats() {
    const stats = await inventory.getInventoryStats();
    console.log('\nInventory Statistics:');
    console.log(`Total Products: ${stats.totalProducts}`);
    console.log(`Total Value: $${stats.totalValue.toFixed(2)}`);
    console.log(`Low Stock Items: ${stats.lowStockItems}`);
    console.log(`Out of Stock Items: ${stats.outOfStockItems}`);
}

async function viewTransactionHistory() {
    const transactions = await inventory.getTransactionHistory();
    console.log('\nTransaction History:');
    transactions.forEach((transaction: ITransaction) => {
        console.log(`\nType: ${transaction.type}`);
        console.log(`Product ID: ${transaction.productId}`);
        console.log(`Quantity: ${transaction.quantity}`);
        console.log(`Timestamp: ${transaction.timestamp}`);
        if (transaction.notes) {
            console.log(`Notes: ${transaction.notes}`);
        }
    });
}

main().catch(console.error); 