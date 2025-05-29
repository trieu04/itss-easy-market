import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  originalPrice?: number;
  price: number;
  unit: string;
  image: string;
  discount?: number;
  rating: number;
  stock: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface ShoppingList {
  id: string;
  name: string;
  date: string;
  items: ShoppingItem[];
  completed: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cookTime: number;
  servings: number;
  image: string;
  tags: string[];
  ingredients: { name: string; amount: string; unit: string }[];
  instructions: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface MealPlan {
  id: string;
  date: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  amount: number;
  category: string;
  items: string[];
  description?: string;
}

interface AppState {
  products: Product[];
  shoppingLists: ShoppingList[];
  recipes: Recipe[];
  mealPlans: MealPlan[];
  expenses: ExpenseRecord[];
  cart: { productId: string; quantity: number }[];
  favorites: string[];
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_SHOPPING_LISTS'; payload: ShoppingList[] }
  | { type: 'ADD_SHOPPING_LIST'; payload: ShoppingList }
  | { type: 'UPDATE_SHOPPING_LIST'; payload: ShoppingList }
  | { type: 'DELETE_SHOPPING_LIST'; payload: string }
  | { type: 'ADD_SHOPPING_ITEM'; payload: { listId: string; item: ShoppingItem } }
  | { type: 'UPDATE_SHOPPING_ITEM'; payload: { listId: string; item: ShoppingItem } }
  | { type: 'DELETE_SHOPPING_ITEM'; payload: { listId: string; itemId: string } }
  | { type: 'ADD_RECIPE'; payload: Recipe }
  | { type: 'UPDATE_RECIPE'; payload: Recipe }
  | { type: 'DELETE_RECIPE'; payload: string }
  | { type: 'ADD_MEAL_PLAN'; payload: MealPlan }
  | { type: 'UPDATE_MEAL_PLAN'; payload: MealPlan }
  | { type: 'DELETE_MEAL_PLAN'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: ExpenseRecord }
  | { type: 'UPDATE_EXPENSE'; payload: ExpenseRecord }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'ADD_TO_CART'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> };

const initialState: AppState = {
  products: [],
  shoppingLists: [],
  recipes: [],
  mealPlans: [],
  expenses: [],
  cart: [],
  favorites: [],
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };
    
    case 'SET_SHOPPING_LISTS':
      return { ...state, shoppingLists: action.payload };
    
    case 'ADD_SHOPPING_LIST':
      return { ...state, shoppingLists: [...state.shoppingLists, action.payload] };
    
    case 'UPDATE_SHOPPING_LIST':
      return {
        ...state,
        shoppingLists: state.shoppingLists.map(list =>
          list.id === action.payload.id ? action.payload : list
        ),
      };
    
    case 'DELETE_SHOPPING_LIST':
      return {
        ...state,
        shoppingLists: state.shoppingLists.filter(list => list.id !== action.payload),
      };
    
    case 'ADD_SHOPPING_ITEM':
      return {
        ...state,
        shoppingLists: state.shoppingLists.map(list =>
          list.id === action.payload.listId
            ? { ...list, items: [...list.items, action.payload.item] }
            : list
        ),
      };
    
    case 'UPDATE_SHOPPING_ITEM':
      return {
        ...state,
        shoppingLists: state.shoppingLists.map(list =>
          list.id === action.payload.listId
            ? {
                ...list,
                items: list.items.map(item =>
                  item.id === action.payload.item.id ? action.payload.item : item
                ),
              }
            : list
        ),
      };
    
    case 'DELETE_SHOPPING_ITEM':
      return {
        ...state,
        shoppingLists: state.shoppingLists.map(list =>
          list.id === action.payload.listId
            ? {
                ...list,
                items: list.items.filter(item => item.id !== action.payload.itemId),
              }
            : list
        ),
      };
    
    case 'ADD_RECIPE':
      return { ...state, recipes: [...state.recipes, action.payload] };
    
    case 'UPDATE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe.id === action.payload.id ? action.payload : recipe
        ),
      };
    
    case 'DELETE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.filter(recipe => recipe.id !== action.payload),
      };
    
    case 'ADD_MEAL_PLAN':
      return { ...state, mealPlans: [...state.mealPlans, action.payload] };
    
    case 'UPDATE_MEAL_PLAN':
      return {
        ...state,
        mealPlans: state.mealPlans.map(plan =>
          plan.id === action.payload.id ? action.payload : plan
        ),
      };
    
    case 'DELETE_MEAL_PLAN':
      return {
        ...state,
        mealPlans: state.mealPlans.filter(plan => plan.id !== action.payload),
      };
    
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload),
      };
    
    case 'ADD_TO_CART':
      const existingCartItem = state.cart.find(item => item.productId === action.payload.productId);
      if (existingCartItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.productId !== action.payload),
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'TOGGLE_FAVORITE':
      const isFavorite = state.favorites.includes(action.payload);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload],
      };
    
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('smartMealData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    try {
      const dataToSave = {
        products: state.products,
        shoppingLists: state.shoppingLists,
        recipes: state.recipes,
        mealPlans: state.mealPlans,
        expenses: state.expenses,
        cart: state.cart,
        favorites: state.favorites,
      };
      localStorage.setItem('smartMealData', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 