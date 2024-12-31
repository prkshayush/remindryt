import FAQ from "./FAQComponent";
import UserGuide from "./UserGuide";

export default function AboutSection(){
    return (
        <div className="min-h-screen py-4 m-2 border-t-4 border-gray-400 rounded-2xl flex flex-col items-center justify-between">
            <div className="">
                <UserGuide />
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