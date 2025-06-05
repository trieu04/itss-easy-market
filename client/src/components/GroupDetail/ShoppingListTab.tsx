import React, { useMemo } from 'react';
import {
  ListBulletIcon,
  FunnelIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface ShoppingList {
  id: string;
  name: string;
  date: string;
  items: ShoppingItem[];
  completed: boolean;
}

interface ShoppingListTabProps {
  shoppingLists: ShoppingList[];
  setShoppingLists: (lists: ShoppingList[]) => void;
  shoppingFilter: 'all' | 'completed' | 'pending';
  setShoppingFilter: (filter: 'all' | 'completed' | 'pending') => void;
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
  setPriorityFilter: (filter: 'all' | 'low' | 'medium' | 'high') => void;
}

export const ShoppingListTab: React.FC<ShoppingListTabProps> = ({
  shoppingLists,
  setShoppingLists,
  shoppingFilter,
  setShoppingFilter,
  priorityFilter,
  setPriorityFilter,
}) => {
  const handleToggleShoppingItem = (listId: string, itemId: string) => {
    setShoppingLists(
      shoppingLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            }
          : list
      )
    );
  };

  const filteredShoppingItems = useMemo(() => {
    let allItems = shoppingLists.flatMap((list) => list.items);

    if (shoppingFilter === 'completed') {
      allItems = allItems.filter((item) => item.completed);
    } else if (shoppingFilter === 'pending') {
      allItems = allItems.filter((item) => !item.completed);
    }

    if (priorityFilter !== 'all') {
      allItems = allItems.filter((item) => item.priority === priorityFilter);
    }

    return allItems;
  }, [shoppingLists, shoppingFilter, priorityFilter]);

  const getPriorityIcon = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Danh sách mua hàng ({shoppingLists.length})
        </h3>
        <button
          onClick={() => {
            const listName = prompt('Nhập tên danh sách mua hàng:');
            if (listName) {
              alert(`Đã tạo danh sách: ${listName}`);
            }
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm danh sách mua
        </button>
      </div>

      {/* Filters cho shopping list */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Lọc theo:</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setShoppingFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                shoppingFilter === 'all' ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setShoppingFilter('pending')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                shoppingFilter === 'pending' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Chưa mua
            </button>
            <button
              onClick={() => setShoppingFilter('completed')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                shoppingFilter === 'completed' ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Đã mua
            </button>
          </div>

          <div className="flex space-x-2">
            <span className="text-sm text-gray-500">Độ ưu tiên:</span>
            <button
              onClick={() => setPriorityFilter('all')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                priorityFilter === 'all' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setPriorityFilter('high')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                priorityFilter === 'high' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              Cao
            </button>
            <button
              onClick={() => setPriorityFilter('medium')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                priorityFilter === 'medium' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              Trung bình
            </button>
            <button
              onClick={() => setPriorityFilter('low')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                priorityFilter === 'low' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              Thấp
            </button>
          </div>
        </div>
      </div>

      {/* Shopping Lists */}
      <div className="space-y-6">
        {shoppingLists.map((list) => (
          <div key={list.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{list.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(list.date).toLocaleDateString('vi-VN')} • {list.items.length} mặt hàng
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  list.completed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                }`}
              >
                {list.completed ? 'Hoàn thành' : 'Đang thực hiện'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.items
                .filter((item) => {
                  if (shoppingFilter === 'completed') return item.completed;
                  if (shoppingFilter === 'pending') return !item.completed;
                  return true;
                })
                .filter((item) => priorityFilter === 'all' || item.priority === priorityFilter)
                .map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleToggleShoppingItem(list.id, item.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4
                            className={`font-medium ${
                              item.completed ? 'text-green-800 line-through' : 'text-gray-900'
                            }`}
                          >
                            {item.name}
                          </h4>
                          {getPriorityIcon(item.priority)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {item.quantity} {item.unit}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                            {item.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
                            {item.priority === 'high' ? 'Cao' : item.priority === 'medium' ? 'TB' : 'Thấp'}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {item.completed && <CheckCircleIcon className="h-4 w-4 text-white" />}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {filteredShoppingItems.length === 0 && (
        <div className="text-center py-12">
          <ListBulletIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có mặt hàng nào</h3>
          <p className="mt-1 text-sm text-gray-500">Thử thay đổi bộ lọc để xem các mặt hàng khác.</p>
        </div>
      )}
    </div>
  );
};