'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import Groups from "@/components/groups";

// import CreateGroupButton from '@/components/groups/CreateGroupButton';
// import JoinGroupButton from '@/components/groups/JoinGroupButton';
// import GroupDetails from '@/components/groups/GroupDetails';


export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
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
            <aside className="col-span-1 row-span-6 flex flex-col justify-between border border-gray-200 rounded-lg p-4 bg-white/5">
                <div className="space-y-4">
                    <div className="text-center py-2 border-b border-gray-200">
                        <h1 className="text-xl font-semibold">Welcome</h1>
                        <p className="text-sm text-gray-400">{user.displayName || user.email}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                        {/* User Functions */}

                        {/* <CreateGroupButton />
                        <JoinGroupButton /> */}

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
                    <div className="col-span-3 border border-gray-200 rounded-lg bg-white/5 p-4">
                        Task Progress
                    </div>
                    <div className="border border-gray-200 rounded-lg bg-white/5 p-4">
                        Leaderboard
                    </div>
                </div>

                {/* Middle Row */}
                <div className="h-3/6 border border-gray-200 rounded-lg bg-white/5 p-4">
                    Task Details
                    
                    <Groups />

                </div>

                {/* Bottom Row */}
                <div className="h-1/6 border border-gray-200 rounded-lg bg-white/5 p-4">
                    AI Assistant
                </div>
            </section>
        </main>
    );
}