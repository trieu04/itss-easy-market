import React, { useState } from 'react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface FridgeItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expirationTime: string;
  storeLocation: string;
  image?: string;
}

interface AddFridgeItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<FridgeItem, 'id'>) => void;
}

export const AddFridgeItemModal: React.FC<AddFridgeItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    unit: 'kg',
    expirationTime: '',
    storeLocation: 'fresh',
    image: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const units = ['kg', 'g', 'lít', 'ml', 'cái', 'gói', 'hộp', 'lon', 'ổ', 'bó', 'gram'];
  const storeLocations = [
    { value: 'fresh', label: 'Ngăn lạnh' },
    { value: 'frozen', label: 'Ngăn đá' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên thực phẩm không được để trống';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Số lượng phải lớn hơn 0';
    }

    if (!formData.expirationTime) {
      newErrors.expirationTime = 'Vui lòng chọn ngày hết hạn';
    } else {
      const selectedDate = new Date(formData.expirationTime);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.expirationTime = 'Ngày hết hạn không thể là ngày trong quá khứ';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Tạo ISO string cho expiration time để phù hợp với format trong GroupDetail
      const expirationDate = new Date(formData.expirationTime);
      expirationDate.setHours(23, 59, 59, 999); // Set to end of day
      
      onSave({
        name: formData.name.trim(),
        quantity: formData.quantity,
        unit: formData.unit,
        expirationTime: expirationDate.toISOString(),
        storeLocation: formData.storeLocation,
        image: formData.image.trim() || 'https://via.placeholder.com/150',
      });
      
      handleClose();
    }
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      name: '',
      quantity: 1,
      unit: 'kg',
      expirationTime: '',
      storeLocation: 'fresh',
      image: '',
    });
    setErrors({});
    onClose();
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Thêm thực phẩm mới</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tên thực phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên thực phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ví dụ: Thịt gà, Sữa tươi, Rau xà lách..."
              autoFocus
            />
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Số lượng và đơn vị */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0.1"
                step="0.1"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                  errors.quantity ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.quantity && <p className="mt-2 text-sm text-red-600">{errors.quantity}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đơn vị
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ngày hết hạn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày hết hạn <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="expirationTime"
              value={formData.expirationTime}
              onChange={handleInputChange}
              min={getTomorrowDate()}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                errors.expirationTime ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.expirationTime && <p className="mt-2 text-sm text-red-600">{errors.expirationTime}</p>}
            <p className="mt-1 text-xs text-gray-500">
              Chọn ngày thực phẩm sẽ hết hạn sử dụng
            </p>
          </div>

          {/* Vị trí lưu trữ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Vị trí lưu trữ
            </label>
            <div className="grid grid-cols-2 gap-3">
              {storeLocations.map(location => (
                <label 
                  key={location.value} 
                  className={`flex items-center justify-center space-x-3 cursor-pointer p-4 border-2 rounded-lg transition-all ${
                    formData.storeLocation === location.value 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="storeLocation"
                    value={location.value}
                    checked={formData.storeLocation === location.value}
                    onChange={handleInputChange}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="font-medium">{location.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh (tùy chọn)
            </label>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <PhotoIcon className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Nhập URL hình ảnh hoặc để trống để sử dụng hình mặc định
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
            >
              Thêm vào tủ lạnh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};