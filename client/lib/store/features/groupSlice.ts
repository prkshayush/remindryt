import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreateGroupRequest, Group, JoinGroupRequest } from "@/types/group";
import axiosInstance from "@/lib/axiosConfig";

interface GroupState {
    groups: Group[];
    loading: boolean;
    error: string | null;
}

const initialState: GroupState = {
    groups: [],
    loading: false,
    error: null,
}

export const fetchGroups = createAsyncThunk('groups/fetchGroups', async (_, { rejectWithValue }) => {
    try {
        const idToken = localStorage.getItem('auth_token');
        const res = await axiosInstance.get('/api/dashboard/groups', {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
        });
        return res.data.data;
    } catch (error) {
        rejectWithValue('Failed to fetch groups');
    }
})

export const createGroup = createAsyncThunk('groups/createGroup', async (groupData: CreateGroupRequest, {
    rejectWithValue }) => {
    try {
        const idToken = localStorage.getItem('auth_token');
        const res = await axiosInstance.post('/api/dashboard/groups', groupData, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            }
        });
        return res.data.data;
    } catch (error) {
        rejectWithValue('Failed to create group');

    }
}
)

export const joinGroup = createAsyncThunk('groups/joinGroup', async (joinData: JoinGroupRequest, {
    rejectWithValue }) => {
    try {
        const idToken = localStorage.getItem('auth_token');
        const formData = new URLSearchParams();
        formData.append('join_code', joinData.join_code);

        const res = await axiosInstance.post('/api/dashboard/groups/join', formData, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        return res.data.data;
    } catch (error) {
        return rejectWithValue('Failed to join group');
    }
}
);

const groupSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Groups
            .addCase(fetchGroups.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = action.payload;
                state.error = null;
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Group
            .addCase(createGroup.fulfilled, (state, action) => {
                state.groups.push(action.payload);
            })
            // Join Group
            .addCase(joinGroup.fulfilled, (state, action) => {
                state.groups.push(action.payload);
            });
    },
});


export default groupSlice.reducer;