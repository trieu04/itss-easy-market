import { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { mockProducts, mockRecipes, mockShoppingLists, mockMealPlans, mockExpenses } from '../data/mockData';

export const useInitialData = () => {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    // Chỉ load mock data nếu chưa có dữ liệu trong localStorage
    const hasData = state.products.length > 0 || 
                   state.recipes.length > 0 || 
                   state.shoppingLists.length > 0;

    if (!hasData) {
      dispatch({ type: 'LOAD_DATA', payload: {
        products: mockProducts,
        recipes: mockRecipes,
        shoppingLists: mockShoppingLists,
        mealPlans: mockMealPlans,
        expenses: mockExpenses
      }});
    }
  }, [state.products.length, state.recipes.length, state.shoppingLists.length, dispatch]);

  return {
    isLoaded: state.products.length > 0,
    loading: state.loading,
    error: state.error
  };
}; 