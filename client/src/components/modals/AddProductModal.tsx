import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAppContext, Product } from '../../contexts/AppContext';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
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

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const { dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    originalPrice: '',
    unit: '',
    image: '',
    rating: '4.0',
    stock: '',
    discount: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        unit: product.unit,
        image: product.image,
        rating: product.rating.toString(),
        stock: product.stock.toString(),
        discount: product.discount?.toString() || ''
      });
    } else {
      setFormData({
        name: '',
        category: '',
        description: '',
        price: '',
        originalPrice: '',
        unit: '',
        image: '/images/default-product.jpg',
        rating: '4.0',
        stock: '',
        discount: ''
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên sản phẩm là bắt buộc';
    }
    if (!formData.category) {
      newErrors.category = 'Danh mục là bắt buộc';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }
    if (!formData.unit) {
      newErrors.unit = 'Đơn vị là bắt buộc';
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Số lượng phải >= 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const productData: Product = {
      id: product?.id || Date.now().toString(),
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      unit: formData.unit,
      image: formData.image || '/images/default-product.jpg',
      rating: parseFloat(formData.rating),
      stock: parseInt(formData.stock),
      discount: formData.discount ? parseFloat(formData.discount) : undefined
    };

    if (product) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: productData });
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload: productData });
    }

    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tên sản phẩm *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Danh mục *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border ${
                        errors.category ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mô tả
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Giá bán *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="1000"
                        className={`mt-1 block w-full rounded-md border ${
                          errors.price ? 'border-red-300' : 'border-gray-300'
                        } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
                      />
                      {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Giá gốc
                      </label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        min="0"
                        step="1000"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Đơn vị *
                      </label>
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.unit ? 'border-red-300' : 'border-gray-300'
                        } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
                      >
                        <option value="">Chọn đơn vị</option>
                        {units.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                      {errors.unit && <p className="mt-1 text-sm text-red-600">{errors.unit}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Số lượng *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        min="0"
                        className={`mt-1 block w-full rounded-md border ${
                          errors.stock ? 'border-red-300' : 'border-gray-300'
                        } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
                      />
                      {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
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
                      {product ? 'Cập nhật' : 'Thêm mới'}
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