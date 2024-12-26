export interface Group {
    id: string;
    name: string;
    description: string;
    join_code?: string;
    creator_id: string;
    created_at: Date;
    members: GroupMember[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
    id: string;
    user_id: string;
    group_id: string;
    user: User;
    role: 'member' | 'admin';
    joined_at: Date;
}

export interface CreateGroupRequest {
    name: string;
    description: string;
    join_code?: string;
  }
  
  export interface JoinGroupRequest {
    join_code: string;
  }