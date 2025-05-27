import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import Button from '../ui/Button';

interface EquipmentFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  status: string[];
  category: string[];
  department: string[];
}

const EquipmentFilters: React.FC<EquipmentFiltersProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    category: [],
    department: [],
  });

  const statuses = ['available', 'in-use', 'maintenance', 'reserved'];
  const categories = ['实验设备', '计算机设备', '视听设备', '摄影器材', '制造设备', '虚拟现实'];
  const departments = ['生物系', '计算机系', '工程系', '媒体部', '新闻系', '机械工程'];

  const handleStatusChange = (status: string) => {
    setFilters(prev => {
      const newStatuses = prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status];
        
      return { ...prev, status: newStatuses };
    });
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => {
      const newCategories = prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category];
        
      return { ...prev, category: newCategories };
    });
  };

  const handleDepartmentChange = (department: string) => {
    setFilters(prev => {
      const newDepartments = prev.department.includes(department)
        ? prev.department.filter(d => d !== department)
        : [...prev.department, department];
        
      return { ...prev, department: newDepartments };
    });
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      category: [],
      department: [],
    });
  };

  const applyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const hasActiveFilters = () => {
    return filters.status.length > 0 || filters.category.length > 0 || filters.department.length > 0;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return '可用';
      case 'in-use':
        return '使用中';
      case 'maintenance':
        return '维护中';
      case 'reserved':
        return '已预约';
      default:
        return status;
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <Button 
          variant={hasActiveFilters() ? "primary" : "outline"}
          size="sm"
          icon={<Filter className="h-4 w-4" />}
          onClick={() => setIsOpen(!isOpen)}
        >
          {hasActiveFilters() ? `筛选 (${filters.status.length + filters.category.length + filters.department.length})` : "筛选"}
        </Button>
        
        {hasActiveFilters() && (
          <button 
            onClick={clearFilters} 
            className="text-sm text-gray-500 hover:text-gray-700 ml-2"
          >
            清除全部
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-4 p-4 bg-white border rounded-lg shadow-sm animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">筛选条件</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status filter */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">状态</h4>
              <div className="space-y-2">
                {statuses.map(status => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => handleStatusChange(status)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                    />
                    <span className="ml-2 text-gray-700">{getStatusText(status)}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Category filter */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">类别</h4>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                    />
                    <span className="ml-2 text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Department filter */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">部门</h4>
              <div className="space-y-2">
                {departments.map(department => (
                  <label key={department} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.department.includes(department)}
                      onChange={() => handleDepartmentChange(department)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                    />
                    <span className="ml-2 text-gray-700">{department}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button variant="outline" size="sm" className="mr-2" onClick={() => setIsOpen(false)}>
              取消
            </Button>
            <Button variant="primary" size="sm" onClick={applyFilters}>
              应用筛选
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentFilters;