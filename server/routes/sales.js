import express from 'express';
import Sale from '../models/Sale.js';
import Item from '../models/Item.js';
import { protect, managerOnly } from '../middleware/auth.js';

const router = express.Router();

const generateTransactionNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TXN${year}${month}${day}${hours}${minutes}${seconds}${random}`;
};

router.post('/', protect, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in sale' });
    }

    const saleItems = [];
    let totalAmount = 0;
    let totalProfit = 0;

    for (const saleItem of items) {
      const item = await Item.findById(saleItem.itemId);

      if (!item) {
        return res.status(404).json({ message: `Item not found: ${saleItem.itemId}` });
      }

      if (item.stock < saleItem.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}. Available: ${item.stock}`
        });
      }

      item.stock -= saleItem.quantity;
      await item.save();

      const totalPrice = item.unitPrice * saleItem.quantity;
      const profit = (item.unitPrice - item.costPrice) * saleItem.quantity;

      saleItems.push({
        itemId: item._id,
        itemCode: item.code,
        itemName: item.name,
        quantity: saleItem.quantity,
        unitPrice: item.unitPrice,
        costPrice: item.costPrice,
        totalPrice,
        profit,
      });

      totalAmount += totalPrice;
      totalProfit += profit;
    }

    const transactionNumber = generateTransactionNumber();

    const sale = await Sale.create({
      transactionNumber,
      items: saleItems,
      totalAmount,
      totalProfit,
      clerkId: req.user._id,
      clerkName: req.user.fullName,
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + 'T23:59:59.999Z'),
      };
    } else if (startDate) {
      query.saleDate = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.saleDate = { $lte: new Date(endDate + 'T23:59:59.999Z') };
    }

    const sales = await Sale.find(query).sort({ saleDate: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/statistics', protect, managerOnly, async (req, res) => {
  try {
    const { startDate, endDate, itemId } = req.query;

    let matchStage = {};

    if (startDate && endDate) {
      matchStage.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + 'T23:59:59.999Z'),
      };
    } else if (startDate) {
      matchStage.saleDate = { $gte: new Date(startDate) };
    } else if (endDate) {
      matchStage.saleDate = { $lte: new Date(endDate + 'T23:59:59.999Z') };
    }

    const pipeline = [
      { $match: matchStage },
      { $unwind: '$items' },
    ];

    if (itemId) {
      pipeline.push({
        $match: { 'items.itemId': mongoose.Types.ObjectId(itemId) }
      });
    }

    pipeline.push(
      {
        $group: {
          _id: '$items.itemId',
          itemCode: { $first: '$items.itemCode' },
          itemName: { $first: '$items.itemName' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.totalPrice' },
          totalProfit: { $sum: '$items.profit' },
          salesCount: { $sum: 1 },
        }
      },
      { $sort: { totalRevenue: -1 } }
    );

    const statistics = await Sale.aggregate(pipeline);
    res.json(statistics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (sale) {
      res.json(sale);
    } else {
      res.status(404).json({ message: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
