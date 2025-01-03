'use client'

import { useGroupAnalytics } from "@/context/AnalyticsContext";
import { Group } from "@/types/group";

interface GroupSelectorProps {
    groups: Group[];
}

const GroupSelector = ({ groups }: GroupSelectorProps) => {
    const { state, setSelectedGroup } = useGroupAnalytics();

    return (
        <select
            className="rounded-lg border bg-inherit p-1 border-gray-400"
            value={state.selectedGroupId || ''}
            onChange={(e) => setSelectedGroup(e.target.value)}
        >
            <option className="text-gray-900" value="">Select a group</option>
            {groups.map((group) => (
                <option className="text-gray-900"  key={group.id} value={group.id}>
                    {group.name}
                </option>
            ))}
        </select>
    );
};

export default GroupSelector;