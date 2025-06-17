import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material';
import { useInventory } from '../context/InventoryContext';
import { InventoryItem } from '../types';

export default function Transactions() {
  const { products, addProduct, removeProduct } = useInventory();
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [transactionType, setTransactionType] = useState<'in' | 'out'>('in');
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Transactions
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Current Stock</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((item) => (
              <TableRow key={item.product.id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpen(item)}
                  >
                    Record Transaction
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Record Transaction</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
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