import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import statisticsService, { StatisticsData, TimeRange } from '../services/statisticsService';

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    loadStatistics();
  }, [selectedPeriod]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const timeRange: Partial<TimeRange> = {
        period: selectedPeriod
      };
      
      const data = await statisticsService.getStatistics(timeRange);
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu thống kê');
      // Fallback data
      setStats({
        overview: {
          totalSpent: 0,
          totalProducts: 0,
          totalRecipes: 0,
          completedShoppingLists: 0,
          averageShoppingListValue: 0,
          topCategories: []
        },
        productStats: {
          mostPurchased: [],
          categoryDistribution: [],
          priceRanges: [],
          stockLevels: []
        },
        recipeStats: {
          mostViewed: [],
          difficultyDistribution: [],
          averageCookTime: 0,
          averageServings: 0,
          popularTags: []
        },
        shoppingStats: {
          completionRate: 0,
          averageItemsPerList: 0,
          monthlyTrends: [],
          frequentlyBoughtTogether: []
        },
        timeRange: {
          start: '',
          end: '',
          period: selectedPeriod
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
          <button 
            onClick={loadStatistics}
            className="ml-4 text-red-800 underline"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thống kê & Báo cáo</h1>
        
        {/* Period Selector */}
        <div className="flex space-x-2">
          {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedPeriod === period
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period === 'week' && 'Tuần'}
              {period === 'month' && 'Tháng'}
              {period === 'quarter' && 'Quý'}
              {period === 'year' && 'Năm'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng chi tiêu</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.overview.totalSpent)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng sản phẩm</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.overview.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <ChartBarIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">DS hoàn thành</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.overview.completedShoppingLists}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <CalendarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Giá trị TB/DS</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.overview.averageShoppingListValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Danh mục hàng đầu</h3>
          </div>
          <div className="p-6">
            {stats.overview.topCategories.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Chưa có dữ liệu</p>
            ) : (
              <div className="space-y-4">
                {stats.overview.topCategories.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-900">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(category.value)}</p>
                      <p className="text-sm text-gray-500">{category.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Shopping Completion Rate */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Hiệu suất mua sắm</h3>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {stats.shoppingStats.completionRate.toFixed(1)}%
              </div>
              <p className="text-gray-600">Tỷ lệ hoàn thành danh sách</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trung bình mục/danh sách</span>
                <span className="font-semibold">{stats.shoppingStats.averageItemsPerList.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Stats */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Thống kê sản phẩm</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Distribution */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Phân bố theo danh mục</h4>
              <div className="space-y-3">
                {stats.productStats.categoryDistribution.map((category) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <span className="text-gray-700">{category.category}</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12">{category.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock Levels */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Mức tồn kho</h4>
              <div className="space-y-3">
                {stats.productStats.stockLevels.map((level) => (
                  <div key={level.level} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">
                      {level.level === 'high' && 'Cao'}
                      {level.level === 'medium' && 'Trung bình'}
                      {level.level === 'low' && 'Thấp'}
                      {level.level === 'out' && 'Hết hàng'}
                    </span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className={`h-2 rounded-full ${
                            level.level === 'high' ? 'bg-green-600' :
                            level.level === 'medium' ? 'bg-yellow-600' :
                            level.level === 'low' ? 'bg-orange-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${level.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12">{level.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Stats */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Thống kê công thức</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {stats.recipeStats.averageCookTime.toFixed(0)}
              </div>
              <p className="text-gray-600">Thời gian nấu TB (phút)</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {stats.recipeStats.averageServings.toFixed(1)}
              </div>
              <p className="text-gray-600">Khẩu phần TB</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {stats.recipeStats.popularTags.length}
              </div>
              <p className="text-gray-600">Tags phổ biến</p>
            </div>
          </div>

          {/* Difficulty Distribution */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Phân bố độ khó</h4>
            <div className="grid grid-cols-3 gap-4">
              {stats.recipeStats.difficultyDistribution.map((diff) => (
                <div key={diff.difficulty} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold mb-1 ${
                    diff.difficulty === 'easy' ? 'text-green-600' :
                    diff.difficulty === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {diff.count}
                  </div>
                  <p className="text-gray-600 capitalize">
                    {diff.difficulty === 'easy' && 'Dễ'}
                    {diff.difficulty === 'medium' && 'Trung bình'}
                    {diff.difficulty === 'hard' && 'Khó'}
                  </p>
                  <p className="text-sm text-gray-500">{diff.percentage.toFixed(1)}%</p>
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