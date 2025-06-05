import React from 'react';

interface FridgeItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expirationTime: string; // ISO date string
  storeLocation: string;
  image?: string; // Optional image URL
}

interface EditFridgeItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FridgeItem;
  onSave: (updatedItem: FridgeItem) => void;
}

export const EditFridgeItemModal: React.FC<EditFridgeItemModalProps> = ({ isOpen, onClose, item, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sửa thông tin thực phẩm</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const updatedItem: FridgeItem = {
              ...item,
              name: formData.get('name') as string,
              quantity: Number(formData.get('quantity')),
              unit: formData.get('unit') as string,
              storeLocation: formData.get('storeLocation') as string,
              expirationTime: formData.get('expirationTime') as string,
            };
            onSave(updatedItem);
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên thực phẩm</label>
              <input
                type="text"
                name="name"
                defaultValue={item.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                <input
                  type="number"
                  name="quantity"
                  defaultValue={item.quantity}
                  min="0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                <input
                  type="text"
                  name="unit"
                  defaultValue={item.unit}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí lưu trữ</label>
              <select
                name="storeLocation"
                defaultValue={item.storeLocation}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="fresh">Ngăn lạnh</option>
                <option value="frozen">Ngăn đá</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
              <input
                type="date"
                name="expirationTime"
                defaultValue={item.expirationTime.split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};