import React, { useState, useMemo } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  FireIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { useAppContext, Product } from '../contexts/AppContext';
import { AddProductModal } from '../components/modals/AddProductModal';
import ProductImage from 'components/common/ProductImage';

interface FridgeItem extends Product {
  location: 'fridge' | 'freezer' | 'pantry';
  expiryDate: string;
  addedDate: string;
}

const FridgeManager: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { products, recipes } = state;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<'all' | 'fridge' | 'freezer' | 'pantry'>('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [showExpiredOnly, setShowExpiredOnly] = useState(false);

  // Transform products to fridge items (mock expiry dates for demo)
  const fridgeItems: FridgeItem[] = useMemo(() => {
    return products.map(product => {
      const addedDaysAgo = Math.floor(Math.random() * 14);
      const expiryDaysFromNow = Math.floor(Math.random() * 30) - 10; // Some expired, some fresh
      
      const addedDate = new Date();
      addedDate.setDate(addedDate.getDate() - addedDaysAgo);
      
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDaysFromNow);
      
      const locations: ('fridge' | 'freezer' | 'pantry')[] = ['fridge', 'freezer', 'pantry'];
      const location = locations[Math.floor(Math.random() * locations.length)];
      
      return {
        ...product,
        location,
        expiryDate: expiryDate.toISOString().split('T')[0],
        addedDate: addedDate.toISOString().split('T')[0]
      };
    });
  }, [products]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(fridgeItems.map(item => item.category)));
    return cats.sort();
  }, [fridgeItems]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    let filtered = fridgeItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = selectedLocation === 'all' || item.location === selectedLocation;
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesExpiry = !showExpiredOnly || item.expiryDate < today;
      
      return matchesSearch && matchesLocation && matchesCategory && matchesExpiry;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'expiry':
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        case 'category':
          return a.category.localeCompare(b.category);
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

    return filtered;
  }, [fridgeItems, searchTerm, selectedLocation, selectedCategory, sortBy, showExpiredOnly]);

  // Statistics
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const threeDaysString = threeDaysFromNow.toISOString().split('T')[0];

    const expired = fridgeItems.filter(item => item.expiryDate < today);
    const expiringSoon = fridgeItems.filter(item => 
      item.expiryDate >= today && item.expiryDate <= threeDaysString
    );
    const fresh = fridgeItems.filter(item => item.expiryDate > threeDaysString);

    // Most common category
    const categoryCounts: Record<string, number> = {};
    fridgeItems.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });
    const mostCommonCategory = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'N/A';

    return {
      total: fridgeItems.length,
      expired: expired.length,
      expiringSoon: expiringSoon.length,
      fresh: fresh.length,
      mostCommonCategory
    };
  }, [fridgeItems]);

  // Recipe suggestions based on available ingredients
  const suggestedRecipes = useMemo(() => {
    const availableIngredients = fridgeItems
      .filter(item => new Date(item.expiryDate) >= new Date())
      .map(item => item.name.toLowerCase());

    return recipes.filter(recipe => {
      const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase());
      const matchCount = recipeIngredients.filter(ing => 
        availableIngredients.some(available => 
          available.includes(ing) || ing.includes(available)
        )
      ).length;
      
      return matchCount >= Math.ceil(recipeIngredients.length * 0.6); // At least 60% match
    }).slice(0, 3);
  }, [fridgeItems, recipes]);

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const threeDaysString = threeDaysFromNow.toISOString().split('T')[0];

    if (expiryDate < today) {
      return { status: 'expired', color: 'text-red-600 bg-red-50', label: 'Đã hết hạn!' };
    } else if (expiryDate <= threeDaysString) {
      return { status: 'expiring', color: 'text-yellow-600 bg-yellow-50', label: 'Sắp hết hạn' };
    } else {
      return { status: 'fresh', color: 'text-green-600 bg-green-50', label: 'Còn tốt' };
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'fridge': return '🧊';
      case 'freezer': return '❄️';
      case 'pantry': return '🗄️';
      default: return '📦';
    }
  };

  const getLocationLabel = (location: string) => {
    switch (location) {
      case 'fridge': return 'Tủ lạnh';
      case 'freezer': return 'Ngăn đông';
      case 'pantry': return 'Tủ bếp';
      default: return 'Khác';
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi tủ lạnh?')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý tủ lạnh</h1>
        <button
          onClick={handleAddProduct}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm sản phẩm mới
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Tất cả vị trí</option>
              <option value="fridge">🧊 Tủ lạnh</option>
              <option value="freezer">❄️ Ngăn đông</option>
              <option value="pantry">🗄️ Tủ bếp</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="name">Sắp xếp theo tên</option>
              <option value="expiry">Hạn sử dụng</option>
              <option value="category">Danh mục</option>
              <option value="location">Vị trí</option>
            </select>
          </div>
        </div>

        {/* Filter Options */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showExpiredOnly}
              onChange={(e) => setShowExpiredOnly(e.target.checked)}
              className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">Chỉ hiển thị đã hết hạn</span>
          </label>
          <div className="text-sm text-gray-500">
            Tìm thấy {filteredItems.length} sản phẩm
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Tổng sản phẩm</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Sắp hết hạn</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Đã hết hạn</h3>
          <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Còn tốt</h3>
          <p className="text-2xl font-bold text-green-600">{stats.fresh}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Phân loại phổ biến</h3>
          <p className="text-lg font-semibold text-gray-900 truncate">{stats.mostCommonCategory}</p>
        </div>
      </div>

      {/* Recipe Suggestions */}
      {suggestedRecipes.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center mb-4">
            <FireIcon className="h-6 w-6 text-orange-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Gợi ý món ăn từ tủ lạnh</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedRecipes.map((recipe) => (
              <div key={recipe.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer">
                <ProductImage
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-medium text-gray-900">{recipe.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{recipe.description}</p>
                <div className="flex items-center mt-2 text-xs text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{recipe.cookTime} phút</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Danh sách sản phẩm</h3>
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">Hiển thị {filteredItems.length} sản phẩm</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tủ lạnh trống</h3>
              <p className="text-gray-500 mb-4">
                {fridgeItems.length === 0 
                  ? 'Hãy thêm sản phẩm vào tủ lạnh để bắt đầu quản lý.'
                  : 'Không tìm thấy sản phẩm phù hợp với bộ lọc.'
                }
              </p>
              <button
                onClick={handleAddProduct}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Thêm sản phẩm đầu tiên
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => {
                const expiryStatus = getExpiryStatus(item.expiryDate);
                const daysUntilExpiry = Math.ceil(
                  (new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getLocationIcon(item.location)}</span>
                        <div>
                          <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                          <p className="text-sm text-gray-500">{getLocationLabel(item.location)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditProduct(item)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(item.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Số lượng:</span>
                        <span className="font-medium">{item.stock} {item.unit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Danh mục:</span>
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Giá trị:</span>
                        <span className="font-medium">{formatPrice(item.price * item.stock)}</span>
                      </div>
                    </div>

                    {/* Expiry Status */}
                    <div className={`p-2 rounded-lg text-center ${expiryStatus.color}`}>
                      <div className="flex items-center justify-center space-x-1">
                        {expiryStatus.status === 'expired' && <ExclamationTriangleIcon className="h-4 w-4" />}
                        {expiryStatus.status === 'expiring' && <ClockIcon className="h-4 w-4" />}
                        <span className="text-sm font-medium">{expiryStatus.label}</span>
                      </div>
                      <p className="text-xs mt-1">
                        HSD: {new Date(item.expiryDate).toLocaleDateString('vi-VN')}
                        {daysUntilExpiry >= 0 && (
                          <span className="ml-1">({daysUntilExpiry} ngày)</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <AddProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={editingProduct}
      />
    </div>
  );
};

export default FridgeManager; 