import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import shoppingListService, { ShoppingList as ApiShoppingList } from '../services/shoppingListService';

const ShoppingListPage: React.FC = () => {
  const [shoppingLists, setShoppingLists] = useState<ApiShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'in-progress' | 'completed'>('in-progress');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    loadShoppingLists();
  }, []);

  const loadShoppingLists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const lists = await shoppingListService.getShoppingLists();
      setShoppingLists(Array.isArray(lists) ? lists : []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách mua sắm');
      setShoppingLists([]);
    } finally {
      setLoading(false);
    }
  };

  const createNewList = async () => {
    if (!newListName.trim()) return;

    try {
      const newList = await shoppingListService.createShoppingList({
        name: newListName,
        items: [],
      });
      setShoppingLists([...shoppingLists, newList]);
      setNewListName('');
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message || 'Không thể tạo danh sách mới');
    }
  };

  const deleteList = async (id: string) => {
    try {
      await shoppingListService.deleteShoppingList(id);
      setShoppingLists(shoppingLists.filter(list => list.id !== id));
    } catch (err: any) {
      setError(err.message || 'Không thể xóa danh sách');
    }
  };

  const getListProgress = (list: ApiShoppingList): number => {
    const items = shoppingListService.parseItems(list.items);
    if (items.length === 0) return 0;
    const completedItems = items.filter(item => item.completed).length;
    return Math.round((completedItems / items.length) * 100);
  };

  const isListCompleted = (list: ApiShoppingList): boolean => {
    return getListProgress(list) === 100;
  };

  const filteredLists = Array.isArray(shoppingLists) ? shoppingLists.filter(list => {
    const matchesSearch = list.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'completed' ? isListCompleted(list) : !isListCompleted(list);
    return matchesSearch && matchesTab;
  }) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {error}
        <button 
          onClick={loadShoppingLists}
          className="ml-4 text-red-800 underline"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Danh Sách Mua Sắm</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Tạo danh sách mới
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm danh sách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('in-progress')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'in-progress'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Đang thực hiện ({Array.isArray(shoppingLists) ? shoppingLists.filter(list => !isListCompleted(list)).length : 0})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Hoàn thành ({Array.isArray(shoppingLists) ? shoppingLists.filter(list => isListCompleted(list)).length : 0})
            </button>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLists.map((list) => {
          const progress = getListProgress(list);
          const items = shoppingListService.parseItems(list.items);
          
          return (
            <div key={list.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{list.name}</h3>
                <button
                  onClick={() => deleteList(list.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Tiến độ</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                {items.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      readOnly
                      className="h-4 w-4 text-green-600 rounded"
                    />
                    <span className={`ml-2 text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {item.name}
                    </span>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-sm text-gray-500">+{items.length - 3} sản phẩm khác</p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Tạo: {new Date(list.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm ? 'Không tìm thấy danh sách nào' : 'Chưa có danh sách mua sắm nào'}
          </p>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tạo danh sách mới</h3>
            
            <input
              type="text"
              placeholder="Tên danh sách..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
              autoFocus
            />
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={createNewList}
                disabled={!newListName.trim()}
                className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListPage; 