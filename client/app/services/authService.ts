import { auth } from '../lib/firebase';
import { 
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup
} from 'firebase/auth';
import axiosInstance from '../lib/axiosConfig';

export const registerUser = async ({ email, password, username }: { 
    email: string;
    password: string;
    username: string;
}) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        
        const response = await axiosInstance.post('/api/auth/register', {
            email,
            username
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            console.error('Registration endpoint not found:', error);
        }
        throw new Error(error.response?.data?.message || error.message);
    }
};

export const signInWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const token = await userCredential.user.getIdToken();
        
        const response = await axiosInstance.post('/api/auth/register', {
            email: userCredential.user.email,
            username: userCredential.user.displayName?.split(' ')[0] || userCredential.user.email?.split('@')[0]
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message);
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('auth_token', token);
        
        const response = await axiosInstance.post('/api/auth/login', {
          email: userCredential.user.email
        });
        
        return response.data;
      } catch (error) {
        throw error;
      }
}

export const loginWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('auth_token', token);
        return userCredential.user;
      } catch (error) {
        throw error;
      }
};