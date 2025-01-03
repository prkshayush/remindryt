'use client'

import { Group } from "@/types/group";
import GroupCard from "./GroupCard";

interface GroupListProps {
    groups: Group[];
}

const GroupList = ({ groups }: GroupListProps) => {
    // Ensure groups is an array
    const safeGroups = Array.isArray(groups) ? groups : [];

    if (!groups) {
        return <div className="p-4 text-gray-500">Loading groups...</div>;
    }

    if (safeGroups.length === 0) {
        return <div className="p-4 text-gray-500">No groups found</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {safeGroups?.filter(group => group && group.id).map(group => (
                <GroupCard key={group.id} group={group} />
            ))}
        </div>
    )
}

export default GroupList;