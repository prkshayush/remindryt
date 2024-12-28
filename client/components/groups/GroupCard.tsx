'use client'

import { Group } from "@/types/group"
import { useRouter } from "next/navigation";

interface GroupCardProps {
    group: Group;
}
const GroupCard = ({ group }: GroupCardProps) => {
    const router = useRouter();
    return (
        <div className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div
                className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/groups/${group.id}/tasks`)}
            >
                <h2 className="font-semibold text-lg text-gray-900">{group.name}</h2>
                <p className="text-sm text-gray-600">{group.description}</p>
                {/* Members Section */}
                <p className="text-sm text-gray-500 mb-2">
                    Members ({group.members.length})
                </p>
                <div className="space-y-1">
                    {group.members.map((member) => (
                        <div key={member.id} className="text-xs text-gray-600 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            {member.user.username || 'Anonymous'}
                            {member.role === 'admin' && (
                                <span className="ml-2 text-xs text-blue-500">(Admin)</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>


            {/* Join Code */}
            {group.join_code && (
                <div className="mt-3 text-xs text-gray-700">
                    Join Code: {group.join_code}
                </div>
            )}
        </div>
    )
}
export default GroupCard;