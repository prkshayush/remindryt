import FAQ from "./FAQComponent";

export default function AboutSection(){
    return (
        <div className="min-h-screen py-4 m-2 border-t-4 border-gray-400 rounded-2xl flex flex-col items-center justify-between">
            <div>User guide
                <ul>
                    <li>go to dashboard</li>
                    <li>create group</li>
                    <li>add members</li>
                    <li>create task</li>
                </ul>
            </div>
            <div className="sm:w-2/3 w-[600px]">
            <h1 className="text-center mb-4
                           text-2xl font-bold">
                            FAQs
                            </h1>
                <FAQ />
            </div>
        </div>
    )
}