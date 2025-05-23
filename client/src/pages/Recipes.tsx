import React, { useState, useMemo } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  HeartIcon as HeartOutlineIcon,
  ClockIcon,
  UserGroupIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAppContext, Recipe } from '../contexts/AppContext';
import { AddRecipeModal } from '../components/modals/AddRecipeModal';

const Recipes: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { recipes, favorites } = state;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>();
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | undefined>();

  // Lấy danh sách tags unique
  const allTags = useMemo(() => {
    const tags = Array.from(new Set(recipes.flatMap(r => r.tags)));
    return tags.sort();
  }, [recipes]);

  // Filter và sort recipes
  const filteredRecipes = useMemo(() => {
    let filtered = recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDifficulty = !selectedDifficulty || recipe.difficulty === selectedDifficulty;
      const matchesTag = !selectedTag || recipe.tags.includes(selectedTag);
      return matchesSearch && matchesDifficulty && matchesTag;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'cookTime':
          return a.cookTime - b.cookTime;
        case 'servings':
          return a.servings - b.servings;
        case 'difficulty':
          const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default:
          return 0;
      }
    });

    return filtered;
  }, [recipes, searchTerm, selectedDifficulty, selectedTag, sortBy]);

  const handleToggleFavorite = (recipeId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: recipeId });
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowModal(true);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công thức này?')) {
      dispatch({ type: 'DELETE_RECIPE', payload: recipeId });
    }
  };

  const handleAddNewRecipe = () => {
    setEditingRecipe(undefined);
    setShowModal(true);
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setViewingRecipe(recipe);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Dễ';
      case 'medium': return 'Trung bình';
      case 'hard': return 'Khó';
      default: return 'Trung bình';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Công thức nấu ăn</h1>
        <button
          onClick={handleAddNewRecipe}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm công thức
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm công thức..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Tất cả độ khó</option>
              <option value="easy">Dễ</option>
              <option value="medium">Trung bình</option>
              <option value="hard">Khó</option>
            </select>
          </div>

          {/* Tag Filter */}
          <div className="relative">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Tất cả thẻ</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="name">Sắp xếp theo tên</option>
              <option value="cookTime">Thời gian nấu</option>
              <option value="servings">Số phần ăn</option>
              <option value="difficulty">Độ khó</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Tìm thấy {filteredRecipes.length} công thức
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => {
          const isFavorite = favorites.includes(recipe.id);

          return (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Recipe Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
                
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex flex-col space-y-2">
                  <button
                    onClick={() => handleToggleFavorite(recipe.id)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                  >
                    {isFavorite ? (
                      <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartOutlineIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleViewRecipe(recipe)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                  >
                    <EyeIcon className="h-5 w-5 text-green-500" />
                  </button>
                  
                  <button
                    onClick={() => handleEditRecipe(recipe)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                  >
                    <PencilIcon className="h-5 w-5 text-blue-500" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteRecipe(recipe.id)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                  >
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                </div>

                {/* Difficulty Badge */}
                <div className="absolute bottom-2 left-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                    {getDifficultyLabel(recipe.difficulty)}
                  </span>
                </div>
              </div>

              {/* Recipe Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {recipe.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {recipe.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{recipe.cookTime} phút</span>
                  </div>
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    <span>{recipe.servings} phần</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {recipe.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {recipe.tags.length > 3 && (
                    <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      +{recipe.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* View Recipe Button */}
                <button
                  onClick={() => handleViewRecipe(recipe)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Xem công thức
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy công thức</h3>
          <p className="mt-1 text-sm text-gray-500">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
          </p>
          <div className="mt-6">
            <button
              onClick={handleAddNewRecipe}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Thêm công thức đầu tiên
            </button>
          </div>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {viewingRecipe && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={() => setViewingRecipe(undefined)}>
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="w-full max-w-3xl bg-white rounded-2xl shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={viewingRecipe.image}
                  alt={viewingRecipe.name}
                  className="w-full h-64 object-cover rounded-t-2xl"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/600x300?text=No+Image';
                  }}
                />
                <button
                  onClick={() => setViewingRecipe(undefined)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{viewingRecipe.name}</h2>
                    <p className="text-gray-600">{viewingRecipe.description}</p>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(viewingRecipe.difficulty)}`}>
                    {getDifficultyLabel(viewingRecipe.difficulty)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    <span>Thời gian: {viewingRecipe.cookTime} phút</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <UserGroupIcon className="h-5 w-5 mr-2" />
                    <span>Khẩu phần: {viewingRecipe.servings} người</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Thẻ tag</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingRecipe.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ingredients */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Nguyên liệu</h3>
                    <ul className="space-y-2">
                      {viewingRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>{ingredient.name}</span>
                          <span className="text-sm text-gray-600">{ingredient.amount} {ingredient.unit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Hướng dẫn</h3>
                    <ol className="space-y-3">
                      {viewingRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm text-gray-700">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Recipe Modal */}
      <AddRecipeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        recipe={editingRecipe}
      />
    </div>
  );
};

export default Recipes; 