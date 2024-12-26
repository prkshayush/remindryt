'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Link from 'next/link';

export default function RegisterForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleEmailRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const form = e.currentTarget;
        const email = form.email.value;
        const password = form.password.value;
        const username = form.username.value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();

            // Register with backend
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email, username })
            });

            if (!response.ok) throw new Error('Registration failed');

            localStorage.setItem('auth_token', token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setLoading(true);
        setError('');

        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            const token = await userCredential.user.getIdToken();

            // Register with backend
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: userCredential.user.email,
                    username: userCredential.user.displayName?.split(' ')[0] || userCredential.user.email?.split('@')[0]
                })
            });

            if (!response.ok) throw new Error('Registration failed');

            localStorage.setItem('auth_token', token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8 p-6 bg-white rounded-lg shadow-md text-gray-900">
            <div className="text-center">
                <h2 className="text-3xl font-bold">Create an account</h2>
                <p className="mt-2 text-gray-600">Sign up to get started</p>
            </div>

            <form onSubmit={handleEmailRegister} className="mt-8 space-y-6">
                <div className="rounded-md shadow-sm space-y-4">
                    <div>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Username"
                        />
                    </div>
                    <div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Password"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        {loading ? 'Creating account...' : 'Sign up'}
                    </button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleRegister}
                    disabled={loading}
                    className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
                >
                    <div className="flex items-center justify-center">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                        Sign up with Google
                    </div>
                </button>
            </div>

            {error && (
                <div className="mt-4 text-center text-sm text-red-600">
                    {error}
                </div>
            )}

            <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign in here
                </Link>
            </p>
        </div>
    );
}