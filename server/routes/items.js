import express from 'express';
import Item from '../models/Item.js';
import { protect, managerOnly, employeeOrManager } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const items = await Item.find({ isActive: true }).sort({ name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/all', protect, employeeOrManager, async (req, res) => {
  try {
    const items = await Item.find().sort({ name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/low-stock', protect, employeeOrManager, async (req, res) => {
  try {
    const items = await Item.find({ 
      isActive: true,
      $expr: { $lte: ['$stock', '$minStock'] }
    }).sort({ stock: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, managerOnly, async (req, res) => {
  try {
    const { code, name, category, unitPrice, costPrice, unit, stock, minStock } = req.body;

    const itemExists = await Item.findOne({ code });

    if (itemExists) {
      return res.status(400).json({ message: 'Item with this code already exists' });
    }

    const item = await Item.create({
      code,
      name,
      category,
      unitPrice,
      costPrice,
      unit,
      stock,
      minStock,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, managerOnly, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item) {
      item.code = req.body.code || item.code;
      item.name = req.body.name || item.name;
      item.category = req.body.category || item.category;
      item.unitPrice = req.body.unitPrice !== undefined ? req.body.unitPrice : item.unitPrice;
      item.costPrice = req.body.costPrice !== undefined ? req.body.costPrice : item.costPrice;
      item.unit = req.body.unit || item.unit;
      item.stock = req.body.stock !== undefined ? req.body.stock : item.stock;
      item.minStock = req.body.minStock !== undefined ? req.body.minStock : item.minStock;
      item.isActive = req.body.isActive !== undefined ? req.body.isActive : item.isActive;

      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/stock', protect, employeeOrManager, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item) {
      const { quantity } = req.body;
      item.stock += quantity;

      if (item.stock < 0) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }

      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, managerOnly, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (item) {
      await item.deleteOne();
      res.json({ message: 'Item removed' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
