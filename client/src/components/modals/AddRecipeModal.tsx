import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAppContext, Recipe } from '../../contexts/AppContext';

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe?: Recipe;
}

const difficulties = [
  { value: 'easy', label: 'Dễ', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Trung bình', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'hard', label: 'Khó', color: 'bg-red-100 text-red-800' }
];

const commonTags = [
  'Việt Nam', 'Âu', 'Á', 'Nhanh', 'Tốt cho sức khỏe', 'Chay', 'Ít calo', 
  'Nướng', 'Chiên', 'Hấp', 'Luộc', 'Xào', 'Súp', 'Salad', 'Tráng miệng'
];

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({
  isOpen,
  onClose,
  recipe
}) => {
  const { dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cookTime: '30',
    servings: '2',
    image: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard'
  });

  const [ingredients, setIngredients] = useState([
    { name: '', amount: '', unit: '' }
  ]);

  const [instructions, setInstructions] = useState(['']);
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name,
        description: recipe.description,
        cookTime: recipe.cookTime.toString(),
        servings: recipe.servings.toString(),
        image: recipe.image,
        difficulty: recipe.difficulty
      });
      setIngredients(recipe.ingredients);
      setInstructions(recipe.instructions);
      setTags(recipe.tags);
    } else {
      setFormData({
        name: '',
        description: '',
        cookTime: '30',
        servings: '2',
        image: '/images/default-recipe.jpg',
        difficulty: 'medium'
      });
      setIngredients([{ name: '', amount: '', unit: '' }]);
      setInstructions(['']);
      setTags([]);
    }
    setCustomTag('');
    setErrors({});
  }, [recipe, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên món ăn là bắt buộc';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }
    if (!formData.cookTime || parseInt(formData.cookTime) <= 0) {
      newErrors.cookTime = 'Thời gian nấu phải lớn hơn 0';
    }
    if (!formData.servings || parseInt(formData.servings) <= 0) {
      newErrors.servings = 'Số phần ăn phải lớn hơn 0';
    }

    const validIngredients = ingredients.filter(ing => ing.name.trim());
    if (validIngredients.length === 0) {
      newErrors.ingredients = 'Phải có ít nhất một nguyên liệu';
    }

    const validInstructions = instructions.filter(inst => inst.trim());
    if (validInstructions.length === 0) {
      newErrors.instructions = 'Phải có ít nhất một bước hướng dẫn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const validIngredients = ingredients.filter(ing => ing.name.trim());
    const validInstructions = instructions.filter(inst => inst.trim());

    const recipeData: Recipe = {
      id: recipe?.id || Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      cookTime: parseInt(formData.cookTime),
      servings: parseInt(formData.servings),
      image: formData.image || '/images/default-recipe.jpg',
      difficulty: formData.difficulty,
      ingredients: validIngredients,
      instructions: validInstructions,
      tags: tags
    };

    if (recipe) {
      dispatch({ type: 'UPDATE_RECIPE', payload: recipeData });
    } else {
      dispatch({ type: 'ADD_RECIPE', payload: recipeData });
    }

    onClose();
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleIngredientChange = (index: number, field: keyof typeof ingredients[0], value: string) => {
    setIngredients(prev => prev.map((ing, i) => 
      i === index ? { ...ing, [field]: value } : ing
    ));
    
    if (errors.ingredients) {
      setErrors(prev => ({ ...prev, ingredients: '' }));
    }
  };

  const addIngredient = () => {
    setIngredients(prev => [...prev, { name: '', amount: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleInstructionChange = (index: number, value: string) => {
    setInstructions(prev => prev.map((inst, i) => 
      i === index ? value : inst
    ));
    
    if (errors.instructions) {
      setErrors(prev => ({ ...prev, instructions: '' }));
    }
  };

  const addInstruction = () => {
    setInstructions(prev => [...prev, '']);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags(prev => [...prev, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleAddCustomTag = () => {
    if (customTag.trim()) {
      handleAddTag(customTag.trim());
      setCustomTag('');
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {recipe ? 'Chỉnh sửa công thức' : 'Thêm công thức mới'}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Tên món ăn *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
                        placeholder="VD: Phở bò Hà Nội"
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Mô tả *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        rows={3}
                        className={`mt-1 block w-full rounded-md border ${
                          errors.description ? 'border-red-300' : 'border-gray-300'
                        } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
                        placeholder="Mô tả về món ăn..."
                      />
                      {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Thời gian nấu (phút) *
                      </label>
                      <input
                        type="number"
                        name="cookTime"
                        value={formData.cookTime}
                        onChange={handleFormChange}
                        min="1"
                        className={`mt-1 block w-full rounded-md border ${
                          errors.cookTime ? 'border-red-300' : 'border-gray-300'
                        } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
                      />
                      {errors.cookTime && <p className="mt-1 text-sm text-red-600">{errors.cookTime}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Số phần ăn *
                      </label>
                      <input
                        type="number"
                        name="servings"
                        value={formData.servings}
                        onChange={handleFormChange}
                        min="1"
                        className={`mt-1 block w-full rounded-md border ${
                          errors.servings ? 'border-red-300' : 'border-gray-300'
                        } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`}
                      />
                      {errors.servings && <p className="mt-1 text-sm text-red-600">{errors.servings}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Độ khó
                      </label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      >
                        {difficulties.map(diff => (
                          <option key={diff.value} value={diff.value}>
                            {diff.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Link ảnh
                      </label>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleFormChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thẻ tag
                    </label>
                    
                    {/* Selected Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 text-green-600 hover:text-green-800"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Common Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {commonTags.filter(tag => !tags.includes(tag)).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleAddTag(tag)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>

                    {/* Custom Tag Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        placeholder="Thêm thẻ tùy chỉnh..."
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomTag}
                        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Nguyên liệu *
                      </label>
                      <button
                        type="button"
                        onClick={addIngredient}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Thêm nguyên liệu
                      </button>
                    </div>

                    {errors.ingredients && <p className="mb-3 text-sm text-red-600">{errors.ingredients}</p>}

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {ingredients.map((ingredient, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg">
                          <div className="col-span-6">
                            <input
                              type="text"
                              value={ingredient.name}
                              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                              placeholder="Tên nguyên liệu"
                              className="block w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              type="text"
                              value={ingredient.amount}
                              onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                              placeholder="Số lượng"
                              className="block w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="text"
                              value={ingredient.unit}
                              onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                              placeholder="Đơn vị"
                              className="block w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </div>
                          <div className="col-span-1">
                            <button
                              type="button"
                              onClick={() => removeIngredient(index)}
                              className="p-1 text-red-600 hover:text-red-800"
                              disabled={ingredients.length === 1}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Hướng dẫn nấu *
                      </label>
                      <button
                        type="button"
                        onClick={addInstruction}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Thêm bước
                      </button>
                    </div>

                    {errors.instructions && <p className="mb-3 text-sm text-red-600">{errors.instructions}</p>}

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {instructions.map((instruction, index) => (
                        <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg">
                          <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <textarea
                            value={instruction}
                            onChange={(e) => handleInstructionChange(index, e.target.value)}
                            placeholder={`Bước ${index + 1}...`}
                            rows={2}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeInstruction(index)}
                            className="flex-shrink-0 p-1 text-red-600 hover:text-red-800"
                            disabled={instructions.length === 1}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
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
                      {recipe ? 'Cập nhật' : 'Thêm công thức'}
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