import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAppContext, ShoppingList, ShoppingItem } from '../../contexts/AppContext';

interface AddShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  shoppingList?: ShoppingList;
}

const categories = [
  'Thực phẩm cơ bản',
  'Thịt tươi',
  'Rau củ',
  'Trái cây',
  'Hải sản',
  'Sữa & Trứng',
  'Bánh kẹo',
  'Gia vị',
  'Đồ uống'
];

const units = ['kg', 'g', 'lít', 'ml', 'gói', 'hộp', 'chai', 'ổ', 'quả', 'bó', 'cái'];
const priorities = [
  { value: 'low', label: 'Thấp', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Trung bình', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Cao', color: 'bg-red-100 text-red-800' }
];

export const AddShoppingListModal: React.FC<AddShoppingListModalProps> = ({
  isOpen,
  onClose,
  shoppingList
}) => {
  const { dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [items, setItems] = useState<Omit<ShoppingItem, 'id'>[]>([
    {
      name: '',
      quantity: 1,
      unit: 'kg',
      category: '',
      completed: false,
      priority: 'medium' as const
    }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (shoppingList) {
      setFormData({
        name: shoppingList.name,
        date: shoppingList.date
      });
      setItems(shoppingList.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        completed: item.completed,
        priority: item.priority
      })));
    } else {
      setFormData({
        name: '',
        date: new Date().toISOString().split('T')[0]
      });
      setItems([
        {
          name: '',
          quantity: 1,
          unit: 'kg',
          category: '',
          completed: false,
          priority: 'medium'
        }
      ]);
    }
    setErrors({});
  }, [shoppingList, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh sách là bắt buộc';
    }

    const validItems = items.filter(item => item.name.trim());
    if (validItems.length === 0) {
      newErrors.items = 'Phải có ít nhất một sản phẩm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const validItems = items.filter(item => item.name.trim());
    
    const shoppingListData: ShoppingList = {
      id: shoppingList?.id || Date.now().toString(),
      name: formData.name.trim(),
      date: formData.date,
      completed: false,
      items: validItems.map((item, index) => ({
        ...item,
        id: shoppingList?.items[index]?.id || `${Date.now()}-${index}`,
        name: item.name.trim()
      }))
    };

    if (shoppingList) {
      dispatch({ type: 'UPDATE_SHOPPING_LIST', payload: shoppingListData });
    } else {
      dispatch({ type: 'ADD_SHOPPING_LIST', payload: shoppingListData });
    }

    onClose();
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleItemChange = (index: number, field: keyof Omit<ShoppingItem, 'id'>, value: any) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
    
    if (errors.items) {
      setErrors(prev => ({ ...prev, items: '' }));
    }
  };

  const addItem = () => {
    setItems(prev => [...prev, {
      name: '',
      quantity: 1,
      unit: 'kg',
      category: '',
      completed: false,
      priority: 'medium'
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {shoppingList ? 'Chỉnh sửa danh sách' : 'Tạo danh sách mua sắm'}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tên danh sách *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
                        placeholder="VD: Mua sắm tuần này"
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ngày mua sắm
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Danh sách sản phẩm *
                      </label>
                      <button
                        type="button"
                        onClick={addItem}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Thêm sản phẩm
                      </button>
                    </div>

                    {errors.items && <p className="mb-3 text-sm text-red-600">{errors.items}</p>}

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 bg-gray-50 rounded-lg">
                          <div className="col-span-3">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Tên sản phẩm
                            </label>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                              className="block w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="VD: Gạo tẻ"
                            />
                          </div>

                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Số lượng
                            </label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                              min="1"
                              className="block w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </div>

                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Đơn vị
                            </label>
                            <select
                              value={item.unit}
                              onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                              className="block w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                              {units.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                          </div>

                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Danh mục
                            </label>
                            <select
                              value={item.category}
                              onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                              className="block w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                              <option value="">Chọn danh mục</option>
                              {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>

                          <div className="col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Ưu tiên
                            </label>
                            <select
                              value={item.priority}
                              onChange={(e) => handleItemChange(index, 'priority', e.target.value)}
                              className="block w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                              {priorities.map(priority => (
                                <option key={priority.value} value={priority.value}>
                                  {priority.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="col-span-1">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="p-1 text-red-600 hover:text-red-800"
                              disabled={items.length === 1}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                    >
                      {shoppingList ? 'Cập nhật' : 'Tạo danh sách'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}; 