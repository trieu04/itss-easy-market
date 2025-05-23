import React, { useMemo, useState } from 'react';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';

const Statistics: React.FC = () => {
  const { state } = useAppContext();
  const { products, expenses, shoppingLists, mealPlans } = state;
  
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // month, quarter, year

  // Tính toán thống kê chi tiêu theo thời gian
  const expenseStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Chi tiêu theo tháng (6 tháng gần nhất)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === date.getMonth() && 
               expenseDate.getFullYear() === date.getFullYear();
      });
      
      const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      monthlyData.push({
        month: date.toLocaleDateString('vi-VN', { month: 'short' }),
        amount: total,
        count: monthExpenses.length
      });
    }

    // Chi tiêu theo danh mục
    const categoryData: Record<string, number> = {};
    expenses.forEach(expense => {
      if (!categoryData[expense.category]) {
        categoryData[expense.category] = 0;
      }
      categoryData[expense.category] += expense.amount;
    });

    const categoryStats = Object.entries(categoryData)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    // Tổng chi tiêu tháng này
    const thisMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    });

    const totalThisMonth = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // So sánh với tháng trước
    const lastMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const lastMonth = currentMonth - 1 < 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth - 1 < 0 ? currentYear - 1 : currentYear;
      return expenseDate.getMonth() === lastMonth && 
             expenseDate.getFullYear() === lastMonthYear;
    });

    const totalLastMonth = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const changePercentage = totalLastMonth > 0 ? 
      ((totalThisMonth - totalLastMonth) / totalLastMonth * 100) : 0;

    return {
      monthlyData,
      categoryStats,
      totalThisMonth,
      totalLastMonth,
      changePercentage
    };
  }, [expenses]);

  // Thống kê sản phẩm
  const productStats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;

    // Sản phẩm theo danh mục
    const categoryCount: Record<string, number> = {};
    products.forEach(product => {
      if (!categoryCount[product.category]) {
        categoryCount[product.category] = 0;
      }
      categoryCount[product.category]++;
    });

    const categoryData = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // Sản phẩm có giá trị cao nhất
    const topValueProducts = products
      .map(product => ({
        ...product,
        totalValue: product.price * product.stock
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);

    // Stock analysis
    const lowStock = products.filter(p => p.stock <= 10 && p.stock > 0).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const goodStock = products.filter(p => p.stock > 10).length;

    return {
      totalProducts,
      totalValue,
      avgPrice,
      categoryData,
      topValueProducts,
      lowStock,
      outOfStock,
      goodStock
    };
  }, [products]);

  // Thống kê mua sắm
  const shoppingStats = useMemo(() => {
    const totalLists = shoppingLists.length;
    const completedLists = shoppingLists.filter(list => list.completed).length;
    const activeLists = totalLists - completedLists;
    const completionRate = totalLists > 0 ? (completedLists / totalLists * 100) : 0;

    // Tổng số items
    const totalItems = shoppingLists.reduce((sum, list) => sum + list.items.length, 0);
    const completedItems = shoppingLists.reduce((sum, list) => 
      sum + list.items.filter(item => item.completed).length, 0
    );

    // Mục thường mua nhất
    const itemFrequency: Record<string, number> = {};
    shoppingLists.forEach(list => {
      list.items.forEach(item => {
        if (!itemFrequency[item.name]) {
          itemFrequency[item.name] = 0;
        }
        itemFrequency[item.name]++;
      });
    });

    const topItems = Object.entries(itemFrequency)
      .map(([name, frequency]) => ({ name, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);

    return {
      totalLists,
      completedLists,
      activeLists,
      completionRate,
      totalItems,
      completedItems,
      topItems
    };
  }, [shoppingLists]);

  // Thống kê meal planning
  const mealStats = useMemo(() => {
    const totalPlans = mealPlans.length;
    const totalMeals = mealPlans.reduce((sum, plan) => {
      let count = 0;
      if (plan.breakfast) count++;
      if (plan.lunch) count++;
      if (plan.dinner) count++;
      return sum + count;
    }, 0);

    // Tỷ lệ kế hoạch theo bữa
    const breakfastCount = mealPlans.filter(plan => plan.breakfast).length;
    const lunchCount = mealPlans.filter(plan => plan.lunch).length;
    const dinnerCount = mealPlans.filter(plan => plan.dinner).length;

    const mealTypeStats = [
      { type: 'Bữa sáng', count: breakfastCount, percentage: totalPlans > 0 ? (breakfastCount / totalPlans * 100) : 0 },
      { type: 'Bữa trưa', count: lunchCount, percentage: totalPlans > 0 ? (lunchCount / totalPlans * 100) : 0 },
      { type: 'Bữa tối', count: dinnerCount, percentage: totalPlans > 0 ? (dinnerCount / totalPlans * 100) : 0 }
    ];

    return {
      totalPlans,
      totalMeals,
      mealTypeStats,
      avgMealsPerDay: totalPlans > 0 ? totalMeals / totalPlans : 0
    };
  }, [mealPlans]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const maxExpense = Math.max(...expenseStats.monthlyData.map(d => d.amount));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thống kê chi tiết</h1>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="month">6 tháng gần nhất</option>
          <option value="quarter">Quý này</option>
          <option value="year">Năm này</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Chi tiêu tháng này</p>
              <p className="text-2xl font-semibold text-gray-900">{formatPrice(expenseStats.totalThisMonth)}</p>
            </div>
            <div className={`p-3 rounded-full ${expenseStats.changePercentage >= 0 ? 'bg-red-100' : 'bg-green-100'}`}>
              {expenseStats.changePercentage >= 0 ? (
                <ArrowTrendingUpIcon className={`h-6 w-6 ${expenseStats.changePercentage >= 0 ? 'text-red-600' : 'text-green-600'}`} />
              ) : (
                <ArrowTrendingDownIcon className="h-6 w-6 text-green-600" />
              )}
            </div>
          </div>
          <div className="mt-2">
            <span className={`text-sm ${expenseStats.changePercentage >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {expenseStats.changePercentage >= 0 ? '+' : ''}{expenseStats.changePercentage.toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Giá trị tủ lạnh</p>
              <p className="text-2xl font-semibold text-gray-900">{formatPrice(productStats.totalValue)}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {productStats.totalProducts} sản phẩm
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tỷ lệ hoàn thành</p>
              <p className="text-2xl font-semibold text-gray-900">{shoppingStats.completionRate.toFixed(1)}%</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CalendarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Danh sách mua sắm
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Kế hoạch bữa ăn</p>
              <p className="text-2xl font-semibold text-gray-900">{mealStats.totalPlans}</p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <ChartBarIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {mealStats.avgMealsPerDay.toFixed(1)} bữa/ngày
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Chi tiêu theo tháng */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiêu 6 tháng gần nhất</h3>
          <div className="space-y-4">
            {expenseStats.monthlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{data.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{ width: `${maxExpense > 0 ? (data.amount / maxExpense * 100) : 0}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-24 text-right">
                  {formatPrice(data.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chi tiêu theo danh mục */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiêu theo danh mục</h3>
          <div className="space-y-4">
            {expenseStats.categoryStats.slice(0, 6).map((category, index) => {
              const maxCategoryAmount = expenseStats.categoryStats[0]?.amount || 1;
              const percentage = (category.amount / maxCategoryAmount * 100);
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 truncate flex-1">
                    {category.category}
                  </span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-24 text-right">
                    {formatPrice(category.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sản phẩm có giá trị cao */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm giá trị cao</h3>
          <div className="space-y-3">
            {productStats.topValueProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.stock} {product.unit}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatPrice(product.totalValue)}</p>
                  <p className="text-xs text-gray-500">{formatPrice(product.price)}/{product.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mục mua thường xuyên */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mua thường xuyên</h3>
          <div className="space-y-3">
            {shoppingStats.topItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{item.name}</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {item.frequency} lần
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Thống kê tình trạng kho */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tình trạng kho</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-900">Đầy đủ</span>
              <span className="text-2xl font-bold text-green-900">{productStats.goodStock}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium text-yellow-900">Sắp hết</span>
              <span className="text-2xl font-bold text-yellow-900">{productStats.lowStock}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="font-medium text-red-900">Hết hàng</span>
              <span className="text-2xl font-bold text-red-900">{productStats.outOfStock}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Kế hoạch bữa ăn</h4>
            <div className="space-y-2">
              {mealStats.mealTypeStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{stat.type}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {stat.percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 