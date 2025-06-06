import React, { useState } from 'react';
import {
  CubeIcon,
  FunnelIcon,
  FireIcon,
  SparklesIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { AddFridgeItemModal } from '../modals/AddFridgeItemModal';

interface FridgeItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expirationTime: string; // ISO date string
  storeLocation: string;
  image?: string; // Optional image URL
}

interface FridgeTabProps {
  filteredFridgeItems: FridgeItem[];
  fridgeFilter: 'all' | 'frozen' | 'fresh' | 'expired' | 'expiring';
  setFridgeFilter: (filter: 'all' | 'frozen' | 'fresh' | 'expired' | 'expiring') => void;
  fridgeSearch: string;
  setFridgeSearch: (search: string) => void;
  handleAddFridgeItem: (item: Omit<FridgeItem, 'id'>) => void;
  handleEditFridgeItem: (item: FridgeItem) => void;
  handleDeleteFridgeItem: (itemId: string) => void;
  getExpirationBadgeColor: (expirationTime: string) => string;
  getExpirationText: (expirationTime: string) => string;
}

export const FridgeTab: React.FC<FridgeTabProps> = ({
  filteredFridgeItems,
  fridgeFilter,
  setFridgeFilter,
  fridgeSearch,
  setFridgeSearch,
  handleAddFridgeItem,
  handleEditFridgeItem,
  handleDeleteFridgeItem,
  getExpirationBadgeColor,
  getExpirationText,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSaveNewItem = (item: Omit<FridgeItem, 'id'>) => {
    handleAddFridgeItem(item);
    setIsAddModalOpen(false);
  };

  return (
    <div>
      {/* Filters cho tủ lạnh */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Lọc theo:</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setFridgeFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                fridgeFilter === 'all' ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFridgeFilter('frozen')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center space-x-1 ${
                fridgeFilter === 'frozen' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <SparklesIcon className="h-4 w-4" />
              <span>Ngăn đá</span>
            </button>
            <button
              onClick={() => setFridgeFilter('fresh')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center space-x-1 ${
                fridgeFilter === 'fresh' ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FireIcon className="h-4 w-4" />
              <span>Ngăn lạnh</span>
            </button>
            <button
              onClick={() => setFridgeFilter('expired')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                fridgeFilter === 'expired' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Hết hạn
            </button>
            <button
              onClick={() => setFridgeFilter('expiring')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                fridgeFilter === 'expiring' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Sắp hết hạn
            </button>
          </div>

          <input
            type="text"
            placeholder="Tìm kiếm thực phẩm..."
            value={fridgeSearch}
            onChange={(e) => setFridgeSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Fridge Items Grid with Add Button */}
      <div className="p-4">
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center px-4 py-2 mb-8 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Thêm thực phẩm
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFridgeItems.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 relative">
              <div className="absolute top-2 left-2 flex space-x-1" style={{ marginTop: '10px', marginBottom: '10px' }}>
                <button
                  onClick={() => handleEditFridgeItem(item)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors border border-blue-700"
                  title="Sửa"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteFridgeItem(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors border border-red-700"
                  title="Xóa"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="relative mt-12">
                <img
                  src="https://placehold.co/150x"
                  alt="Fridge Item"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                  item.storeLocation === 'frozen' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {item.storeLocation === 'frozen' ? (
                    <div className="flex items-center space-x-1">
                      <SparklesIcon className="h-3 w-3" />
                      <span>Đá</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <FireIcon className="h-3 w-3" />
                      <span>Lạnh</span>
                    </div>
                  )}
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-700 font-medium">{item.quantity} {item.unit}</span>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${getExpirationBadgeColor(item.expirationTime)}`}>
                {getExpirationText(item.expirationTime)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredFridgeItems.length === 0 && (
        <div className="text-center py-12">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy thực phẩm</h3>
          <p className="mt-1 text-sm text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
        </div>
      )}

      {/* Add Fridge Item Modal */}
      <AddFridgeItemModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveNewItem}
      />
    </div>
  );
};