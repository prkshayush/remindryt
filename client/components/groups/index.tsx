'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchGroups } from '@/lib/store/features/groupSlice';
import GroupList from './GroupList';
import CreateGroupModal from './modals/CreateGroupModal';
import JoinGroupModal from './modals/JoinGroupModal';

const Groups = () => {
  const dispatch = useAppDispatch();
  const { groups = [], loading, error } = useAppSelector((state) => state.groups);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  if (loading) {
    return <div className="p-4">Loading groups...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {/* Control Panel */}
      <div className="col-span-1 bg-white p-4 rounded-lg shadow text-gray-900">
        <h3 className="text-lg font-semibold mb-4">Group Actions</h3>
        <div className="space-y-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Create Group
          </button>
          <button
            onClick={() => setShowJoinModal(true)}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Join Group
          </button>
        </div>
      </div>

      {/* Groups List */}
      <div className="col-span-3">
        <h2 className="text-xl font-bold mb-4">My Groups</h2>
        <GroupList groups={groups} />
      </div>

      {/* Modals */}
      <CreateGroupModal 
        show={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
      <JoinGroupModal 
        show={showJoinModal} 
        onClose={() => setShowJoinModal(false)} 
      />
    </div>
  );
};

export default Groups;