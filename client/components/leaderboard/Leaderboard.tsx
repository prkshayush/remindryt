import { useEffect, useState, useRef } from 'react';
import axiosInstance from '@/lib/axiosConfig';
import { Group } from '@/types/group';

interface LeaderboardEntry {
    user_id: string;
    username: string;
    rank: number;
    task_completion_rate: number;
}

const LeaderboardTable = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const initialFetchRef = useRef(false);

    useEffect(() => {
        if (!initialFetchRef.current) {
            const fetchGroups = async () => {
                try {
                    const response = await axiosInstance.get<{ data: Group[] }>('/api/dashboard/groups');
                    setGroups(response.data.data);
                } catch (error) {
                    console.error('Error fetching groups:', error);
                    setGroups([]);
                }
            };

            fetchGroups();
            initialFetchRef.current = true;
        }
    }, []);

    useEffect(() => {
        if (selectedGroupId) {
            const fetchLeaderboard = async () => {
                setIsLoading(true);
                try {
                    const response = await axiosInstance.get<{ leaderboard: LeaderboardEntry[] }>(`/api/dashboard/groups/${selectedGroupId}/leaderboard`);
                    setLeaderboard(response.data.leaderboard);
                    console.log('Leaderboard data:', response.data.leaderboard);
                } catch (error) {
                    console.error('Error fetching leaderboard:', error);
                    setLeaderboard([]);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchLeaderboard();
        }
    }, [selectedGroupId]);

    return (
        <div>
            <select className="text-white bg-inherit"
                onChange={(e) => setSelectedGroupId(e.target.value)}
                value={selectedGroupId || ''}
            >
                <option className="text-gray-900" value="">Select a group</option>
                {groups.map((group) => (
                    <option className="text-gray-900" key={group.id} value={group.id}>
                        {group.name}
                    </option>
                ))}
            </select>

            {isLoading && <div>Loading...</div>}

            {!isLoading && leaderboard?.length > 0 && (
                <div>
                    {leaderboard.map((entry: LeaderboardEntry, index) => (
                        <div className='flex flex-col space-y-2' key={entry.user_id}>
                            <span>#{index + 1} {entry.username}</span>
                            <div className='flex justify-between'>
                                <span>{entry.task_completion_rate}% completion rate</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && leaderboard?.length === 0 && selectedGroupId && (
                <div>No leaderboard data available for this group.</div>
            )}
        </div>
    );
};

export default LeaderboardTable;