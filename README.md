# Supermarket Automation Software (SAS)

A comprehensive MERN stack application for supermarket automation, featuring sales processing, inventory management, user management, and detailed sales analytics.

## Features

### Sales Clerk Interface
- **Point of Sale (POS)**: Scan items and process sales transactions
- **Real-time Inventory**: View available items with stock information
- **Shopping Cart**: Add/remove items with quantity management
- **Receipt Generation**: Professional receipts with print and download options
- **Item Search**: Quick search by item name or barcode

### Employee Dashboard
- **Stock Management**: Update item quantities (add/remove stock)
- **Low Stock Alerts**: Real-time alerts for items below minimum stock level
- **Inventory Monitoring**: View all items with current stock levels
- **Quick Actions**: Easy-to-use interface for stock updates
- **Visual Indicators**: Color-coded stock status for quick identification

### Manager Dashboard
- **Overview**: Real-time statistics on items, sales, and revenue
- **Inventory Management**:
  - Add, edit, and delete items
  - Update prices dynamically
  - Track stock levels with low-stock alerts
  - Manage 8 product categories
- **User Management**:
  - Create and manage clerk, employee, and manager accounts
  - Activate/deactivate users
  - Reset passwords
- **Sales Statistics**:
  - Filter by date range and item
  - View revenue, profit, and quantity sold
  - Profit margin analysis
  - Export capabilities

## Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens with bcrypt
- **Icons**: Lucide React

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account

## Installation

1. Install dependencies:
```bash
npm install
``` 

2. Environment variables are already configured in `.env`

3. Seed the database:
```bash
npm run seed
```

## Running the Application

Start both backend and frontend:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Login Credentials

### Manager Account
- Username: `manager`
- Password: `manager123`

### Clerk Accounts
- Username: `clerk1` / Password: `clerk123`
- Username: `clerk2` / Password: `clerk123`

### Employee Accounts
- Username: `employee1` / Password: `employee123`
- Username: `employee2` / Password: `employee123`

## Database Schema

### Users Collection
- username, password (hashed), fullName, role (manager/clerk/employee), isActive

### Items Collection
- code, name, category, unitPrice, costPrice, unit, stock, minStock, isActive

### Sales Collection
- transactionNumber, items[], totalAmount, totalProfit, clerkId, clerkName, saleDate

## Product Categories

1. Groceries
2. Dairy
3. Beverages
4. Snacks
5. Frozen
6. Bakery
7. Household
8. Personal Care

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user

### Items
- GET `/api/items` - Get all active items
- GET `/api/items/all` - Get all items (manager/employee only)
- GET `/api/items/low-stock` - Get low stock items (manager/employee only)
- POST `/api/items` - Create new item (manager only)
- PUT `/api/items/:id` - Update item (manager only)
- PATCH `/api/items/:id/stock` - Update stock (manager/employee only)
- DELETE `/api/items/:id` - Delete item (manager only)

### Sales
- POST `/api/sales` - Create new sale
- GET `/api/sales` - Get sales (with date filters)
- GET `/api/sales/statistics` - Get sales statistics (manager only)
- GET `/api/sales/:id` - Get sale by ID

### Users
- GET `/api/users` - Get all users (manager only)
- POST `/api/users` - Create user (manager only)
- PUT `/api/users/:id` - Update user (manager only)
- DELETE `/api/users/:id` - Delete user (manager only)

## Features Implementation

### Sales Transaction Flow
1. Clerk searches and adds items to cart
2. Adjusts quantities as needed
3. Completes sale
4. System automatically:
   - Generates unique transaction number
   - Calculates total amount and profit
   - Updates inventory stock
   - Displays receipt

### Inventory Management
- Real-time stock tracking
- Low stock alerts when inventory falls below minimum threshold
- Dynamic price updates by manager
- Category-based organization

### Sales Analytics
- Revenue and profit tracking
- Item-wise sales statistics
- Date range filtering
- Profit margin calculations
- Transaction history

## Security Features

- JWT-based authentication
- Bcrypt password hashing
- Role-based access control (RBAC)
- Protected routes for manager-only operations

## Build for Production

```bash
npm run build
``` 

The production build will be created in the `dist` folder.

## Development

- Backend runs on port 5000
- Frontend runs on port 5173 (Vite dev server)
- Hot reload enabled for both frontend and backend

## Notes

- All prices are in Indian Rupees (₹)
- Stock is automatically decreased when sales are processed
- Managers can update item prices on a daily basis
- The system prevents sales if insufficient stock is available
