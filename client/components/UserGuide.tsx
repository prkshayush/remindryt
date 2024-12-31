import { FaUsers, FaTasks, FaRobot, FaTrophy } from 'react-icons/fa';

export default function UserGuide() {
    return (
        <div className="px-6 py-2 shadow-md">
            <h2 className="text-4xl font-semibold mb-6 text-center font-[family-name:var(--font-oregano-sans)]">Getting Started</h2>
            
            <div className="grid md:grid-cols-2 gap-16">
                {/* Groups Section */}
                <div className="flex items-start gap-4">
                    <FaUsers className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Creating & Managing Groups</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Navigate to Dashboard and click "Create Group"</li>
                            <li>Set group name and optional join code</li>
                            <li>Share join code with team members</li>
                        </ul>
                    </div>
                </div>

                {/* Tasks Section */}
                <div className="flex items-start gap-4">
                    <FaTasks className="w-6 h-6 text-green-600 mt-1" />
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Task Management</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Select a group to view/create tasks</li>
                            <li>Create tasks with title, description, and due date</li>
                            <li>Update progress using the progress bar</li>
                            <li>Edit or delete tasks as needed</li>
                        </ul>
                    </div>
                </div>

                {/* AI Features */}
                <div className="flex items-start gap-4">
                    <FaRobot className="w-6 h-6 text-purple-600 mt-1" />
                    <div>
                        <h3 className="font-semibold text-lg mb-2">AI-Powered Features</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Smart task prioritization</li>
                            <li>Performance insights and recommendations</li>
                            <li>Automated progress tracking</li>
                            <li>Personalized productivity tips</li>
                        </ul>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="flex items-start gap-4">
                    <FaTrophy className="w-6 h-6 text-yellow-600 mt-1" />
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Leaderboard System</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Track team performance and rankings</li>
                            <li>Earn points for completing tasks</li>
                            <li>Achievement badges and rewards</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}