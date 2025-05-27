import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Equipment, getStatusText, getTimeAgo, getStatusColor } from '../../store/equipmentStore';

interface EquipmentCardProps {
  equipment: Equipment;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment }) => {
  return (
    <Link to={`/equipment/${equipment.id}`} className="block group">
      <Card hover className="h-full flex flex-col">
        <div className="relative aspect-video mb-3 overflow-hidden rounded-md bg-gray-100">
          <img 
            src={equipment.imageUrl} 
            alt={equipment.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className={`absolute top-2 right-2 ${getStatusColor(equipment.status)} text-white text-xs font-medium px-2 py-1 rounded-md`}>
            {getStatusText(equipment.status)}
          </div>
        </div>
        
        <div className="flex flex-col flex-1">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
            {equipment.name}
          </h3>
          
          <div className="text-sm text-gray-600 mb-2">
            {equipment.model} • {equipment.serialNumber}
          </div>
          
          <div className="text-sm text-gray-600 mb-1 flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-400" /> 
            <span>Purchased: {new Date(equipment.purchaseDate).toLocaleDateString()}</span>
          </div>
          
          <div className="text-sm text-gray-600 mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-400" /> 
            <span>Last Maintenance: {getTimeAgo(equipment.lastMaintenance)}</span>
          </div>
          
          <div className="mt-auto pt-3 flex flex-wrap gap-1">
            {equipment.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="gray" size="sm" rounded>
                <Tag className="h-3 w-3 mr-1" /> {tag}
              </Badge>
            ))}
            {equipment.tags.length > 3 && (
              <Badge variant="gray" size="sm" rounded>+{equipment.tags.length - 3} more</Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default EquipmentCard;