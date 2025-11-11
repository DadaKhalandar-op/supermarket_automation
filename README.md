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
  - **Interactive Charts** (NEW):
    - Revenue & Profit Trends Line Chart
    - Top 10 Items by Revenue Bar Chart
    - Daily sales aggregation with visual insights
  - Profit margin analysis
  - Export capabilities

## New Features (v2.0)

### 📊 Interactive Sales Analytics Dashboard
- **Line Chart Visualization**: Track revenue and profit trends over time with smooth, animated line charts
- **Bar Chart Analytics**: Visual representation of top-performing items
- **Daily Sales Aggregation**: Automatic daily aggregation of sales data for trend analysis
- **Responsive Charts**: All charts are fully responsive and work on all screen sizes
- **Interactive Tooltips**: Hover over data points for detailed information
- **Date Range Filtering**: Charts dynamically update based on selected date filters

### 🔐 Enhanced Security with Session Timeout
- **Automatic Session Expiration**: JWT tokens expire after 2 hours of inactivity
- **Auto-Logout**: Users are automatically logged out when their session expires
- **Session Expiry Notifications**: Clear messaging when session expires
- **Client-Side Timer**: Countdown timer prevents API calls with expired tokens
- **Seamless Re-authentication**: Users are prompted to login again with a friendly message

## Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens with bcrypt (2-hour expiration)
- **Data Visualization**: Recharts - Responsive charting library
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
- GET `/api/sales/trends` - Get daily sales trends for charts (manager only)
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
- **Interactive trend visualization with charts**
- **Daily aggregation for performance insights**

## Security Features

- JWT-based authentication with 2-hour token expiration
- Automatic session timeout and logout
- Session expiry detection and user notification
- Bcrypt password hashing
- Role-based access control (RBAC)
- Protected routes for manager-only operations
- Client-side token validation and expiry tracking

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
- **Session timeout is set to 2 hours** - Can be configured in `server/routes/auth.js`
- Charts show last 30 days of data by default when no date range is selected
- All existing features remain fully functional with the new updates

## Configuration

### Adjusting Session Timeout
To change the session timeout duration, edit `server/routes/auth.js`:

```javascript
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '2h', // Change this value (e.g., '30m', '4h', '1d')
  });
};
```

Also update the expiration calculation in the login response:
```javascript
const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // Match the token expiration
```

## Troubleshooting

### Charts Not Displaying
- Ensure `recharts` is installed: `npm install recharts`
- Check browser console for errors
- Verify that sales data exists in the database

### Session Expiring Too Quickly
- Check the token expiration setting in `server/routes/auth.js`
- Ensure system time is correct on both client and server
- Clear browser localStorage and login again

### API 401 Errors
- Session may have expired - login again
- Check if JWT_SECRET is set in environment variables
- Verify token is being sent in Authorization header

## Version History

### Version 2.0 (November 2025)
- ✨ Added interactive sales charts (Line & Bar charts)
- 🔐 Implemented session timeout with auto-logout
- 📊 Added daily sales trend aggregation endpoint
- 🎨 Enhanced UI with visual analytics
- ⏱️ JWT token expiration set to 2 hours
- 🔔 Session expiry notifications

### Version 1.0
- Initial release with core POS functionality
- User management and authentication
- Inventory management
- Sales processing and statistics
