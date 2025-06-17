import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useInventory } from '../context/InventoryContext';
import { InventoryItem } from '../types';

export default function Dashboard() {
  const { products, addProduct, removeProduct } = useInventory();
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [transactionType, setTransactionType] = useState<'in' | 'out'>('in');
  const [error, setError] = useState<string | null>(null);
  
  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    lowStockItems: products.filter(item => item.quantity < 10).length,
    outOfStockItems: products.filter(item => item.quantity === 0).length
  };

  const lowStockProducts = products.filter(item => item.quantity < 10);

  const handleOpen = (product: InventoryItem) => {
    setSelectedProduct(product);
    setOpen(true);
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
    setError(null);
  };

  const handleTransaction = async () => {
    if (!selectedProduct) return;

    try {
      if (transactionType === 'in') {
        await addProduct(selectedProduct.product, quantity, selectedProduct.location);
      } else {
        if (quantity > selectedProduct.quantity) {
          setError('Cannot remove more items than available in stock');
          return;
        }
        await removeProduct(selectedProduct.product.id, quantity);
      }
      handleClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during the transaction');
    }
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: 140,
        bgcolor: color,
        color: 'white',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography component="h2" variant="h6" gutterBottom>
          {title}
        </Typography>
        {icon}
      </Box>
      <Typography component="p" variant="h4">
        {value}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<InventoryIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Value"
            value={`$${stats.totalValue.toFixed(2)}`}
            icon={<MoneyIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockItems}
            icon={<WarningIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Categories"
            value="5"
            icon={<CategoryIcon />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Low Stock Alert
        </Typography>
        {lowStockProducts.map((item) => (
          <Box key={item.product.id} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1">
                {item.product.name} - {item.quantity} units remaining
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Location: {item.location}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpen(item)}
            >
              Record Transaction
            </Button>
          </Box>
        ))}
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Record Transaction</DialogTitle>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            select
            fullWidth
            margin="normal"
            label="Transaction Type"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value as 'in' | 'out')}
          >
            <MenuItem value="in">Stock In</MenuItem>
            <MenuItem value="out">Stock Out</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleTransaction} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 