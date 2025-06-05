import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { ArrowLeftIcon, CubeIcon, ListBulletIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline'; // Thêm CalendarIcon
import { FridgeTab } from '../components/GroupDetail/FridgeTab';
import { ShoppingListTab } from '../components/GroupDetail/ShoppingListTab';
import { MembersTab } from '../components/GroupDetail/MembersTab';
import { MealPlannerTab } from '../components/GroupDetail/MealPlannerTab'; // Thêm MealPlannerTab
import { EditFridgeItemModal } from '../components/modals/EditFridgeItemModal';

// Interfaces
interface FridgeItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expirationTime: string; // ISO date string
  storeLocation: string;
  image?: string; // Optional image URL
}

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

interface User {
  id: string;
  name: string;
  email: string;
}

interface Group {
  id: string;
  name: string;
  ownerId: string;
  members?: string[];
}

const GroupDetail: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  // Quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState<'fridge' | 'shoppingList' | 'members' | 'mealPlanner'>('fridge'); // Thêm mealPlanner
  const [isLoading, setIsLoading] = useState(true);

  // Filter states cho tủ lạnh
  const [fridgeFilter, setFridgeFilter] = useState<'all' | 'frozen' | 'fresh' | 'expired' | 'expiring'>('all');
  const [fridgeSearch, setFridgeSearch] = useState('');

  // Filter states cho shopping list
  const [shoppingFilter, setShoppingFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // State quản lý modal sửa fridge item
  const [editingFridgeItem, setEditingFridgeItem] = useState<FridgeItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Tìm nhóm theo groupId
  const group = state.groups.find((g) => g.id === groupId);

  // Mock data
  const mockUsers: User[] = [
    { id: 'user1', name: 'Nguyen Van A', email: 'a@example.com' },
    { id: 'user2', name: 'Tran Thi B', email: 'b@example.com' },
  ];

  const mockFridgeItems: FridgeItem[] = [
    {
      id: 'fridge1',
      name: 'Thịt gà',
      storeLocation: 'frozen',
      quantity: 2,
      unit: 'kg',
      expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 'fridge2',
      name: 'Sữa tươi',
      storeLocation: 'fresh',
      quantity: 1,
      unit: 'lít',
      expirationTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 'fridge3',
      name: 'Cá hồi',
      storeLocation: 'frozen',
      quantity: 1,
      unit: 'kg',
      expirationTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 'fridge4',
      name: 'Rau xà lách',
      storeLocation: 'fresh',
      quantity: 3,
      unit: 'bó',
      expirationTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 'fridge5',
      name: 'Kem vanilla',
      storeLocation: 'frozen',
      quantity: 2,
      unit: 'hộp',
      expirationTime: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 'fridge6',
      name: 'Bánh mì',
      storeLocation: 'fresh',
      quantity: 5,
      unit: 'ổ',
      expirationTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      image: 'https://via.placeholder.com/150',
    },
  ];

  const mockShoppingLists: ShoppingList[] = [
    {
      id: 'list1',
      name: 'Mua sắm tuần này',
      date: new Date().toISOString(),
      completed: false,
      items: [
        {
          id: 'item1',
          name: 'Táo',
          quantity: 2,
          unit: 'kg',
          category: 'trái cây',
          completed: false,
          priority: 'high',
        },
        {
          id: 'item2',
          name: 'Thịt lợn',
          quantity: 1,
          unit: 'kg',
          category: 'thịt',
          completed: false,
          priority: 'medium',
        },
        {
          id: 'item3',
          name: 'Thịt bò',
          quantity: 500,
          unit: 'gram',
          category: 'thịt',
          completed: true,
          priority: 'high',
        },
        {
          id: 'item4',
          name: 'Bánh mì',
          quantity: 10,
          unit: 'ổ',
          category: 'bánh',
          completed: false,
          priority: 'low',
        },
      ],
    },
    {
      id: 'list2',
      name: 'Mua sắm cuối tuần',
      date: new Date(Date.now() - 86400000).toISOString(),
      completed: true,
      items: [
        {
          id: 'item5',
          name: 'Cà chua',
          quantity: 1,
          unit: 'kg',
          category: 'rau củ',
          completed: true,
          priority: 'medium',
        },
      ],
    },
  ];

  // State quản lý shopping lists
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>(mockShoppingLists);

  const currentUserId = group?.ownerId;

  // Helper function to check if item is expired or expiring soon
  const getExpirationStatus = (expirationTime: string) => {
    const now = new Date();
    const expiration = new Date(expirationTime);
    const timeDiff = expiration.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) return 'expired';
    if (daysDiff <= 3) return 'expiring';
    return 'fresh';
  };

  // Helper function to get expiration display text
  const getExpirationText = (expirationTime: string) => {
    const now = new Date();
    const expiration = new Date(expirationTime);
    const timeDiff = expiration.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) return `Hết hạn ${Math.abs(daysDiff)} ngày trước`;
    if (daysDiff === 0) return 'Hết hạn hôm nay';
    if (daysDiff === 1) return 'Hết hạn ngày mai';
    if (daysDiff <= 7) return `Hết hạn sau ${daysDiff} ngày`;
    return expiration.toLocaleDateString('vi-VN');
  };

  const getExpirationBadgeColor = (expirationTime: string) => {
    const status = getExpirationStatus(expirationTime);
    switch (status) {
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  // Filtered fridge items
  const filteredFridgeItems = useMemo(() => {
    let filtered = mockFridgeItems;

    if (fridgeFilter === 'frozen' || fridgeFilter === 'fresh') {
      filtered = filtered.filter((item) => item.storeLocation === fridgeFilter);
    } else if (fridgeFilter === 'expired') {
      filtered = filtered.filter((item) => getExpirationStatus(item.expirationTime) === 'expired');
    } else if (fridgeFilter === 'expiring') {
      filtered = filtered.filter((item) => getExpirationStatus(item.expirationTime) === 'expiring');
    }

    if (fridgeSearch) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(fridgeSearch.toLowerCase())
      );
    }

    return filtered;
  }, [fridgeFilter, fridgeSearch]);

  // Thành viên nhóm
  const members = useMemo(() => {
    if (!group) return [];

    const memberList =
      group.members
        ?.map((memberId) => mockUsers.find((user) => user.id === memberId))
        .filter((user): user is User => user !== undefined) || [];

    const owner = mockUsers.find((user) => user.id === group.ownerId);

    if (owner && !memberList.some((member) => member.id === owner.id)) {
      memberList.unshift(owner);
    }

    return memberList;
  }, [group]);

  useEffect(() => {
    if (!group) {
      navigate('/groups');
    } else {
      setIsLoading(false);
    }
  }, [group, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const handleDeleteMember = (email: string) => {
    if (group && currentUserId === group.ownerId) {
      dispatch({
        type: 'DELETE_MEMBER_GROUP',
        payload: { groupId: group.id, email, currentUserId: currentUserId || '' },
      });
    } else {
      alert('Chỉ owner mới có quyền xóa thành viên');
    }
  };

  const handleAddMember = () => {
    const newEmail = prompt('Nhập email của thành viên mới:');
    if (group && newEmail && currentUserId === group.ownerId) {
      dispatch({
        type: 'ADD_MEMBER_GROUP',
        payload: { groupId: group.id, email: newEmail, currentUserId: currentUserId || '' },
      });
    } else if (group && currentUserId !== group.ownerId) {
      alert('Chỉ owner mới có quyền thêm thành viên');
    }
  };

  const handleAddFridgeItem = () => {
    alert('Thêm món hàng vào tủ lạnh');
  };

  const handleEditFridgeItem = (item: FridgeItem) => {
    setEditingFridgeItem(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteFridgeItem = (itemId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa món đồ này?')) {
      alert(`Đã xóa item có ID: ${itemId}`);
    }
  };

  const handleSaveFridgeItem = (updatedItem: FridgeItem) => {
    alert(`Đã cập nhật: ${updatedItem.name}`);
    setIsEditModalOpen(false);
    setEditingFridgeItem(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/groups')}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{group?.name}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('fridge')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === 'fridge'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CubeIcon className="h-5 w-5" />
              <span>Tủ lạnh</span>
            </button>
            <button
              onClick={() => setActiveTab('shoppingList')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === 'shoppingList'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ListBulletIcon className="h-5 w-5" />
              <span>Danh sách cần mua</span>
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === 'members'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserGroupIcon className="h-5 w-5" />
              <span>Thành viên</span>
            </button>
            <button
              onClick={() => setActiveTab('mealPlanner')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === 'mealPlanner'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CalendarIcon className="h-5 w-5" />
              <span>Kế hoạch bữa ăn</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'fridge' && (
            <FridgeTab
              filteredFridgeItems={filteredFridgeItems}
              fridgeFilter={fridgeFilter}
              setFridgeFilter={setFridgeFilter}
              fridgeSearch={fridgeSearch}
              setFridgeSearch={setFridgeSearch}
              handleAddFridgeItem={handleAddFridgeItem}
              handleEditFridgeItem={handleEditFridgeItem}
              handleDeleteFridgeItem={handleDeleteFridgeItem}
              getExpirationBadgeColor={getExpirationBadgeColor}
              getExpirationText={getExpirationText}
            />
          )}

          {activeTab === 'shoppingList' && (
            <ShoppingListTab
              shoppingLists={shoppingLists}
              setShoppingLists={setShoppingLists}
              shoppingFilter={shoppingFilter}
              setShoppingFilter={setShoppingFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
            />
          )}

          {activeTab === 'members' && (
            <MembersTab
              members={members}
              group={group!}
              currentUserId={currentUserId!}
              handleAddMember={handleAddMember}
              handleDeleteMember={handleDeleteMember}
            />
          )}

          {activeTab === 'mealPlanner' && (
            <MealPlannerTab
              mealPlans={state.mealPlans}
              recipes={state.recipes}
              dispatch={dispatch}
            />
          )}
        </div>
      </div>

      {isEditModalOpen && editingFridgeItem && (
        <EditFridgeItemModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingFridgeItem(null);
          }}
          item={editingFridgeItem}
          onSave={handleSaveFridgeItem}
        />
      )}
    </div>
  );
};

export default GroupDetail;