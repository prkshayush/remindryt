import { useState } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateTask, deleteTask } from '@/lib/store/features/taskSlice';
import { Task } from '@/types/task';

interface TaskListProps {
    tasks: Task[];
    groupId: string;
}

export default function TaskList({ tasks, groupId }: TaskListProps) {
    const dispatch = useAppDispatch();
    const [editingTask, setEditingTask] = useState<string | null>(null);

    const handleUpdateProgress = (taskId: string, progress: number) => {
        dispatch(updateTask({
            groupId,
            taskId,
            updates: { progress }
        }));
    };

    const handleDeleteTask = (taskId: string) => {
        dispatch(deleteTask({ groupId, taskId }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map(task => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg">{task.title}</h3>
                    <p className="text-gray-600 mt-2">{task.content}</p>
                    <div className="mt-4">
                        <label className="text-sm text-gray-500">Progress</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={task.progress}
                            onChange={(e) => handleUpdateProgress(task.id, parseInt(e.target.value))}
                            className="w-full"
                        />
                        <span className="text-sm">{task.progress}%</span>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}