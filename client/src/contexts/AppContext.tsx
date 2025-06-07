import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import httpClient from '../services/httpClient';
import { mockUsers } from 'data/mockData';

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


export interface User {
  id: string; 
  name: string; 
  email: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  image: string;
  ownerId: string; // user_id
  members: string[]; // user_id
  fridgeId: string; //  tủ lạnh của group
}

export interface FridgeItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expirationTime: string; // ISO date string
  storeLocation: string;
  image?: string; // Optional image URL
}

export interface Fridge {
  id: string;
  fridgeItems: FridgeItem[];
  lastUpdated: string; // ISO date string
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
  groupId: string; // ShoppingList của group....
  name: string;
  date: string;
  shoppingItems: ShoppingItem[];
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
  fridgeItems: FridgeItem[];
  shoppingItems: ShoppingItem[];
  shoppingLists: ShoppingList[];
  fridges: Fridge[];
  groups: Group[];
  users: User[];
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
  | { type: 'LOAD_DATA'; payload: Partial<AppState> }
  | { type: 'ADD_GROUP'; payload: { group: Group; fridge: Fridge } }
  | { type: 'DELETE_GROUP'; payload: { id: string; currentUserId: string } }
  | { type: 'ADD_MEMBER_GROUP'; payload: { groupId: string; email: string; currentUserId: string } }
  | { type: 'DELETE_MEMBER_GROUP'; payload: { groupId: string; email: string; currentUserId: string } }
  | { type: 'ADD_FRIDGE_ITEM'; payload: { fridgeId: string; item: FridgeItem } }
  | { type: 'DELETE_FRIDGE_ITEM'; payload: { fridgeId: string; itemId: string } };

const initialState: AppState = {
  products: [],
  shoppingLists: [],
  fridgeItems: [],
  fridges: [],
  shoppingItems: [],
  groups: [],
  users: [
    ...mockUsers,
  ],
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
            ? { ...list, items: [...list.shoppingItems, action.payload.item] }
            : list
        ),
      };

    case 'ADD_SHOPPING_ITEM':
      return {
        ...state,
        shoppingLists: state.shoppingLists.map(list =>
          list.id === action.payload.listId
            ? { ...list, items: [...list.shoppingItems, action.payload.item] }
            : list
        ),
        shoppingItems: [...state.shoppingItems, action.payload.item], // Cập nhật shoppingItems
      };

    case 'UPDATE_SHOPPING_ITEM':
      return {
        ...state,
        shoppingLists: state.shoppingLists.map(list =>
          list.id === action.payload.listId
            ? {
              ...list,
              items: list.shoppingItems.map(item =>
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
              items: list.shoppingItems.filter(item => item.id !== action.payload.itemId),
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

    case 'ADD_GROUP':
     return {
       ...state,
       groups: [...state.groups, {
         ...action.payload.group,
         members: action.payload.group.members || [action.payload.group.ownerId]
       }],
       fridges: [...state.fridges, action.payload.fridge],
     };

    case 'DELETE_GROUP': {
      const group = state.groups.find(g => g.id === action.payload.id);
      if (!group) {
        return { ...state, error: 'Nhóm không tồn tại' };
      }
      if (group.ownerId !== action.payload.currentUserId) {
        return { ...state, error: 'Chỉ owner mới có quyền xóa nhóm' };
      }
      return {
        ...state,
        groups: state.groups.filter(g => g.id !== action.payload.id),
        fridges: state.fridges.filter(f => f.id !== group.fridgeId),
        fridgeItems: state.fridgeItems.filter(item => !state.fridges.find(f => f.id === group.fridgeId)?.fridgeItems.includes(item)),
      };
    }

    case 'ADD_MEMBER_GROUP': {
      const { groupId, email, currentUserId } = action.payload;
      const targetGroup = state.groups.find(group => group.id === groupId);
      if (!targetGroup) {
        return { ...state, error: 'Nhóm không tồn tại' };
      }
      if (targetGroup.ownerId !== currentUserId) {
        return { ...state, error: 'Chỉ owner mới có quyền thêm thành viên' };
      }
      const targetUser = state.users.find(user => user.email === email);
      if (!targetUser) {
        return { ...state, error: 'Không tìm thấy người dùng với email này' };
      }
      if (targetGroup.members.includes(targetUser.id)) {
        return { ...state, error: 'Người dùng đã là thành viên của nhóm' };
      }
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === groupId
            ? { ...group, members: [...group.members, targetUser.id] }
            : group
        ),
        error: null,
      };
    }

    case 'DELETE_MEMBER_GROUP': {
      const { groupId, email, currentUserId } = action.payload;
      const targetGroup = state.groups.find(group => group.id === groupId);
      if (!targetGroup) {
        return { ...state, error: 'Nhóm không tồn tại' };
      }
      if (targetGroup.ownerId !== currentUserId) {
        return { ...state, error: 'Chỉ owner mới có quyền xóa thành viên' };
      }
      const targetUser = state.users.find(user => user.email === email);
      if (!targetUser) {
        return { ...state, error: 'Không tìm thấy người dùng với email này' };
      }
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === groupId
            ? { ...group, members: group.members.filter(id => id !== targetUser.id) }
            : group
        ),
        error: null,
      };
    }

    case 'ADD_FRIDGE_ITEM':
      return {
        ...state,
        fridges: state.fridges.map(fridge =>
          fridge.id === action.payload.fridgeId
            ? { ...fridge, items: [...fridge.fridgeItems, action.payload.item] }
            : fridge
        ),
        fridgeItems: [...state.fridgeItems, action.payload.item],
      };

    case 'DELETE_FRIDGE_ITEM':
      return {
        ...state,
        fridges: state.fridges.map(fridge =>
          fridge.id === action.payload.fridgeId
            ? { ...fridge, items: fridge.fridgeItems.filter(item => item.id !== action.payload.itemId) }
            : fridge
        ),
        fridgeItems: state.fridgeItems.filter(item => item.id !== action.payload.itemId),
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

  // This ref helps to identify if the initial data loading (from server/localStorage)
  // has completed. It's used to prevent the data synchronization effect from
  // running during the initial data population phase.
  const initialLoadEffectRan = useRef(false);

  // Load data from server and/or localStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      let dataToLoad: Partial<AppState> | null = null;
      let serverFetchError: string | null = null;

      try {
        console.log('Attempting to load data from server...');
        const data = await httpClient.get<{data: Partial<AppState>}>("/user-data");
        if (data) {
          dataToLoad = data.data;
          localStorage.setItem('smartMealData', JSON.stringify(dataToLoad));
          console.log('Data loaded from server and saved to localStorage.');
          dispatch({ type: 'SET_ERROR', payload: null });
        } else {
          console.log('No data returned from server or server data was empty.');
        }
      } catch (error: any) {
        console.error('Error loading data from server:', error);
        serverFetchError = error.message || 'Failed to load data from server. Will try local storage.';
      }

      if (!dataToLoad) {
        console.log('Attempting to load data from localStorage...');
        try {
          const savedData = localStorage.getItem('smartMealData');
          if (savedData) {
            dataToLoad = JSON.parse(savedData) as Partial<AppState>;
            console.log('Data loaded from localStorage.');
            if (!serverFetchError) {
              dispatch({ type: 'SET_ERROR', payload: null });
            }
          } else {
            console.log('No data found in localStorage.');
            if (!serverFetchError) dispatch({ type: 'SET_ERROR', payload: null });
          }
        } catch (localError: any) {
          console.error('Error loading data from localStorage:', localError);
          let combinedError = 'Failed to load data from localStorage.';
          if (serverFetchError) {
            combinedError = `${serverFetchError} Additionally, ${combinedError.toLowerCase()}`;
          }
          dispatch({ type: 'SET_ERROR', payload: combinedError });
        }
      }

      if (dataToLoad) {
        dispatch({ type: 'LOAD_DATA', payload: dataToLoad });
      } else {
        console.log('No data available from server or localStorage. Using initial state.');
      }

      dispatch({ type: 'SET_LOADING', payload: false });
      initialLoadEffectRan.current = true;
    };

    loadData();
  }, [dispatch]);

  // Save data to localStorage and synchronize with server when relevant state parts change.
  useEffect(() => {
    if (!initialLoadEffectRan.current || state.loading) {
      return;
    }

    const dataToSave = {
      products: state.products,
      shoppingLists: state.shoppingLists,
      recipes: state.recipes,
      mealPlans: state.mealPlans,
      expenses: state.expenses,
      cart: state.cart,
      favorites: state.favorites,
      groups: state.groups,
      users: state.users,
    };

    try {
      localStorage.setItem('smartMealData', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }

    const syncData = async () => {
      try {
        await httpClient.post<void>("/user-data", dataToSave);
        console.log('Data successfully synced with server.');
        if (state.error?.startsWith('Failed to sync data')) {
          dispatch({ type: 'SET_ERROR', payload: null });
        }
      } catch (error: any) {
        console.error('Error syncing data to server:', error);
        const errorMessage = error.message || 'Failed to sync data with server. Data remains saved locally.';
        // dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
    };

    syncData();
  }, [
    state.products,
    state.shoppingLists,
    state.fridgeItems,
    state.shoppingItems,
    state.recipes,
    state.mealPlans,
    state.expenses,
    state.cart,
    state.favorites,
    state.error,
    state.groups,
    state.users,
    dispatch
  ]);

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