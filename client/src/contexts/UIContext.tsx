import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface UIState {
  sidebarCollapsed: boolean;
}

interface UIContextType {
  state: UIState;
  toggleSidebar: () => void;
}

const initialState: UIState = {
  sidebarCollapsed: false,
};

type UIAction = 
  | { type: 'TOGGLE_SIDEBAR' };

const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    default:
      return state;
  }
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  return (
    <UIContext.Provider value={{ state, toggleSidebar }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUIContext = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  return context;
}; 