import React, { useState, useMemo } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { useAppContext, MealPlan, Recipe } from '../contexts/AppContext';

const MealPlanner: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { mealPlans, recipes } = state;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');

  // Lấy ngày đầu và cuối tháng
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startOfCalendar = new Date(startOfMonth);
  startOfCalendar.setDate(startOfCalendar.getDate() - startOfCalendar.getDay());

  // Tạo mảng các ngày trong calendar
  const calendarDays = useMemo(() => {
    const days = [];
    const current = new Date(startOfCalendar);
    
    for (let i = 0; i < 42; i++) { // 6 tuần × 7 ngày
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [startOfCalendar]);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getMealPlanForDate = (date: string) => {
    return mealPlans.find(plan => plan.date === date);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    const dateString = formatDate(date);
    setSelectedDate(dateString);
  };

  const handleAddMeal = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    setSelectedMealType(mealType);
    setShowRecipeModal(true);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    if (!selectedDate) return;

    const existingPlan = getMealPlanForDate(selectedDate);
    
    if (existingPlan) {
      // Cập nhật meal plan hiện có
      const updatedPlan = {
        ...existingPlan,
        [selectedMealType]: recipe
      };
      dispatch({ type: 'UPDATE_MEAL_PLAN', payload: updatedPlan });
    } else {
      // Tạo meal plan mới
      const newPlan: MealPlan = {
        id: Date.now().toString(),
        date: selectedDate,
        [selectedMealType]: recipe
      };
      dispatch({ type: 'ADD_MEAL_PLAN', payload: newPlan });
    }
    
    setShowRecipeModal(false);
  };

  const handleRemoveMeal = (date: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const plan = getMealPlanForDate(date);
    if (!plan) return;

    const updatedPlan = {
      ...plan,
      [mealType]: undefined
    };

    // Kiểm tra nếu tất cả bữa ăn đều bị xóa thì xóa cả plan
    if (!updatedPlan.breakfast && !updatedPlan.lunch && !updatedPlan.dinner) {
      dispatch({ type: 'DELETE_MEAL_PLAN', payload: plan.id });
    } else {
      dispatch({ type: 'UPDATE_MEAL_PLAN', payload: updatedPlan });
    }
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const today = new Date();
  const todayString = formatDate(today);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lập kế hoạch bữa ăn</h1>
        <div className="text-sm text-gray-500">
          Nhấp vào ngày để lập kế hoạch bữa ăn
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          <h2 className="text-lg font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const dateString = formatDate(date);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isToday = dateString === todayString;
              const isSelected = dateString === selectedDate;
              const mealPlan = getMealPlanForDate(dateString);
              
              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={`
                    min-h-[100px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50
                    ${!isCurrentMonth ? 'text-gray-300 bg-gray-50' : ''}
                    ${isToday ? 'bg-green-50 border-green-300' : ''}
                    ${isSelected ? 'ring-2 ring-green-500' : ''}
                  `}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-green-600' : ''}`}>
                    {date.getDate()}
                  </div>
                  
                  {isCurrentMonth && mealPlan && (
                    <div className="space-y-1">
                      {mealPlan.breakfast && (
                        <div className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded truncate">
                          🌅 {mealPlan.breakfast.name}
                        </div>
                      )}
                      {mealPlan.lunch && (
                        <div className="text-xs bg-orange-100 text-orange-800 px-1 py-0.5 rounded truncate">
                          ☀️ {mealPlan.lunch.name}
                        </div>
                      )}
                      {mealPlan.dinner && (
                        <div className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate">
                          🌙 {mealPlan.dinner.name}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Date Detail */}
      {selectedDate && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Kế hoạch cho ngày {new Date(selectedDate + 'T00:00:00').toLocaleDateString('vi-VN')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Breakfast */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">🌅 Bữa sáng</h4>
                <button
                  onClick={() => handleAddMeal('breakfast')}
                  className="p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              
              {getMealPlanForDate(selectedDate)?.breakfast ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-yellow-900">
                        {getMealPlanForDate(selectedDate)?.breakfast?.name}
                      </h5>
                      <p className="text-sm text-yellow-700 mt-1">
                        {getMealPlanForDate(selectedDate)?.breakfast?.cookTime} phút • {getMealPlanForDate(selectedDate)?.breakfast?.servings} phần
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveMeal(selectedDate, 'breakfast')}
                      className="p-1 text-yellow-600 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                  Chưa có kế hoạch
                </div>
              )}
            </div>

            {/* Lunch */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">☀️ Bữa trưa</h4>
                <button
                  onClick={() => handleAddMeal('lunch')}
                  className="p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              
              {getMealPlanForDate(selectedDate)?.lunch ? (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-orange-900">
                        {getMealPlanForDate(selectedDate)?.lunch?.name}
                      </h5>
                      <p className="text-sm text-orange-700 mt-1">
                        {getMealPlanForDate(selectedDate)?.lunch?.cookTime} phút • {getMealPlanForDate(selectedDate)?.lunch?.servings} phần
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveMeal(selectedDate, 'lunch')}
                      className="p-1 text-orange-600 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                  Chưa có kế hoạch
                </div>
              )}
            </div>

            {/* Dinner */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">🌙 Bữa tối</h4>
                <button
                  onClick={() => handleAddMeal('dinner')}
                  className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              
              {getMealPlanForDate(selectedDate)?.dinner ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-blue-900">
                        {getMealPlanForDate(selectedDate)?.dinner?.name}
                      </h5>
                      <p className="text-sm text-blue-700 mt-1">
                        {getMealPlanForDate(selectedDate)?.dinner?.cookTime} phút • {getMealPlanForDate(selectedDate)?.dinner?.servings} phần
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveMeal(selectedDate, 'dinner')}
                      className="p-1 text-blue-600 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                  Chưa có kế hoạch
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recipe Selection Modal */}
      {showRecipeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50" onClick={() => setShowRecipeModal(false)}>
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="w-full max-w-2xl bg-white rounded-2xl shadow-xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Chọn công thức cho {selectedMealType === 'breakfast' ? 'bữa sáng' : selectedMealType === 'lunch' ? 'bữa trưa' : 'bữa tối'}
                  </h3>
                  <button
                    onClick={() => setShowRecipeModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                {recipes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Chưa có công thức nào. Hãy thêm công thức từ trang Công thức nấu ăn.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recipes.map((recipe) => (
                      <div
                        key={recipe.id}
                        onClick={() => handleSelectRecipe(recipe)}
                        className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-green-300 hover:bg-green-50 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/64x64?text=No+Image';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{recipe.name}</h4>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{recipe.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                              <span>⏱️ {recipe.cookTime} phút</span>
                              <span>👥 {recipe.servings} phần</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner; 