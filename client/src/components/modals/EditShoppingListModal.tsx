// components/modals/EditShoppingListModal.tsx
import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

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
  groupId: string;
  name: string;
  date: string;
  shoppingItems: ShoppingItem[];
  completed: boolean;
}

interface EditShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  shoppingList: ShoppingList;
  onSave: (updatedList: ShoppingList) => void;
  groupId: string;
}

export const EditShoppingListModal: React.FC<EditShoppingListModalProps> = ({
  isOpen,
  onClose,
  shoppingList,
  onSave,
  groupId,
}) => {
  const [listName, setListName] = useState(shoppingList.name);
  const [items, setItems] = useState<ShoppingItem[]>(shoppingList.shoppingItems);

  useEffect(() => {
    setListName(shoppingList.name);
    setItems(shoppingList.shoppingItems);
  }, [shoppingList]);

  const handleAddItem = () => {
    const newItem: ShoppingItem = {
      id: `item_${Date.now()}`,
      name: '',
      quantity: 1,
      unit: 'cái',
      category: 'khác',
      completed: false,
      priority: 'medium',
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleItemChange = (itemId: string, field: keyof ShoppingItem, value: any) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    const validItems = items.filter(item => item.name.trim() !== '');
    
    if (listName.trim() === '') {
      alert('Vui lòng nhập tên danh sách');
      return;
    }

    const updatedList: ShoppingList = {
      ...shoppingList,
      name: listName.trim(),
      shoppingItems: validItems,
    };

    onSave(updatedList);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Chỉnh sửa danh sách mua sắm
              </h3>
              <button
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Tên danh sách */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên danh sách *
                </label>
                <input
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="Nhập tên danh sách..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Danh sách items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Danh sách mặt hàng ({items.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Thêm mặt hàng
                  </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {items.map((item, index) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                        {/* Tên */}
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            placeholder="Tên mặt hàng..."
                            value={item.name}
                            onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500"
                          />
                        </div>

                        {/* Số lượng */}
                        <div>
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            placeholder="Số lượng"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500"
                          />
                        </div>

                        {/* Đơn vị */}
                        <div>
                          <select
                            value={item.unit}
                            onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500"
                          >
                            <option value="cái">cái</option>
                            <option value="kg">kg</option>
                            <option value="gram">gram</option>
                            <option value="lít">lít</option>
                            <option value="ml">ml</option>
                            <option value="gói">gói</option>
                            <option value="hộp">hộp</option>
                            <option value="ổ">ổ</option>
                            <option value="bó">bó</option>
                          </select>
                        </div>

                        {/* Danh mục */}
                        <div>
                          <select
                            value={item.category}
                            onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500"
                          >
                            <option value="rau củ">rau củ</option>
                            <option value="trái cây">trái cây</option>
                            <option value="thịt">thịt</option>
                            <option value="cá">cá</option>
                            <option value="sữa">sữa</option>
                            <option value="bánh">bánh</option>
                            <option value="đồ uống">đồ uống</option>
                            <option value="gia vị">gia vị</option>
                            <option value="khác">khác</option>
                          </select>
                        </div>

                        {/* Độ ưu tiên & Xóa */}
                        <div className="flex items-center space-x-2">
                          <select
                            value={item.priority}
                            onChange={(e) => handleItemChange(item.id, 'priority', e.target.value as 'low' | 'medium' | 'high')}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500"
                          >
                            <option value="low">Thấp</option>
                            <option value="medium">TB</option>
                            <option value="high">Cao</option>
                          </select>
                          
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {items.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Chưa có mặt hàng nào. Nhấn "Thêm mặt hàng" để bắt đầu.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSave}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Lưu thay đổi
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};