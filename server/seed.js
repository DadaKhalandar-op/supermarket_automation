import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Item from './models/Item.js';
import Sale from './models/Sale.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Item.deleteMany();
    await Sale.deleteMany();

    console.log('Existing data cleared');

    const users = [
      {
        username: 'manager',
        password: 'manager123',
        fullName: 'Store Manager',
        role: 'manager',
      },
      {
        username: 'clerk1',
        password: 'clerk123',
        fullName: 'John Clerk',
        role: 'clerk',
      },
      {
        username: 'clerk2',
        password: 'clerk123',
        fullName: 'Sarah Clerk',
        role: 'clerk',
      },
      {
        username: 'employee1',
        password: 'employee123',
        fullName: 'David Employee',
        role: 'employee',
      },
      {
        username: 'employee2',
        password: 'employee123',
        fullName: 'Lisa Employee',
        role: 'employee',
      },
    ];

    const createdUsers = await User.create(users);
    console.log('Users seeded:', createdUsers.length);

    const items = [
      {
        code: 'GRC001',
        name: 'Basmati Rice',
        category: 'Groceries',
        unitPrice: 120,
        costPrice: 90,
        unit: 'kg',
        stock: 500,
        minStock: 50,
      },
      {
        code: 'GRC002',
        name: 'Wheat Flour',
        category: 'Groceries',
        unitPrice: 45,
        costPrice: 35,
        unit: 'kg',
        stock: 750,
        minStock: 100,
      },
      {
        code: 'GRC003',
        name: 'Sugar',
        category: 'Groceries',
        unitPrice: 50,
        costPrice: 40,
        unit: 'kg',
        stock: 600,
        minStock: 80,
      },
      {
        code: 'DRY001',
        name: 'Fresh Milk',
        category: 'Dairy',
        unitPrice: 60,
        costPrice: 45,
        unit: 'liter',
        stock: 200,
        minStock: 30,
      },
      {
        code: 'DRY002',
        name: 'Cheddar Cheese',
        category: 'Dairy',
        unitPrice: 350,
        costPrice: 280,
        unit: 'kg',
        stock: 80,
        minStock: 10,
      },
      {
        code: 'DRY003',
        name: 'Plain Yogurt',
        category: 'Dairy',
        unitPrice: 80,
        costPrice: 60,
        unit: 'kg',
        stock: 150,
        minStock: 20,
      },
      {
        code: 'BEV001',
        name: 'Orange Juice',
        category: 'Beverages',
        unitPrice: 120,
        costPrice: 90,
        unit: 'liter',
        stock: 180,
        minStock: 25,
      },
      {
        code: 'BEV002',
        name: 'Coca Cola',
        category: 'Beverages',
        unitPrice: 40,
        costPrice: 30,
        unit: 'liter',
        stock: 300,
        minStock: 50,
      },
      {
        code: 'BEV003',
        name: 'Mineral Water',
        category: 'Beverages',
        unitPrice: 20,
        costPrice: 15,
        unit: 'liter',
        stock: 500,
        minStock: 100,
      },
      {
        code: 'SNK001',
        name: 'Potato Chips',
        category: 'Snacks',
        unitPrice: 50,
        costPrice: 35,
        unit: 'pack',
        stock: 250,
        minStock: 40,
      },
      {
        code: 'SNK002',
        name: 'Chocolate Bar',
        category: 'Snacks',
        unitPrice: 80,
        costPrice: 55,
        unit: 'piece',
        stock: 400,
        minStock: 60,
      },
      {
        code: 'SNK003',
        name: 'Biscuits Pack',
        category: 'Snacks',
        unitPrice: 60,
        costPrice: 42,
        unit: 'pack',
        stock: 300,
        minStock: 50,
      },
      {
        code: 'FRZ001',
        name: 'Ice Cream',
        category: 'Frozen',
        unitPrice: 250,
        costPrice: 180,
        unit: 'liter',
        stock: 100,
        minStock: 15,
      },
      {
        code: 'FRZ002',
        name: 'Frozen Pizza',
        category: 'Frozen',
        unitPrice: 350,
        costPrice: 260,
        unit: 'piece',
        stock: 120,
        minStock: 20,
      },
      {
        code: 'BAK001',
        name: 'White Bread',
        category: 'Bakery',
        unitPrice: 40,
        costPrice: 28,
        unit: 'piece',
        stock: 150,
        minStock: 30,
      },
      {
        code: 'BAK002',
        name: 'Croissant',
        category: 'Bakery',
        unitPrice: 50,
        costPrice: 35,
        unit: 'piece',
        stock: 100,
        minStock: 20,
      },
      {
        code: 'HHS001',
        name: 'Dish Soap',
        category: 'Household',
        unitPrice: 120,
        costPrice: 90,
        unit: 'liter',
        stock: 200,
        minStock: 30,
      },
      {
        code: 'HHS002',
        name: 'Laundry Detergent',
        category: 'Household',
        unitPrice: 300,
        costPrice: 220,
        unit: 'kg',
        stock: 150,
        minStock: 25,
      },
      {
        code: 'PER001',
        name: 'Shampoo',
        category: 'Personal Care',
        unitPrice: 250,
        costPrice: 180,
        unit: 'liter',
        stock: 180,
        minStock: 25,
      },
      {
        code: 'PER002',
        name: 'Toothpaste',
        category: 'Personal Care',
        unitPrice: 80,
        costPrice: 55,
        unit: 'piece',
        stock: 250,
        minStock: 40,
      },
    ];

    const createdItems = await Item.create(items);
    console.log('Items seeded:', createdItems.length);

    const sampleSales = [
      {
        transactionNumber: 'TXN202510150001',
        items: [
          {
            itemId: createdItems[0]._id,
            itemCode: createdItems[0].code,
            itemName: createdItems[0].name,
            quantity: 2,
            unitPrice: createdItems[0].unitPrice,
            costPrice: createdItems[0].costPrice,
            totalPrice: createdItems[0].unitPrice * 2,
            profit: (createdItems[0].unitPrice - createdItems[0].costPrice) * 2,
          },
          {
            itemId: createdItems[3]._id,
            itemCode: createdItems[3].code,
            itemName: createdItems[3].name,
            quantity: 3,
            unitPrice: createdItems[3].unitPrice,
            costPrice: createdItems[3].costPrice,
            totalPrice: createdItems[3].unitPrice * 3,
            profit: (createdItems[3].unitPrice - createdItems[3].costPrice) * 3,
          },
        ],
        totalAmount: (createdItems[0].unitPrice * 2) + (createdItems[3].unitPrice * 3),
        totalProfit: ((createdItems[0].unitPrice - createdItems[0].costPrice) * 2) +
                     ((createdItems[3].unitPrice - createdItems[3].costPrice) * 3),
        clerkId: createdUsers[1]._id,
        clerkName: createdUsers[1].fullName,
        saleDate: new Date('2025-10-15T10:30:00'),
      },
      {
        transactionNumber: 'TXN202510150002',
        items: [
          {
            itemId: createdItems[9]._id,
            itemCode: createdItems[9].code,
            itemName: createdItems[9].name,
            quantity: 5,
            unitPrice: createdItems[9].unitPrice,
            costPrice: createdItems[9].costPrice,
            totalPrice: createdItems[9].unitPrice * 5,
            profit: (createdItems[9].unitPrice - createdItems[9].costPrice) * 5,
          },
          {
            itemId: createdItems[7]._id,
            itemCode: createdItems[7].code,
            itemName: createdItems[7].name,
            quantity: 4,
            unitPrice: createdItems[7].unitPrice,
            costPrice: createdItems[7].costPrice,
            totalPrice: createdItems[7].unitPrice * 4,
            profit: (createdItems[7].unitPrice - createdItems[7].costPrice) * 4,
          },
        ],
        totalAmount: (createdItems[9].unitPrice * 5) + (createdItems[7].unitPrice * 4),
        totalProfit: ((createdItems[9].unitPrice - createdItems[9].costPrice) * 5) +
                     ((createdItems[7].unitPrice - createdItems[7].costPrice) * 4),
        clerkId: createdUsers[2]._id,
        clerkName: createdUsers[2].fullName,
        saleDate: new Date('2025-10-15T14:45:00'),
      },
    ];

    await Sale.create(sampleSales);
    console.log('Sample sales seeded:', sampleSales.length);

    console.log('\n=== Seeding Complete ===');
    console.log('Login credentials:');
    console.log('Manager: username=manager, password=manager123');
    console.log('Clerk 1: username=clerk1, password=clerk123');
    console.log('Clerk 2: username=clerk2, password=clerk123');
    console.log('Employee 1: username=employee1, password=employee123');
    console.log('Employee 2: username=employee2, password=employee123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
