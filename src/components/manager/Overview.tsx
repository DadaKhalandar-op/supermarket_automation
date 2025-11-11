import { useState, useEffect } from 'react';
import { itemsAPI, salesAPI } from '../../services/api';
import { Package, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

export default function Overview() {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    todaySales: 0,
    todayRevenue: 0,
    todayProfit: 0,
  });
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      const items = await itemsAPI.getAllForManager();
      const today = new Date().toISOString().split('T')[0];
      const sales = await salesAPI.getAll(today, today);

      const lowStock = items.filter((item: any) => item.stock <= item.minStock && item.isActive);

      const todayRevenue = sales.reduce((sum: number, sale: any) => sum + sale.totalAmount, 0);
      const todayProfit = sales.reduce((sum: number, sale: any) => sum + sale.totalProfit, 0);

      setStats({
        totalItems: items.filter((item: any) => item.isActive).length,
        lowStockItems: lowStock.length,
        todaySales: sales.length,
        todayRevenue,
        todayProfit,
      });

      setLowStockItems(lowStock);
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Items</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalItems}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-600 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Low Stock Alerts</p>
          <p className="text-3xl font-bold text-gray-900">{stats.lowStockItems}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-600 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Today's Sales</p>
          <p className="text-3xl font-bold text-gray-900">{stats.todaySales}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-600 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Today's Revenue</p>
          <p className="text-3xl font-bold text-gray-900">₹{stats.todayRevenue.toFixed(2)}</p>
          <p className="text-xs text-green-600 mt-1">Profit: ₹{stats.todayProfit.toFixed(2)}</p>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-white rounded-xl border border-orange-200 overflow-hidden">
          <div className="bg-orange-50 px-6 py-4 border-b border-orange-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Low Stock Items
            </h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Code</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Current Stock</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Min Stock</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
