
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-10 font-[family-name:var(--font-geist-mono)]">
      <nav className="w-full">
        <ul className="container mx-auto flex justify-between items-center py-3">
          <li className="list-type-none py-1 px-4 rounded-xl border-b-2 border-r-2 border-blue-600 hover:border-green-700">
            <Image src="/logo-1.png" alt="RemindRyt" width={100} height={100} />
          </li>
          <li className="list-type-none py-1 px-4 rounded-xl border-t-2 border-l-2 border-blue-600 hover:border-green-700">
            <a href="/login">SignUp</a>
          </li>
        </ul>
      </nav>
      <div className="my-20 flex flex-col items-center justify-center">
        <h1 className="sm:text-6xl font-sans sm:font-bold px-4 py-2 text-3xl font-semibold">Smash Deadlines Leverage AI, Win Every Task.</h1>
        <p className="sm:text-3xl py-1 px-4 text-center">Stay in sync, compete smart, and achieve greatness together.</p>
        <div>
          <button className="py-1 px-4 rounded-xl border-t-2 border-l-2 border-blue-600 hover:border-green-700"><a href="/dashboard">Get Started</a></button>
          <button className="py-1 px-4 rounded-xl border-b-2 border-r-2 border-green-700 hover:border-blue-600"><a href="#learn">Learn More</a></button>
        </div>
      </div>
      <div className="my-28">
        <p className="sm:text-3xl sm:font-semibold py-1 px-4 text-center">Enjoy AI-powered scoring, real-time progress tracking, and personalized motivation.</p>
        <p className="sm:text-3xl py-1 px-4 text-center">With RemindRyt, turn task management into a team sport.</p>
      </div>
    </main>
  )
};