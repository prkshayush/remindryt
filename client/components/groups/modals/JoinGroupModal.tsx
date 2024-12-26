'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { joinGroup } from '@/lib/store/features/groupSlice';

interface ModalProps {
  show: boolean;
  onClose: () => void;
}

const JoinGroupModal = ({ show, onClose }: ModalProps) => {
  const dispatch = useAppDispatch();
  const [joinCode, setJoinCode] = useState('');

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(joinGroup({ join_code: joinCode }));
    onClose();
    setJoinCode('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-gray-900">
        <h3 className="text-lg font-semibold mb-4">Join Group</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter Join Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinGroupModal;