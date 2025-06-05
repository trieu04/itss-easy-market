import React, { useMemo } from 'react';
import { 
  ShoppingBagIcon,
  ClockIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const { products, shoppingLists, expenses, mealPlans, recipes } = state;

  // Thống kê tổng quan
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock <= 10).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    
    const activeShoppingLists = shoppingLists.filter(list => !list.completed).length;
    const completedShoppingLists = shoppingLists.filter(list => list.completed).length;
    
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthlyExpenses = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    const totalRecipes = recipes.length;
    
    const today = new Date().toISOString().split('T')[0];
    const todayMealPlan = mealPlans.find(plan => plan.date === today);
    const todayMealsPlanned = todayMealPlan ? 
      [todayMealPlan.breakfast, todayMealPlan.lunch, todayMealPlan.dinner].filter(Boolean).length : 0;

    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      activeShoppingLists,
      completedShoppingLists,
      monthlyExpenses,
      totalRecipes,
      todayMealsPlanned
    };
  }, [products, shoppingLists, expenses, recipes, mealPlans]);

  // Sản phẩm sắp hết hạn (giả lập - sắp hết stock)
  const expiringSoonProducts = useMemo(() => {
    return products
      .filter(p => p.stock <= 10 && p.stock > 0)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);
  }, [products]);

  // Chi tiêu gần đây
  const recentExpenses = useMemo(() => {
    return expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses]);

  // Danh sách mua sắm đang hoạt động
  const activeShoppingListsData = useMemo(() => {
    return shoppingLists.filter(list => !list.completed).slice(0, 3);
  }, [shoppingLists]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Mock chuyển đổi products sang dạng có expiryDate/location
  const fridgeItems = useMemo(() => {
    return products.map(product => {
      const addedDaysAgo = Math.floor(Math.random() * 14);
      const expiryDaysFromNow = Math.floor(Math.random() * 30) - 10;
      const addedDate = new Date();
      addedDate.setDate(addedDate.getDate() - addedDaysAgo);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDaysFromNow);
      const locations = ['fridge', 'freezer', 'pantry'];
      const location = locations[Math.floor(Math.random() * locations.length)];
      return {
        ...product,
        location,
        expiryDate: expiryDate.toISOString().split('T')[0],
        addedDate: addedDate.toISOString().split('T')[0]
      };
    });
  }, [products]);

  const today = new Date().toISOString().split('T')[0];
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  const threeDaysString = threeDaysFromNow.toISOString().split('T')[0];

  const expiredItems = fridgeItems.filter(item => item.expiryDate < today);
  const expiringSoonItems = fridgeItems.filter(item => item.expiryDate >= today && item.expiryDate <= threeDaysString);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan tủ lạnh</h1>
        <div className="text-sm text-gray-500">
          Cập nhật lúc {new Date().toLocaleString('vi-VN')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Tổng sản phẩm */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng thực phẩm</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
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
              <p className="text-sm font-medium text-gray-500">DS mua sắm</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeShoppingLists}</p>
            </div>
          </div>
        </div>

        {/* Chi tiêu tháng */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <ChartBarIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Chi tiêu tháng</p>
              <p className="text-lg font-semibold text-gray-900">{formatPrice(stats.monthlyExpenses)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sản phẩm sắp hết */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
              Thực phẩm hết hạn / sắp hết hạn
            </h3>
          </div>
          <div className="p-4">
            {/* Sản phẩm đã hết hạn */}
            {expiredItems.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-red-700 mb-2">Đã hết hạn ({expiredItems.length})</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {expiredItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <span className="font-medium text-red-900">{item.name}</span>
                        <span className="ml-2 text-xs text-gray-500">{item.category}</span>
                        <span className="ml-2 text-xs text-gray-400">{item.location === 'fridge' ? '🧊' : item.location === 'freezer' ? '❄️' : '🗄️'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-red-700 font-semibold block">Hết hạn</span>
                        <span className="text-xs text-gray-500 block">HSD: {new Date(item.expiryDate).toLocaleDateString('vi-VN')}</span>
                        <span className="text-xs text-gray-500 block">SL: {item.stock}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sản phẩm sắp hết hạn */}
            {expiringSoonItems.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-yellow-700 mb-2">Sắp hết hạn ({expiringSoonItems.length})</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {expiringSoonItems.map(item => {
                    const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div>
                          <span className="font-medium text-yellow-900">{item.name}</span>
                          <span className="ml-2 text-xs text-gray-500">{item.category}</span>
                          <span className="ml-2 text-xs text-gray-400">{item.location === 'fridge' ? '🧊' : item.location === 'freezer' ? '❄️' : '🗄️'}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-yellow-700 font-semibold block">Còn {daysLeft} ngày</span>
                          <span className="text-xs text-gray-500 block">HSD: {new Date(item.expiryDate).toLocaleDateString('vi-VN')}</span>
                          <span className="text-xs text-gray-500 block">SL: {item.stock}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nếu không có sản phẩm nào hết/sắp hết hạn */}
            {expiredItems.length === 0 && expiringSoonItems.length === 0 && (
              <p className="text-gray-500 text-center py-4">Tất cả sản phẩm đều còn hạn</p>
            )}
          </div>
        </div>

        {/* Danh sách mua sắm hoạt động */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ShoppingBagIcon className="h-5 w-5 text-green-500 mr-2" />
              Danh sách mua sắm
            </h3>
          </div>
          <div className="p-4">
            {activeShoppingListsData.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Không có danh sách nào đang hoạt động</p>
            ) : (
              <div className="space-y-3">
                {activeShoppingListsData.map((list) => {
                  const completedItems = list.items.filter(item => item.completed).length;
                  const totalItems = list.items.length;
                  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
                  
                  return (
                    <div key={list.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{list.name}</h4>
                        <span className="text-xs text-gray-500">
                          {completedItems}/{totalItems}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(list.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chi tiêu gần đây */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
              Chi tiêu gần đây
            </h3>
          </div>
          <div className="p-4">
            {recentExpenses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Chưa có chi tiêu nào</p>
            ) : (
              <div className="space-y-3">
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{expense.category}</h4>
                      <p className="text-sm text-gray-500">{expense.description}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(expense.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(expense.amount)}</p>
                      <p className="text-xs text-gray-500">{expense.items.length} mặt hàng</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kế hoạch bữa ăn hôm nay */}
      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FireIcon className="h-5 w-5 text-orange-500 mr-2" />
            Kế hoạch bữa ăn hôm nay
          </h3>
        </div>
        <div className="p-4">
          {stats.todayMealsPlanned === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">Chưa có kế hoạch bữa ăn cho hôm nay</p>
              <p className="text-sm text-gray-400">Hãy lập kế hoạch trong trang Lập kế hoạch bữa ăn</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(() => {
                const today = new Date().toISOString().split('T')[0];
                const todayPlan = mealPlans.find(plan => plan.date === today);
                
                return (
                  <>
                    {/* Bữa sáng */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">🌅 Bữa sáng</h4>
                      {todayPlan?.breakfast ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <h5 className="font-medium text-yellow-900">{todayPlan.breakfast.name}</h5>
                          <p className="text-sm text-yellow-700">
                            {todayPlan.breakfast.cookTime} phút • {todayPlan.breakfast.servings} phần
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Chưa có kế hoạch</p>
                      )}
                    </div>

                    {/* Bữa trưa */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">☀️ Bữa trưa</h4>
                      {todayPlan?.lunch ? (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <h5 className="font-medium text-orange-900">{todayPlan.lunch.name}</h5>
                          <p className="text-sm text-orange-700">
                            {todayPlan.lunch.cookTime} phút • {todayPlan.lunch.servings} phần
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Chưa có kế hoạch</p>
                      )}
                    </div>

                    {/* Bữa tối */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">🌙 Bữa tối</h4>
                      {todayPlan?.dinner ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <h5 className="font-medium text-blue-900">{todayPlan.dinner.name}</h5>
                          <p className="text-sm text-blue-700">
                            {todayPlan.dinner.cookTime} phút • {todayPlan.dinner.servings} phần
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Chưa có kế hoạch</p>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
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