export interface Task {
    id: string;
    title: string;
    content: string;
    progress: number;
    duedate: string;
    group_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface CreateTaskRequest {
    title: string;
    content: string;
    progress: number;
    duedate: string;
}

export interface UpdateTaskRequest{
    title?: string;
    content?: string;
    progress?: number;
    duedate?: string;
}