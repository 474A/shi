import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'student';
  department: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

// Mock user data - in a real app, this would be fetched from an API
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@university.edu',
    password: 'admin123',
    role: 'admin' as const,
    department: 'IT Services',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Staff Member',
    email: 'staff@university.edu',
    password: 'staff123',
    role: 'staff' as const,
    department: 'Engineering',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    name: 'Student User',
    email: 'student@university.edu',
    password: 'student123',
    role: 'student' as const,
    department: 'Computer Science',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  login: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      set({ user: userWithoutPassword, isAuthenticated: true, isLoading: false });
      return true;
    } else {
      set({ isLoading: false });
      return false;
    }
  },
  
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },
  
  checkAuth: () => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      set({ user: JSON.parse(storedUser), isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  }
}));