# Inventory Management System

A modern web-based inventory management system built with React, TypeScript, and Material-UI. This application provides a user-friendly interface for managing products, tracking stock levels, and monitoring inventory statistics.

## Features

- 📊 **Dashboard**: Overview of key inventory metrics and low stock alerts
- 📦 **Product Management**: Add, view, update, and remove products
- 🔄 **Transaction Tracking**: Record stock in/out transactions
- 📈 **Inventory Statistics**: Detailed analytics and category-wise product distribution
- 🎨 **Modern UI**: Clean and responsive interface using Material-UI
- 🔒 **Type Safety**: Built with TypeScript for better development experience

## Tech Stack

- React 18
- TypeScript
- Material-UI (MUI)
- React Router
- Context API for state management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd inventory-management
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React Context for state management
├── models/        # Core business logic
├── pages/         # Main application pages
├── types/         # TypeScript type definitions
└── App.tsx        # Main application component
```

## Features in Detail

### Dashboard
- Total products count
- Total inventory value
- Low stock alerts
- Category distribution

### Products
- View all products in a table format
- Add new products with detailed information
- Update product stock levels
- Remove products from inventory

### Transactions
- Record stock in/out transactions
- View transaction history
- Real-time stock updates

### Inventory Statistics
- Detailed inventory metrics
- Category-wise product distribution
- Low stock alerts
- Value calculations

## Usage

### Adding a Product
1. Navigate to the Products page
2. Click "Add Product"
3. Fill in the product details:
   - Name
   - Description
   - Price
   - Quantity
   - Category
   - Storage Location
4. Click "Add Product" to save

### Transaction Methods

#### 1. Stock In Transaction
```typescript
// Add stock to inventory
inventory.addStock(productId: string, quantity: number)
```
Example:
```typescript
// Add 10 units of product with ID "123"
inventory.addStock("123", 10)
```

#### 2. Stock Out Transaction
```typescript
// Remove stock from inventory
inventory.removeStock(productId: string, quantity: number)
```
Example:
```typescript
// Remove 5 units of product with ID "123"
inventory.removeStock("123", 5)
```

#### 3. Update Stock
```typescript
// Update stock to a specific quantity
inventory.updateStock(productId: string, newQuantity: number)
```
Example:
```typescript
// Set stock to 20 units for product with ID "123"
inventory.updateStock("123", 20)
```

#### 4. Get Transaction History
```typescript
// Get all transactions
const transactions = inventory.getTransactionHistory()
```

### Recording a Transaction
1. Go to the Transactions page
2. Select a product
3. Choose transaction type (Stock In/Out)
4. Enter quantity
5. Confirm the transaction

### Viewing Statistics
1. Navigate to the Stats page
2. View various inventory metrics
3. Check category distribution
4. Monitor low stock alerts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 