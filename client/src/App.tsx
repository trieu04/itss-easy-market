import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { UIProvider } from './contexts/UIContext';

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import ShoppingListNew from './pages/ShoppingListNew';
import FoodStore from './pages/FoodStore';
import Recipes from './pages/Recipes';
import MealPlanner from './pages/MealPlanner';
import Statistics from './pages/Statistics';
import FridgeManager from './pages/FridgeManager';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

const AppContent: React.FC = () => {
  const { state: authState } = useAuthContext();

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            authState.isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Login />
          } 
        />
        <Route 
          path="/register" 
          element={
            authState.isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Register />
          } 
        />
        
        {/* Protected routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/fridge-manager" element={
          <ProtectedRoute>
            <Layout>
              <FridgeManager />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/food-store" element={
          <ProtectedRoute>
            <Layout>
              <FoodStore />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/shopping-list" element={
          <ProtectedRoute>
            <Layout>
              <ShoppingListNew />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/recipes" element={
          <ProtectedRoute>
            <Layout>
              <Recipes />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/meal-planner" element={
          <ProtectedRoute>
            <Layout>
              <MealPlanner />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/statistics" element={
          <ProtectedRoute>
            <Layout>
              <Statistics />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <AppContent />
      </UIProvider>
    </AuthProvider>
  );
}

export default App; 