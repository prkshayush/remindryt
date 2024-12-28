import { useState } from 'react';
import { Task } from '@/types/task';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateTask, deleteTask } from '@/lib/store/features/taskSlice';
import UpdateTaskModal from './modals/UpdateTaskModal';

interface TaskCardProps {
    task: Task;
    groupId: string;
}

export default function TaskCard({ task, groupId }: TaskCardProps) {
    const dispatch = useAppDispatch();
    const [showEditModal, setShowEditModal] = useState(false);

    const handleProgressChange = (progress: number) => {
        dispatch(updateTask({ groupId, taskId: task.id, updates: { progress } }));
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            dispatch(deleteTask({ groupId, taskId: task.id }));
        }
    };

    return (
        <>
            <div className="bg-white p-4 rounded-lg shadow text-gray-900">
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <p className="text-gray-600 mt-2">{task.content}</p>
                <div className="mt-4">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={task.progress}
                        onChange={(e) => handleProgressChange(Number(e.target.value))}
                        className="w-full"
                    />
                    <span className="text-sm text-gray-700">{task.progress}%</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                        Due: {new Date(task.duedate).toLocaleDateString()}
                    </span>
                    <div className="space-x-2">
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            
            {showEditModal && (
                <UpdateTaskModal
                    task={task}
                    groupId={groupId}
                    onClose={() => setShowEditModal(false)}
                />
            )}
        </>
    );
}