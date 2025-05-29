import React, { useState, useEffect } from 'react';
import { 
  ShoppingBagIcon,
  ClockIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  FireIcon,
  CurrencyDollarIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import dashboardService, { DashboardStats } from '../services/dashboardService';
import HealthCheck from '../components/HealthCheck';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu dashboard');
      // Fallback data nếu API thất bại
      setStats({
        totalProducts: 0,
        totalRecipes: 0,
        totalShoppingLists: 0,
        activeShoppingLists: 0,
        recentActivities: [],
        lowStockProducts: [],
        popularRecipes: []
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'product_added':
        return <ShoppingBagIcon className="h-5 w-5 text-blue-500" />;
      case 'recipe_created':
        return <FireIcon className="h-5 w-5 text-orange-500" />;
      case 'shopping_list_created':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'product_purchased':
        return <CurrencyDollarIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
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
            onClick={loadDashboardData}
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
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h1>
        <div className="text-sm text-gray-500">
          Cập nhật lúc {new Date().toLocaleString('vi-VN')}
        </div>
      </div>

      {/* Health Check */}
      <div className="mb-6">
        <HealthCheck />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Tổng sản phẩm */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng sản phẩm</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        {/* Tổng công thức */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <FireIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Công thức</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalRecipes}</p>
            </div>
          </div>
        </div>

        {/* Danh sách mua sắm */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">DS đang hoạt động</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeShoppingLists ?? 0}</p>
            </div>
          </div>
        </div>

        {/* Tổng DS mua sắm */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng DS mua sắm</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalShoppingLists ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sản phẩm sắp hết */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
              Sản phẩm sắp hết
            </h3>
          </div>
          <div className="p-4">
            {(stats.lowStockProducts?.length ?? 0) === 0 ? (
              <p className="text-gray-500 text-center py-4">Tất cả sản phẩm đều đầy đủ</p>
            ) : (
              <div className="space-y-3">
                {(stats.lowStockProducts || []).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-500">Tồn kho: {product.currentStock} {product.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-yellow-700">
                        Cần thêm: {Math.max(0, product.minStock - product.currentStock)} {product.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hoạt động gần đây */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
              Hoạt động gần đây
            </h3>
          </div>
          <div className="p-4">
            {(stats.recentActivities?.length ?? 0) === 0 ? (
              <p className="text-gray-500 text-center py-4">Chưa có hoạt động nào</p>
            ) : (
              <div className="space-y-3">
                {(stats.recentActivities || []).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Công thức phổ biến */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FireIcon className="h-5 w-5 text-orange-500 mr-2" />
              Công thức phổ biến
            </h3>
          </div>
          <div className="p-4">
            {(stats.popularRecipes?.length ?? 0) === 0 ? (
              <p className="text-gray-500 text-center py-4">Chưa có công thức nào</p>
            ) : (
              <div className="space-y-3">
                {(stats.popularRecipes || []).map((recipe) => (
                  <div key={recipe.id} className="flex items-center space-x-3">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/48x48?text=Recipe';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{recipe.name}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{recipe.viewCount} lượt xem</span>
                        <span className="flex items-center">
                          <HeartIcon className="h-3 w-3 mr-1" />
                          {recipe.favoriteCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động nhanh</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => window.location.href = '/fridge-manager'}
            className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShoppingBagIcon className="h-8 w-8 mx-auto text-blue-500 mb-2" />
            <span className="text-sm font-medium">Tủ lạnh</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/shopping-list'}
            className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CheckCircleIcon className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <span className="text-sm font-medium">Mua sắm</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/recipes'}
            className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FireIcon className="h-8 w-8 mx-auto text-orange-500 mb-2" />
            <span className="text-sm font-medium">Công thức</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/meal-planner'}
            className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ClockIcon className="h-8 w-8 mx-auto text-purple-500 mb-2" />
            <span className="text-sm font-medium">Lập kế hoạch</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 