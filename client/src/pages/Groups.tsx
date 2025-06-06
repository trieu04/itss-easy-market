import React, { useState, useMemo } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useAppContext, Group, User } from '../contexts/AppContext';
import AddGroupModal from '../components/modals/AddGroupModal';
import { useNavigate } from 'react-router-dom';

import {
  MagnifyingGlassIcon,
  PlusIcon,
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';


// Dữ liệu nhóm mẫu
// const mockGroups = [
//   {
//     id: '1',
//     name: 'Gia đình',
//     description: 'Nhóm các thành viên trong gia đình',
//     members: 4,
//     image: 'https://ui-avatars.com/api/?name=Gia+đình&background=10b981&color=fff'
//   },
//   {
//     id: '2',
//     name: 'Bạn bè',
//     description: 'Nhóm bạn thân cùng nhau nấu ăn',
//     members: 6,
//     image: 'https://ui-avatars.com/api/?name=Bạn+bè&background=10b981&color=fff'
//   }
// ];



const Groups: React.FC = () => {
//   const [groups, setGroups] = useState(mockGroups);
  const { state: appState, dispatch } = useAppContext();
  const { state: authState } = useAuthContext();
  const { groups, users } = appState;
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  
  const filteredGroups: Group[] = useMemo(() => {
    return groups.filter((group: Group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())    );
  }, [groups, searchTerm]);

  const handleAddNewGroup = () => {
    setShowModal(true);
  };

  const handleViewGroup = (group: Group, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/groups/${group.id}`); // Điều hướng đến trang chi tiết theo groupId
  };

  const handleDeleteGroup = (e: React.MouseEvent, groupId: string, ownerId: string) => {
    e.stopPropagation(); // Ngăn sự kiện click lan truyền
    const currentUserId = authState.user?.id;
    if (!currentUserId || currentUserId !== ownerId) {
      alert('Chỉ owner mới có quyền xóa nhóm');
      return;
    }
    if (window.confirm('Bạn có chắc muốn xóa nhóm này?')) {
      dispatch({ type: 'DELETE_GROUP', payload: {id: groupId , currentUserId: currentUserId}});
    }
  };

  

  const currentUserId = authState.user?.id;



  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý nhóm</h1>
        <button
          onClick={handleAddNewGroup}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Tạo nhóm mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative md:w-1/2">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhóm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Tìm thấy {filteredGroups.length} nhóm
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group: Group) => (
          <div
            key={group.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={(e ) => handleViewGroup(group, e )}
          >
            {/* Group Image */}
            <div className="relative h-40 bg-gray-200">
              <img
                src={group.image && group.image.trim() !== '' 
                  ? group.image 
                  : 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={group.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />
              <div className="absolute top-2 right-2 flex flex-col space-y-2">
                <UserGroupIcon className="h-5 w-5 text-green-500 bg-white rounded-full p-1 shadow" />
                {currentUserId === group.ownerId && ( 
                  <button
                    onClick={(e) => handleDeleteGroup(e, group.id, group.ownerId)}
                    className="h-5 w-5 text-red-500 bg-white rounded-full p-1 shadow"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            </div>
            {/* Group Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {group.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {group.description || 'Không có mô tả'}
              </p>
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <UserGroupIcon className="h-4 w-4 mr-1" />
                <span>{group.members.length} thành viên</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleViewGroup(group, e); }}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Xem nhóm
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy nhóm</h3>
          <p className="mt-1 text-sm text-gray-500">
            Thử thay đổi từ khóa tìm kiếm.
          </p>
          <div className="mt-6">
            <button
              onClick={handleAddNewGroup}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Tạo nhóm đầu tiên
            </button>
          </div>
        </div>
      )}


      {/* Add Group Modal */}
      {currentUserId && ( // Chỉ hiển thị modal nếu người dùng đã đăng nhập
        <AddGroupModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

export default Groups;