import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useUIContext } from '../../contexts/UIContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state } = useUIContext();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div 
        className={`flex-1 transition-all duration-300 ${
          state.sidebarCollapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 