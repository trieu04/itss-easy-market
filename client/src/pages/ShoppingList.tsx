import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { shoppingListService } from '../services/shoppingListService';
import type { ShoppingList as APIShoppingList } from '../services/shoppingListService';
import type { ShoppingList as AppShoppingList } from '../contexts/AppContext';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon,
  CheckCircleIcon,
  ClockIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { AddShoppingListModal } from '../components/modals/AddShoppingListModal';
import { ShoppingList as ShoppingListType, ShoppingItem } from '../contexts/AppContext';

// Function để convert API format sang App format
const convertAPIToAppFormat = (apiList: APIShoppingList): AppShoppingList => {
  const items = shoppingListService.parseItems(apiList.items);
  return {
    id: apiList.id,
    name: apiList.name,
    date: apiList.createdAt,
    completed: items.every(item => item.completed),
    items: items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity || 1,
      unit: 'cái', // default unit
      category: item.category || 'Khác',
      completed: item.completed,
      priority: 'medium' as const
    }))
  };
};

const ShoppingList: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { shoppingLists } = state;

  const [activeTab, setActiveTab] = useState('active');
  const [showModal, setShowModal] = useState(false);
  const [editingList, setEditingList] = useState<ShoppingListType | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadShoppingLists();
  }, []);

  const loadShoppingLists = async () => {
    try {
      setLoading(true);
      const apiLists = await shoppingListService.getShoppingLists();
      const appLists = apiLists.map(convertAPIToAppFormat);
      dispatch({ type: 'SET_SHOPPING_LISTS', payload: appLists });
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách mua sắm');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = (listId: string, item: ShoppingItem) => {
    const updatedItem = { ...item, completed: !item.completed };
    dispatch({
      type: 'UPDATE_SHOPPING_ITEM',
      payload: { listId, item: updatedItem }
    });

    // Kiểm tra xem tất cả items đã completed chưa
    const list = shoppingLists.find(l => l.id === listId);
    if (list) {
      const allCompleted = list.items.every(i => 
        i.id === item.id ? !item.completed : i.completed
      );
      
      if (allCompleted && list.items.length > 0) {
        dispatch({
          type: 'UPDATE_SHOPPING_LIST',
          payload: { ...list, completed: true }
        });
      }
    }
  };

  const handleDeleteList = (listId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh sách này?')) {
      dispatch({ type: 'DELETE_SHOPPING_LIST', payload: listId });
    }
  };

  const handleEditList = (list: ShoppingListType) => {
    setEditingList(list);
    setShowModal(true);
  };

  const handleAddNewList = () => {
    setEditingList(undefined);
    setShowModal(true);
  };

  const handleDeleteItem = (listId: string, itemId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      dispatch({
        type: 'DELETE_SHOPPING_ITEM',
        payload: { listId, itemId }
      });
    }
  };

  const getProgressPercentage = (items: ShoppingItem[]) => {
    if (items.length === 0) return 0;
    const completedItems = items.filter(item => item.completed).length;
    return Math.round((completedItems / items.length) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return 'Trung bình';
    }
  };

  const filteredLists = shoppingLists.filter(list => {
    const matchesSearch = list.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'completed' ? list.completed : !list.completed;
    return matchesSearch && matchesTab;
  });

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
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Tạo danh sách mới
        </button>
      </div>

      {/* Search Bar */}
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

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'active'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ClockIcon className="h-5 w-5 inline mr-2" />
            Đang thực hiện ({shoppingLists.filter(l => !l.completed).length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CheckCircleIcon className="h-5 w-5 inline mr-2" />
            Đã hoàn thành ({shoppingLists.filter(l => l.completed).length})
          </button>
        </nav>
      </div>

      {/* Shopping Lists */}
      <div className="space-y-6">
        {filteredLists.map((list) => {
          const progress = getProgressPercentage(list.items);
          const completedItems = list.items.filter(item => item.completed).length;

          return (
            <div key={list.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* List Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {list.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Ngày: {new Date(list.date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    
                    {/* Progress */}
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {completedItems}/{list.items.length}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditList(list)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteList(list.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="p-6">
                {list.items.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p>Danh sách trống</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {list.items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center space-x-4 p-3 rounded-lg border transition-all duration-200 ${
                          item.completed
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleItem(list.id, item)}
                          className="flex-shrink-0"
                        >
                          {item.completed ? (
                            <CheckCircleSolidIcon className="h-6 w-6 text-green-600" />
                          ) : (
                            <div className="h-6 w-6 border-2 border-gray-300 rounded-full hover:border-green-500"></div>
                          )}
                        </button>

                        {/* Item Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <h4
                              className={`font-medium ${
                                item.completed
                                  ? 'text-green-700 line-through'
                                  : 'text-gray-900'
                              }`}
                            >
                              {item.name}
                            </h4>
                            
                            {/* Priority Badge */}
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                                item.priority
                              )}`}
                            >
                              {getPriorityLabel(item.priority)}
                            </span>

                            {/* Category */}
                            {item.category && (
                              <span className="inline-flex px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">
                                {item.category}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-500 mt-1">
                            Số lượng: {item.quantity} {item.unit}
                          </p>
                        </div>

                        {/* Delete Item */}
                        <button
                          onClick={() => handleDeleteItem(list.id, item.id)}
                          className="flex-shrink-0 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredLists.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {activeTab === 'active' ? 'Chưa có danh sách nào' : 'Chưa hoàn thành danh sách nào'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === 'active'
              ? 'Tạo danh sách mua sắm đầu tiên của bạn.'
              : 'Hoàn thành một danh sách để xem ở đây.'
            }
          </p>
          {activeTab === 'active' && (
            <div className="mt-6">
              <button
                onClick={handleAddNewList}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Tạo danh sách mới
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit List Modal */}
      <AddShoppingListModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        shoppingList={editingList}
      />
    </div>
  );
};

export default ShoppingList; 