'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { createGroup } from '@/lib/store/features/groupSlice';
import type { CreateGroupRequest } from '@/types/group';

interface ModalProps {
  show: boolean;
  onClose: () => void;
}

const CreateGroupModal = ({ show, onClose }: ModalProps) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<CreateGroupRequest>({
    name: '',
    description: '',
    join_code: '',
  });

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createGroup(formData));
    onClose();
    setFormData({ name: '', description: '', join_code: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-gray-900">
        <h3 className="text-lg font-semibold mb-4">Create New Group</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Group Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Join Code (Optional)"
              value={formData.join_code}
              onChange={(e) => setFormData({ ...formData, join_code: e.target.value })}
              className="w-full p-2 border rounded-lg"
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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;