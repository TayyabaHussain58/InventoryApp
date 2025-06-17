import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useInventory } from '../context/InventoryContext';
import { InventoryItem } from '../types';

export default function InventoryStats() {
  const { products } = useInventory();
  
  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    lowStockItems: products.filter(item => item.quantity < 10).length,
    outOfStockItems: products.filter(item => item.quantity === 0).length
  };

  const lowStockProducts = products.filter(item => item.quantity < 10);
  const productsByCategory = products.reduce((acc, item) => {
    const category = item.product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Inventory Statistics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Overview
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Total Products"
                  secondary={stats.totalProducts}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Total Value"
                  secondary={`$${stats.totalValue.toFixed(2)}`}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Low Stock Items"
                  secondary={stats.lowStockItems}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Low Stock Alert
            </Typography>
            <List>
              {lowStockProducts.map((item: InventoryItem) => (
                <ListItem key={item.product.id}>
                  <ListItemText
                    primary={item.product.name}
                    secondary={`${item.quantity} units remaining in ${item.location}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Products by Category
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(productsByCategory).map(([category, products]) => (
                <Grid item xs={12} sm={6} md={4} key={category}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {category}
                    </Typography>
                    <Typography variant="body2">
                      {(products as InventoryItem[]).length} products
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 