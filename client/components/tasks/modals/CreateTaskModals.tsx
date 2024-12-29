import { createTask } from "@/lib/store/features/taskSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import React, { useState } from "react";


interface CreateTaskModalProps {
    show: boolean;
    onClose: () => void;
    groupId: string;
}

export default function CreateTaskModal({ show, onClose, groupId }: CreateTaskModalProps) {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        duedate: new Date().toISOString().split('T')[0],
    });

    if (!show) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(createTask({
                groupId,
                task: {
                    ...formData,
                    progress: 0,
                }
            }));
            alert("Task created successfully");
            onClose();
            setFormData({ title: '', content: '', duedate: '' });
        } catch (error) {
            alert("Failed to create task");
            return;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center text-gray-900">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create New Task</h2>
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
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
