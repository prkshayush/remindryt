import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/task';
import axiosInstance from '@/lib/axiosConfig';

interface TaskState {
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
};

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (groupId: string) => {
        const response = await axiosInstance.get(`/api/dashboard/groups/${groupId}/tasks`);
        return response.data;
    }
);

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async ({ groupId, task }: { groupId: string; task: CreateTaskRequest }) => {
        const response = await axiosInstance.post(`/api/dashboard/groups/${groupId}/tasks`, task);
        return response.data;
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ groupId, taskId, updates }: { groupId: string; taskId: string; updates: UpdateTaskRequest }) => {
        const response = await axiosInstance.patch(`/api/dashboard/groups/${groupId}/tasks/${taskId}`, updates);
        return response.data;
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async ({ groupId, taskId }: { groupId: string; taskId: string }) => {
        await axiosInstance.delete(`/api/dashboard/groups/${groupId}/tasks/${taskId}`);
        return taskId;
    }
);

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tasks';
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(task => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(task => task.id !== action.payload);
            });
    },
});

export default taskSlice.reducer;