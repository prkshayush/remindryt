'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import Groups from "@/components/groups";
import CreateGroupModal from "@/components/groups/modals/CreateGroupModal";
import JoinGroupModal from "@/components/groups/modals/JoinGroupModal";
import { Group } from "@/types/group";
import GroupSelector from "@/components/analytics/GroupSelector";
import TaskProgress from '@/components/analytics/TaskProgress';
import LeaderboardTable from "@/components/leaderboard/Leaderboard";
import AIInsights from '@/components/analytics/Insights';
import axiosInstance from "@/lib/axiosConfig";


export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
    const [groups, setGroups] = useState<Group[]>([]);

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/login");
                return;
            }
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        const fetchGroups = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get<{ data: Group[] }>('/api/dashboard/groups');
                setGroups(response.data.data);
            } catch (error) {
                console.error("Failed to fetch groups:", error);
                setGroups([]);
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <main className="h-screen grid grid-cols-6 grid-rows-6 gap-4 p-8">
            {/* Sidebar */}
            <aside className="col-span-1 row-span-6 flex flex-col justify-between border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col space-y-4">
                    <div className="text-center py-2 border-b border-gray-200">
                        <h1 className="text-xl font-semibold">Welcome</h1>
                        <p className="text-sm text-gray-400">{user.displayName || user.email}</p>
                    </div>
                    <h3 className="text-lg font-semibold mb-4">Group Actions</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Create Group
                        </button>
                        <button
                            onClick={() => setShowJoinModal(true)}
                            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            Join Group
                        </button>
                        {/* Modals */}
                        <CreateGroupModal
                            show={showCreateModal}
                            onClose={() => setShowCreateModal(false)}
                        />
                        <JoinGroupModal
                            show={showJoinModal}
                            onClose={() => setShowJoinModal(false)}
                        />
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                    Sign Out
                </button>
            </aside>

            {/* Main Content */}
            <section className="col-span-5 row-span-6 space-y-4">
                {/* Top Row */}
                <div className="grid grid-cols-4 gap-4 h-2/6">
                    <div className="col-span-3 border border-gray-200 rounded-lg p-4">
                        <GroupSelector groups={groups} />
                        <TaskProgress />
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <LeaderboardTable />
                    </div>
                </div>

                {/* Middle Row */}
                <div className="h-[35%] border border-gray-200 rounded-lg p-4">
                    <Groups />
                </div>

                {/* Bottom Row */}
                <div className="h-[27%] border border-gray-200 rounded-lg p-4">
                    <AIInsights />
                </div>
            </section>
        </main>
    );
}