import React from 'react';
import EquipmentCard from './EquipmentCard';
import { Equipment } from '../../store/equipmentStore';
import LoadingSpinner from '../ui/LoadingSpinner';

interface EquipmentGridProps {
  equipment: Equipment[];
  isLoading: boolean;
  emptyMessage?: string;
}

const EquipmentGrid: React.FC<EquipmentGridProps> = ({ 
  equipment, 
  isLoading,
  emptyMessage = "未找到设备。请尝试调整筛选条件。"
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (equipment.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <img 
          src="https://images.pexels.com/photos/7241418/pexels-photo-7241418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="没有设备" 
          className="w-32 h-32 object-cover rounded-full mb-4 opacity-50"
        />
        <p className="text-gray-500 mb-2">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {equipment.map((item) => (
        <EquipmentCard key={item.id} equipment={item} />
      ))}
    </div>
  );
};

export default EquipmentGrid;