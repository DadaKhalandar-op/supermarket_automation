import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { itemsAPI } from '../../services/api';
import { Package, AlertTriangle, LogOut, Plus, Minus, TrendingUp } from 'lucide-react';

interface Item {
  _id: string;
  code: string;
  name: string;
  category: string;
  unitPrice: number;
  unit: string;
  stock: number;
  minStock: number;
  isActive: boolean;
}

export default function EmployeeDashboard() {
  const { user, logout } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [stockQuantity, setStockQuantity] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const allItems = await itemsAPI.getAllForManager();
      setItems(allItems);
      
      const lowStock = allItems.filter((item: Item) => 
        item.stock <= item.minStock && item.isActive
      );
      setLowStockItems(lowStock);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!selectedItem || stockQuantity === 0) return;

    try {
      await itemsAPI.updateStock(selectedItem._id, stockQuantity);
      setSelectedItem(null);
      setStockQuantity(0);
      fetchData();
    } catch (error: any) {
      alert(error.message || 'Failed to update stock');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome, {user?.fullName}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Items</p>
            <p className="text-3xl font-bold text-gray-900">{items.length}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-600 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Low Stock Alerts</p>
            <p className="text-3xl font-bold text-gray-900">{lowStockItems.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-600 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Active Items</p>
            <p className="text-3xl font-bold text-gray-900">
              {items.filter(i => i.stock > i.minStock).length}
            </p>
          </div>
        </div>

        {lowStockItems.length > 0 && (
          <div className="bg-white rounded-xl border border-orange-200 overflow-hidden mb-8">
            <div className="bg-orange-50 px-6 py-4 border-b border-orange-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Low Stock Items - Urgent Action Required
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Code</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Current Stock</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Min Stock</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((item) => (
                    <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{item.code}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{item.category}</td>
                      <td className="py-3 px-4 text-sm text-right">
                        <span className="text-orange-600 font-semibold">{item.stock}</span>
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-600">{item.minStock}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="px-3 py-1 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          Update Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Items Inventory</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Code</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Stock</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Unit</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{item.code}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{item.name}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className={`font-semibold ${
                        item.stock <= item.minStock ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-600">{item.unit}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
              <h2 className="text-xl font-bold">Update Stock</h2>
              <p className="text-sm opacity-90">{selectedItem.name} ({selectedItem.code})</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Stock</p>
                <p className="text-2xl font-bold text-gray-900">{selectedItem.stock} {selectedItem.unit}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add/Remove Quantity
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setStockQuantity(Math.max(-selectedItem.stock, stockQuantity - 1))}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center text-lg font-semibold"
                  />
                  <button
                    onClick={() => setStockQuantity(stockQuantity + 1)}
                    className="p-2 bg-green-100 hover:bg-green-200 rounded-lg text-green-600"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">New Stock Will Be</p>
                <p className="text-xl font-bold text-gray-900">
                  {selectedItem.stock + stockQuantity} {selectedItem.unit}
                </p>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleUpdateStock}
                  disabled={stockQuantity === 0}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                >
                  Update Stock
                </button>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    setStockQuantity(0);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
