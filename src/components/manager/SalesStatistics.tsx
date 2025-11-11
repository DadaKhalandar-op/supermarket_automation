import { useState, useEffect } from 'react';
import { salesAPI, itemsAPI } from '../../services/api';
import { TrendingUp, Calendar, Download, DollarSign, Package } from 'lucide-react';

export default function SalesStatistics() {
  const [statistics, setStatistics] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const itemsData = await itemsAPI.getAllForManager();
      setItems(itemsData);
      await fetchStatistics();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await salesAPI.getStatistics(startDate, endDate, selectedItem);
      setStatistics(stats);

      const salesData = await salesAPI.getAll(startDate, endDate);
      setSales(salesData);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleFilter = () => {
    fetchStatistics();
  };

  const getTotalRevenue = () => {
    return statistics.reduce((sum, stat) => sum + stat.totalRevenue, 0);
  };

  const getTotalProfit = () => {
    return statistics.reduce((sum, stat) => sum + stat.totalProfit, 0);
  };

  const getTotalQuantity = () => {
    return statistics.reduce((sum, stat) => sum + stat.totalQuantity, 0);
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
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Filter Sales Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item</label>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Items</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} ({item.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleFilter}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-600 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">₹{getTotalRevenue().toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-600 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Profit</p>
          <p className="text-3xl font-bold text-gray-900">₹{getTotalProfit().toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-600 p-3 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Items Sold</p>
          <p className="text-3xl font-bold text-gray-900">{getTotalQuantity()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-between">
            <span className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Sales Statistics by Item
            </span>
            <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Code</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Item Name</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Qty Sold</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Sales Count</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Revenue</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Profit</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Margin</th>
              </tr>
            </thead>
            <tbody>
              {statistics.map((stat) => {
                const profitMargin = ((stat.totalProfit / stat.totalRevenue) * 100).toFixed(2);
                return (
                  <tr key={stat._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{stat.itemCode}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{stat.itemName}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                      {stat.totalQuantity}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-600">
                      {stat.salesCount}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-emerald-600">
                      ₹{stat.totalRevenue.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-purple-600">
                      ₹{stat.totalProfit.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {profitMargin}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Recent Sales Transactions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Transaction No
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Clerk</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Items</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Profit</th>
              </tr>
            </thead>
            <tbody>
              {sales.slice(0, 10).map((sale) => (
                <tr key={sale._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-mono text-gray-900">
                    {sale.transactionNumber}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{sale.clerkName}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">
                    {sale.items.length}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-semibold text-emerald-600">
                    ₹{sale.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-semibold text-purple-600">
                    ₹{sale.totalProfit.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
