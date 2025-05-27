import { create } from 'zustand';

export interface Reservation {
  id: string;
  equipmentId: string;
  equipmentName: string;
  userId: string;
  userName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  purpose: string;
  createdAt: string;
  notes?: string;
}

interface ReservationState {
  reservations: Reservation[];
  isLoading: boolean;
  error: string | null;
  fetchReservations: () => Promise<void>;
  getReservationById: (id: string) => Reservation | undefined;
  getReservationsByUserId: (userId: string) => Reservation[];
  getReservationsByEquipmentId: (equipmentId: string) => Reservation[];
  createReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => Promise<void>;
  updateReservationStatus: (id: string, status: Reservation['status'], notes?: string) => Promise<void>;
}

// Mock reservation data
const mockReservations: Reservation[] = [
  {
    id: '1',
    equipmentId: '1',
    equipmentName: 'Microscope',
    userId: '3',
    userName: 'Student User',
    startDate: '2023-10-15T09:00:00Z',
    endDate: '2023-10-15T17:00:00Z',
    status: 'approved',
    purpose: 'Biology research project on cell structures',
    createdAt: '2023-10-10T14:32:45Z'
  },
  {
    id: '2',
    equipmentId: '4',
    equipmentName: 'Digital Camera',
    userId: '3',
    userName: 'Student User',
    startDate: '2023-10-18T10:00:00Z',
    endDate: '2023-10-20T16:00:00Z',
    status: 'pending',
    purpose: 'Campus photography project',
    createdAt: '2023-10-12T09:15:22Z'
  },
  {
    id: '3',
    equipmentId: '5',
    equipmentName: '3D Printer',
    userId: '2',
    userName: 'Staff Member',
    startDate: '2023-10-25T13:00:00Z',
    endDate: '2023-10-27T17:00:00Z',
    status: 'approved',
    purpose: 'Creating mechanical prototypes for engineering class',
    createdAt: '2023-10-05T16:42:10Z'
  },
  {
    id: '4',
    equipmentId: '2',
    equipmentName: 'Laptop',
    userId: '3',
    userName: 'Student User',
    startDate: '2023-09-28T08:00:00Z',
    endDate: '2023-09-28T18:00:00Z',
    status: 'completed',
    purpose: 'Software development workshop',
    createdAt: '2023-09-25T11:20:33Z',
    notes: 'Returned in good condition'
  },
  {
    id: '5',
    equipmentId: '6',
    equipmentName: 'VR Headset',
    userId: '2',
    userName: 'Staff Member',
    startDate: '2023-10-22T09:30:00Z',
    endDate: '2023-10-22T16:30:00Z',
    status: 'rejected',
    purpose: 'Virtual reality demonstration for open day',
    createdAt: '2023-10-15T10:05:17Z',
    notes: 'Equipment already booked for maintenance'
  }
];

export const useReservationStore = create<ReservationState>((set, get) => ({
  reservations: [],
  isLoading: false,
  error: null,

  fetchReservations: async () => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ reservations: mockReservations, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },

  getReservationById: (id) => {
    return get().reservations.find(reservation => reservation.id === id);
  },

  getReservationsByUserId: (userId) => {
    return get().reservations.filter(reservation => reservation.userId === userId);
  },

  getReservationsByEquipmentId: (equipmentId) => {
    return get().reservations.filter(reservation => reservation.equipmentId === equipmentId);
  },

  createReservation: async (reservationData) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReservation: Reservation = {
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        ...reservationData
      };
      
      set(state => ({
        reservations: [...state.reservations, newReservation],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },

  updateReservationStatus: async (id, status, notes) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set(state => ({
        reservations: state.reservations.map(reservation => 
          reservation.id === id ? { ...reservation, status, notes } : reservation
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  }
}));

export const getStatusColor = (status: Reservation['status']) => {
  switch (status) {
    case 'approved':
      return 'bg-success-500 text-white';
    case 'pending':
      return 'bg-warning-500 text-white';
    case 'rejected':
      return 'bg-error-500 text-white';
    case 'completed':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export const getStatusBadge = (status: Reservation['status']) => {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'pending':
      return 'Pending';
    case 'rejected':
      return 'Rejected';
    case 'completed':
      return 'Completed';
    default:
      return 'Unknown';
  }
};