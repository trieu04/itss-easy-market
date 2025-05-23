import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import { 
  UserIcon, 
  PencilIcon,
  CameraIcon,
  CalendarIcon,
  ChartBarIcon,
  TrophyIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Profile: React.FC = () => {
  const { state: authState, updateProfile } = useAuthContext();
  const { state: appState } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(authState.user || {
    name: '',
    email: '',
    avatar: '',
    preferences: {
      language: 'vi',
      theme: 'light',
      notifications: true
    }
  });

  // Tính toán thống kê
  const stats = {
    totalProducts: appState.products.length,
    totalRecipes: appState.recipes.length,
    totalShoppingLists: appState.shoppingLists.length,
    totalExpenses: appState.expenses.reduce((sum, expense) => sum + expense.amount, 0),
    averageExpensePerMonth: appState.expenses.reduce((sum, expense) => sum + expense.amount, 0) / 12,
    favoriteCategory: (() => {
      const categories: Record<string, number> = {};
      appState.products.forEach(product => {
        categories[product.category] = (categories[product.category] || 0) + 1;
      });
      return Object.entries(categories).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'N/A';
    })(),
    joinDate: '2024-01-01', // Mock data
    daysActive: Math.floor(Math.random() * 365) + 1,
  };

  const achievements = [
    { 
      id: 1, 
      name: 'Người quản lý tủ lạnh', 
      description: 'Thêm 50+ sản phẩm vào tủ lạnh',
      icon: '🏆',
      earned: stats.totalProducts >= 50,
      progress: Math.min(stats.totalProducts, 50),
      max: 50
    },
    { 
      id: 2, 
      name: 'Đầu bếp tài ba', 
      description: 'Lưu 20+ công thức nấu ăn',
      icon: '👨‍🍳',
      earned: stats.totalRecipes >= 20,
      progress: Math.min(stats.totalRecipes, 20),
      max: 20
    },
    { 
      id: 3, 
      name: 'Người mua sắm thông minh', 
      description: 'Tạo 10+ danh sách mua sắm',
      icon: '🛒',
      earned: stats.totalShoppingLists >= 10,
      progress: Math.min(stats.totalShoppingLists, 10),
      max: 10
    },
    { 
      id: 4, 
      name: 'Người dùng trung thành', 
      description: 'Sử dụng ứng dụng trong 30+ ngày',
      icon: '💎',
      earned: stats.daysActive >= 30,
      progress: Math.min(stats.daysActive, 30),
      max: 30
    }
  ];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfile(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(authState.user || editedUser);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = () => {
    // Giả lập upload avatar
    const newAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(editedUser.name || 'User')}&background=${Math.floor(Math.random()*16777215).toString(16)}&color=fff`;
    setEditedUser(prev => ({
      ...prev,
      avatar: newAvatarUrl
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700"
                >
                  Lưu
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={editedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(editedUser.name || 'User')}&background=10b981&color=fff`}
                alt={editedUser.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              {isEditing && (
                <button
                  onClick={handleAvatarChange}
                  className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                >
                  <CameraIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={editedUser.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{authState.user?.name}</h2>
                  <p className="text-gray-600 mb-2">{authState.user?.email}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Tham gia từ {formatDate(stats.joinDate)}</span>
                    <span className="mx-2">•</span>
                    <span>{stats.daysActive} ngày hoạt động</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sản phẩm</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <StarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Công thức</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalRecipes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Chi tiêu</p>
                <p className="text-lg font-semibold text-gray-900">{formatPrice(stats.totalExpenses)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <TrophyIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Thành tích</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {achievements.filter(a => a.earned).length}/{achievements.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-6">
            <TrophyIcon className="h-6 w-6 text-yellow-500 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">Thành tích</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.earned
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{achievement.icon}</span>
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      achievement.earned ? 'text-green-900' : 'text-gray-900'
                    }`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <div className="text-green-600">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      achievement.earned ? 'bg-green-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${(achievement.progress / achievement.max) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {achievement.progress}/{achievement.max}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Tóm tắt hoạt động</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Danh mục yêu thích</h3>
              <p className="text-lg font-semibold text-blue-600">{stats.favoriteCategory}</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Chi tiêu trung bình/tháng</h3>
              <p className="text-lg font-semibold text-green-600">
                {formatPrice(stats.averageExpensePerMonth)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Danh sách mua sắm</h3>
              <p className="text-lg font-semibold text-purple-600">{stats.totalShoppingLists}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 