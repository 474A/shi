import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, LayoutGrid, List } from 'lucide-react';
import { useEquipmentStore, Equipment } from '../store/equipmentStore';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import EquipmentFilters, { FilterState } from '../components/equipment/EquipmentFilters';
import EquipmentGrid from '../components/equipment/EquipmentGrid';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const EquipmentPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { equipment, isLoading, error, fetchEquipment } = useEquipmentStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    category: [],
    department: [],
  });
  
  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  // Apply filters and search
  const filteredEquipment = equipment.filter(item => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matches = 
        item.name.toLowerCase().includes(query) ||
        item.model.toLowerCase().includes(query) ||
        item.serialNumber.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query));
        
      if (!matches) return false;
    }
    
    // Apply status filter
    if (filters.status.length > 0 && !filters.status.includes(item.status)) {
      return false;
    }
    
    // Apply category filter
    if (filters.category.length > 0 && !filters.category.includes(item.category)) {
      return false;
    }
    
    // Apply department filter
    if (filters.department.length > 0 && !filters.department.includes(item.department)) {
      return false;
    }
    
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Equipment Catalog</h1>
          <p className="text-gray-500">Browse and manage university equipment</p>
        </div>
        
        {(user?.role === 'admin' || user?.role === 'staff') && (
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            className="mt-4 md:mt-0"
            onClick={() => navigate('/equipment/add')}
          >
            Add New Equipment
          </Button>
        )}
      </div>
      
      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search equipment by name, model, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              icon={<LayoutGrid className="h-4 w-4" />}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            />
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              icon={<List className="h-4 w-4" />}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            />
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <EquipmentFilters onFilterChange={setFilters} />
      
      {/* Equipment grid/list */}
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <p>{error}</p>
        </div>
      ) : (
        <EquipmentGrid 
          equipment={filteredEquipment} 
          isLoading={isLoading} 
          emptyMessage={
            searchQuery 
              ? `No equipment found matching "${searchQuery}". Try different search terms.` 
              : "No equipment found with the selected filters."
          }
        />
      )}
    </div>
  );
};

export default EquipmentPage;