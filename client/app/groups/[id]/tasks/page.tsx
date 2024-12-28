'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchTasks } from '@/lib/store/features/taskSlice';
import TaskCard from '@/components/tasks/TaskCard';
import CreateTaskModal from '@/components/tasks/modals/CreateTaskModals';

export default function TasksPage() {
    const { id: groupId } = useParams();
    const dispatch = useAppDispatch();
    const { tasks, loading } = useAppSelector((state) => state.tasks);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        if (groupId) {
            dispatch(fetchTasks(groupId as string));
        }
    }, [dispatch, groupId]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tasks</h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Create Task
                </button>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} groupId={groupId as string} />
                ))}
            </div>

            {showCreateModal && (
                <CreateTaskModal
                    show={showCreateModal}
                    groupId={groupId as string}
                    onClose={() => setShowCreateModal(false)}
                />
            )}
        </div>
    );
}