import React from 'react';
import { UserGroupIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

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

interface MembersTabProps {
  members: User[];
  group: Group;
  currentUserId: string;
  handleAddMember: () => void;
  handleDeleteMember: (email: string) => void;
}

export const MembersTab: React.FC<MembersTabProps> = ({
  members,
  group,
  currentUserId,
  handleAddMember,
  handleDeleteMember,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Thành viên nhóm ({members.length})
        </h3>
        <button
          onClick={handleAddMember}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm thành viên
        </button>
      </div>

      {members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-500">{member.email}</p>
                  {group && member.id === group.ownerId && (
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      Owner
                    </span>
                  )}
                </div>
                {group && currentUserId === group.ownerId && member.id !== currentUserId && (
                  <button
                    onClick={() => handleDeleteMember(member.email)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa thành viên"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có thành viên</h3>
          <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách thêm thành viên vào nhóm.</p>
        </div>
      )}
    </div>
  );
};