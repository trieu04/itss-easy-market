import { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { mockProducts, mockRecipes, mockShoppingLists, mockMealPlans, mockExpenses } from '../data/mockData';
import { useAuthContext } from 'contexts/AuthContext';

export const useInitialData = () => {
  const { state, dispatch } = useAppContext();
  const { state: { user } } = useAuthContext();

  useEffect(() => {
    const isDemoUser = user && typeof user.name === 'string' && user.name.startsWith('demo');
    const hasData = state.products.length > 0 ||
      state.recipes.length > 0 ||
      state.shoppingLists.length > 0 ||
      state.mealPlans.length > 0 ||
      state.expenses.length > 0;

    // Chỉ load mock data nếu là người dùng demo và chưa có dữ liệu
    if (isDemoUser && !hasData) {
      dispatch({
        type: 'LOAD_DATA', payload: {
          products: mockProducts,
          recipes: mockRecipes,
          shoppingLists: mockShoppingLists,
          mealPlans: mockMealPlans,
          expenses: mockExpenses
        }
      });
    }
  }, [user, state, dispatch]);

  return {
    isLoaded: state.products.length > 0,
    loading: state.loading,
    error: state.error
  };
}; 