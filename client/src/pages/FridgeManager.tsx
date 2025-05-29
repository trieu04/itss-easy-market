import React, { useState, useMemo, useEffect } from 'react';
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
import fridgeService, { FridgeItem, FridgeStats } from '../services/fridgeService';
import productService, { Product } from '../services/productService';
import recipeService, { Recipe } from '../services/recipeService';
import { AddProductModal } from '../components/modals/AddProductModal';

const FridgeManager: React.FC = () => {
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [stats, setStats] = useState<FridgeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<'all' | 'fridge' | 'freezer' | 'pantry'>('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [showExpiredOnly, setShowExpiredOnly] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [itemsData, productsData, recipesData, statsData] = await Promise.all([
        fridgeService.getFridgeItems(),
        productService.getProducts(),
        recipeService.getRecipes(),
        fridgeService.getFridgeStats()
      ]);

      setFridgeItems(itemsData);
      setProducts(productsData);
      setRecipes(recipesData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu tủ lạnh');
      // Fallback data
      setFridgeItems([]);
      setProducts([]);
      setRecipes([]);
      setStats({
        total: 0,
        expired: 0,
        expiringSoon: 0,
        fresh: 0,
        mostCommonCategory: 'N/A',
        lowStockItems: []
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi tủ lạnh?')) {
      try {
        await fridgeService.removeFridgeItem(productId);
        setFridgeItems(items => items.filter(item => item.id !== productId));
      } catch (err: any) {
        setError(err.message || 'Không thể xóa sản phẩm');
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
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
            onClick={loadData}
            className="ml-4 text-red-800 underline"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý tủ lạnh</h1>
        <button
          onClick={handleAddProduct}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm vào tủ lạnh
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FireIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Tổng cộng</p>
                <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Còn tốt</p>
                <p className="text-lg font-semibold text-gray-900">{stats.fresh}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Sắp hết hạn</p>
                <p className="text-lg font-semibold text-gray-900">{stats.expiringSoon}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Đã hết hạn</p>
                <p className="text-lg font-semibold text-gray-900">{stats.expired}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FunnelIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Phổ biến</p>
                <p className="text-sm font-semibold text-gray-900">{stats.mostCommonCategory}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showExpiredOnly}
                onChange={(e) => setShowExpiredOnly(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Chỉ hiển thị đã hết hạn</span>
            </label>
          </div>
          <div className="text-sm text-gray-500">
            Hiển thị {filteredItems.length} sản phẩm
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Danh sách sản phẩm</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredItems.length === 0 ? (
                <div className="p-8 text-center">
                  <FireIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Không có sản phẩm</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {showExpiredOnly ? 'Không có sản phẩm hết hạn' : 'Tủ lạnh của bạn đang trống'}
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const expiryStatus = getExpiryStatus(item.expiryDate);
                  
                  return (
                    <div key={item.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/48x48?text=No+Image';
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <span className="text-sm text-gray-500">
                                {getLocationIcon(item.location)} {getLocationLabel(item.location)}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                              <span>{item.category}</span>
                              <span>Số lượng: {item.quantity}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${expiryStatus.color}`}>
                                {expiryStatus.label}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">
                              Hết hạn: {new Date(item.expiryDate).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditProduct(item)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(item.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recipe Suggestions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Gợi ý công thức</h3>
            </div>
            <div className="p-4">
              {suggestedRecipes.length === 0 ? (
                <p className="text-gray-500 text-sm">Không có gợi ý phù hợp</p>
              ) : (
                <div className="space-y-3">
                  {suggestedRecipes.map((recipe) => (
                    <div key={recipe.id} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/48x48?text=Recipe';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm">{recipe.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{recipe.cookTime} phút • {recipe.servings} phần</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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