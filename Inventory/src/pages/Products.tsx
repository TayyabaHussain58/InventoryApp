import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useInventory } from '../context/InventoryContext';
import { InventoryItem } from '../types';

export default function Products() {
  const navigate = useNavigate();
  const { products, removeProduct, updateStock } = useInventory();
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [quantity, setQuantity] = useState('');

  const handleUpdateStock = () => {
    if (selectedProduct && quantity) {
      try {
        updateStock(selectedProduct.product.id, parseInt(quantity));
        setOpenDialog(false);
        setQuantity('');
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const handleRemoveProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to remove this product?')) {
      try {
        removeProduct(productId, 1);
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Products</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/products/add')}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((item) => (
              <TableRow key={item.product.id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.product.description}</TableCell>
                <TableCell>{item.product.category}</TableCell>
                <TableCell>${item.product.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedProduct(item);
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleRemoveProduct(item.product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Update Stock</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateStock} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 