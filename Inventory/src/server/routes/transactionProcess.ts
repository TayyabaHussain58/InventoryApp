import express, { RequestHandler } from 'express';
import { TransactionProcess } from '../models/TransactionProcess';
import { authMiddleware } from './auth';

const router = express.Router();

// Get all transaction processes
const getTransactionProcesses: RequestHandler = async (req, res) => {
  try {
    const processes = await TransactionProcess.find()
      .populate('transactionId')
      .populate('processedBy', 'name email');
    res.json(processes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction processes' });
  }
};

// Get transaction process by ID
const getTransactionProcess: RequestHandler = async (req, res) => {
  try {
    const process = await TransactionProcess.findById(req.params.id)
      .populate('transactionId')
      .populate('processedBy', 'name email');
    
    if (!process) {
      res.status(404).json({ message: 'Transaction process not found' });
      return;
    }
    
    res.json(process);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction process' });
  }
};

// Create new transaction process
const createTransactionProcess: RequestHandler = async (req, res) => {
  try {
    const process = new TransactionProcess({
      ...req.body,
      processedBy: (req as any).user._id
    });
    await process.save();
    res.status(201).json(process);
  } catch (error) {
    res.status(400).json({ message: 'Error creating transaction process' });
  }
};

// Update transaction process
const updateTransactionProcess: RequestHandler = async (req, res) => {
  try {
    const process = await TransactionProcess.findById(req.params.id);
    
    if (!process) {
      res.status(404).json({ message: 'Transaction process not found' });
      return;
    }

    // If status is being updated to COMPLETED, set completedAt
    if (req.body.status === 'COMPLETED' && process.status !== 'COMPLETED') {
      req.body.completedAt = new Date();
    }

    Object.assign(process, req.body);
    await process.save();
    
    res.json(process);
  } catch (error) {
    res.status(400).json({ message: 'Error updating transaction process' });
  }
};

// Delete transaction process
const deleteTransactionProcess: RequestHandler = async (req, res) => {
  try {
    const process = await TransactionProcess.findById(req.params.id);
    
    if (!process) {
      res.status(404).json({ message: 'Transaction process not found' });
      return;
    }

    await process.deleteOne();
    res.json({ message: 'Transaction process deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting transaction process' });
  }
};

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get('/', getTransactionProcesses);
router.get('/:id', getTransactionProcess);
router.post('/', createTransactionProcess);
router.put('/:id', updateTransactionProcess);
router.delete('/:id', deleteTransactionProcess);

export default router; 