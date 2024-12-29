import { useState } from 'react';
import { Task, UpdateTaskRequest } from '@/types/task';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateTask } from '@/lib/store/features/taskSlice';

interface UpdateTaskModalProps {
    task: Task;
    groupId: string;
    onClose: () => void;
}

export default function UpdateTaskModal({ task, groupId, onClose }: UpdateTaskModalProps) {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({
        title: task.title,
        content: task.content,
        progress: task.progress,
        duedate: new Date(task.duedate).toISOString().split('T')[0],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(updateTask({
                groupId,
                taskId: task.id,
                updates: formData as UpdateTaskRequest
            })).unwrap();
            alert("Task updated successfully");
            onClose();
        } catch (error) {
            alert("Failed to update task");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-gray-900">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Update Task</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.progress}
                            onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                            className="w-full"
                        />
                        <span className="text-sm text-gray-600">{formData.progress}%</span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                        <input
                            type="date"
                            value={formData.duedate}
                            onChange={(e) => setFormData({ ...formData, duedate: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}