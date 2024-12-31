'use client'
import { useState } from 'react';

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="border-b border-gray-300 last:border-b-0 py-4">
            <div className="flex justify-between items-center
                            cursor-pointer" onClick={toggleOpen}>
                <h3 className="font-semibold text-lg">{question}</h3>
                <svg
                    className={`w-6 h-6 transform transition-transform duration-400 ${isOpen ? 'rotate-45' : ''
                        }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v12M6 12h12"
                    />
                </svg>
            </div>
            {isOpen && (
                <p className="mt-2 text-gray-300">{answer}</p>
            )}
        </div>
    );
};

const FAQ = () => {
    const faqData = [
        {
            question: "How can I join group?",
            answer: `The creator of group will send you a join code, use this code to join the group.`,
        },
        {
            question: "Where is the join code?",
            answer: `After creating the group, you will see a "join-code" in group dashboard, send this to your friend and invite them.`,
        },
        {
            question: "How many groups can I be a part of?",
            answer: `Any one user can create a maximum of one group, and can join 3 other groups as member, for now.`,
        },
    ];

    return (
        <div className="max-w-4xl mx-auto p-4">
            {faqData.map((item, index) => (
                <FAQItem key={index}
                    question={item.question}
                    answer={item.answer} />
            ))}
        </div>
    );
};

export default FAQ;