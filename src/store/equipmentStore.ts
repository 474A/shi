import { create } from 'zustand';
import { formatDistanceToNow } from 'date-fns';

export interface Equipment {
  id: string;
  name: string;
  category: string;
  model: string;
  serialNumber: string;
  location: string;
  status: 'available' | 'in-use' | 'maintenance' | 'reserved';
  imageUrl: string;
  purchaseDate: string;
  lastMaintenance: string | null;
  description: string;
  department: string;
  tags: string[];
}

interface EquipmentState {
  equipment: Equipment[];
  isLoading: boolean;
  error: string | null;
  fetchEquipment: () => Promise<void>;
  getEquipmentById: (id: string) => Equipment | undefined;
  searchEquipment: (query: string) => Equipment[];
  filterByStatus: (status: Equipment['status']) => Equipment[];
  filterByCategory: (category: string) => Equipment[];
  updateEquipmentStatus: (id: string, status: Equipment['status']) => Promise<void>;
}

// Mock equipment data
const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Microscope',
    category: 'Lab Equipment',
    model: 'Olympus BX53',
    serialNumber: 'OLY-2023-1234',
    location: 'Science Building, Room 302',
    status: 'available',
    imageUrl: 'https://images.pexels.com/photos/5327583/pexels-photo-5327583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    purchaseDate: '2022-06-15',
    lastMaintenance: '2023-01-20',
    description: 'High-quality research microscope with digital imaging capabilities.',
    department: 'Biology',
    tags: ['research', 'lab', 'optics']
  },
  {
    id: '2',
    name: 'Laptop',
    category: 'Computing',
    model: 'MacBook Pro M2',
    serialNumber: 'APPLE-2022-5678',
    location: 'IT Storage, Room 101',
    status: 'in-use',
    imageUrl: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    purchaseDate: '2023-02-10',
    lastMaintenance: null,
    description: 'Apple MacBook Pro with M2 chip, 16GB RAM, 512GB SSD.',
    department: 'Computer Science',
    tags: ['computing', 'apple', 'laptop']
  },
  {
    id: '3',
    name: 'Projector',
    category: 'Audio Visual',
    model: 'Epson PowerLite',
    serialNumber: 'EPS-2021-9012',
    location: 'Lecture Hall A',
    status: 'maintenance',
    imageUrl: 'https://images.pexels.com/photos/236098/pexels-photo-236098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    purchaseDate: '2021-09-05',
    lastMaintenance: '2023-05-12',
    description: '4K projector with wireless casting capabilities.',
    department: 'Media Services',
    tags: ['presentation', 'audio-visual']
  },
  {
    id: '4',
    name: 'Digital Camera',
    category: 'Photography',
    model: 'Canon EOS R5',
    serialNumber: 'CAN-2022-3456',
    location: 'Media Lab, Room 205',
    status: 'reserved',
    imageUrl: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    purchaseDate: '2022-04-18',
    lastMaintenance: '2023-03-10',
    description: 'Professional mirrorless camera with 8K video capabilities.',
    department: 'Journalism',
    tags: ['camera', 'photography', 'video']
  },
  {
    id: '5',
    name: '3D Printer',
    category: 'Manufacturing',
    model: 'Ultimaker S5',
    serialNumber: 'ULT-2023-7890',
    location: 'Engineering Lab, Room 410',
    status: 'available',
    imageUrl: 'https://images.pexels.com/photos/4393426/pexels-photo-4393426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    purchaseDate: '2023-01-05',
    lastMaintenance: '2023-06-20',
    description: 'Dual extrusion 3D printer with large build volume.',
    department: 'Mechanical Engineering',
    tags: ['3d-printing', 'manufacturing', 'prototyping']
  },
  {
    id: '6',
    name: 'VR Headset',
    category: 'Virtual Reality',
    model: 'Oculus Quest 3',
    serialNumber: 'OCU-2023-4567',
    location: 'Media Lab, Room 206',
    status: 'in-use',
    imageUrl: 'https://images.pexels.com/photos/8722326/pexels-photo-8722326.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    purchaseDate: '2023-02-28',
    lastMaintenance: null,
    description: 'Wireless VR headset for immersive learning experiences.',
    department: 'Computer Science',
    tags: ['vr', 'digital-media', 'simulation']
  }
];

export const useEquipmentStore = create<EquipmentState>((set, get) => ({
  equipment: [],
  isLoading: false,
  error: null,

  fetchEquipment: async () => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ equipment: mockEquipment, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },

  getEquipmentById: (id) => {
    return get().equipment.find(item => item.id === id);
  },

  searchEquipment: (query) => {
    const searchTerm = query.toLowerCase();
    return get().equipment.filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      item.model.toLowerCase().includes(searchTerm) ||
      item.serialNumber.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  },

  filterByStatus: (status) => {
    return get().equipment.filter(item => item.status === status);
  },

  filterByCategory: (category) => {
    return get().equipment.filter(item => item.category === category);
  },

  updateEquipmentStatus: async (id, status) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set(state => ({
        equipment: state.equipment.map(item => 
          item.id === id ? { ...item, status } : item
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

export const getStatusColor = (status: Equipment['status']) => {
  switch (status) {
    case 'available':
      return 'bg-success-500';
    case 'in-use':
      return 'bg-accent-500';
    case 'maintenance':
      return 'bg-error-500';
    case 'reserved':
      return 'bg-warning-500';
    default:
      return 'bg-gray-500';
  }
};

export const getStatusText = (status: Equipment['status']) => {
  switch (status) {
    case 'available':
      return 'Available';
    case 'in-use':
      return 'In Use';
    case 'maintenance':
      return 'Maintenance';
    case 'reserved':
      return 'Reserved';
    default:
      return 'Unknown';
  }
};

export const getTimeAgo = (dateString: string | null) => {
  if (!dateString) return 'Never';
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};