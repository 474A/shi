import React, { useEffect, useState } from 'react';
import { useEquipmentStore, Equipment, getStatusColor } from '../store/equipmentStore';
import { useAuthStore } from '../store/authStore';
import { PenTool as Tool, Calendar, AlertTriangle, CheckCircle, Clock, Wrench, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Mock maintenance data
interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  equipmentName: string;
  date: string;
  technicianId: string;
  technicianName: string;
  type: 'preventive' | 'corrective';
  status: 'scheduled' | 'in-progress' | 'completed';
  description: string;
  notes?: string;
}

const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: '1',
    equipmentId: '1',
    equipmentName: 'Microscope',
    date: '2023-10-25T10:00:00Z',
    technicianId: '2',
    technicianName: 'Staff Member',
    type: 'preventive',
    status: 'scheduled',
    description: 'Regular 6-month maintenance check for optical alignment and cleaning'
  },
  {
    id: '2',
    equipmentId: '3',
    equipmentName: 'Projector',
    date: '2023-10-15T14:00:00Z',
    technicianId: '2',
    technicianName: 'Staff Member',
    type: 'corrective',
    status: 'in-progress',
    description: 'Fan making unusual noise, needs inspection and possible repair',
    notes: 'Initial assessment suggests dust accumulation in cooling system'
  },
  {
    id: '3',
    equipmentId: '5',
    equipmentName: '3D Printer',
    date: '2023-09-20T09:00:00Z',
    technicianId: '2',
    technicianName: 'Staff Member',
    type: 'preventive',
    status: 'completed',
    description: 'Regular maintenance and calibration check',
    notes: 'Replaced extruder nozzle and recalibrated bed'
  }
];

const Maintenance: React.FC = () => {
  const { user } = useAuthStore();
  const { equipment, isLoading: equipmentLoading, fetchEquipment } = useEquipmentStore();
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'current' | 'completed'>('current');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchEquipment();
      
      // Simulate fetching maintenance records from API
      await new Promise(resolve => setTimeout(resolve, 800));
      setMaintenanceRecords(mockMaintenanceRecords);
      
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchEquipment]);

  // Equipment that needs maintenance
  const maintenanceEquipment = equipment.filter(item => item.status === 'maintenance');
  
  // Filter maintenance records based on tab
  const filteredRecords = maintenanceRecords.filter(record => {
    if (activeTab === 'upcoming') return record.status === 'scheduled';
    if (activeTab === 'current') return record.status === 'in-progress';
    if (activeTab === 'completed') return record.status === 'completed';
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Maintenance</h1>
          <p className="text-gray-500">Track and schedule equipment maintenance</p>
        </div>
        
        {(user?.role === 'admin' || user?.role === 'staff') && (
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            className="mt-4 md:mt-0"
            onClick={() => {/* Navigate to create maintenance form */}}
          >
            Schedule Maintenance
          </Button>
        )}
      </div>
      
      {/* Maintenance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {maintenanceRecords.filter(r => r.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-4">
                <Tool className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {maintenanceRecords.filter(r => r.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-green-100 text-green-600 mr-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {maintenanceRecords.filter(r => r.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Maintenance Records */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="bg-white rounded-t-lg border border-gray-200 border-b-0">
            <div className="flex">
              <button
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'current'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('current')}
              >
                In Progress
              </button>
              
              <button
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'upcoming'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming
              </button>
              
              <button
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'completed'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('completed')}
              >
                Completed
              </button>
            </div>
          </div>
          
          <Card className="rounded-t-none">
            <CardContent className="p-0">
              {filteredRecords.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {filteredRecords.map((record) => (
                    <li key={record.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">
                            {record.equipmentName}
                          </h3>
                          
                          <div className="flex flex-wrap gap-4 mt-2">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" /> 
                              {new Date(record.date).toLocaleDateString()}
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500">
                              <Wrench className="h-4 w-4 mr-1 text-gray-400" /> 
                              {record.type === 'preventive' ? 'Preventive' : 'Corrective'}
                            </div>
                          </div>
                          
                          <p className="mt-2 text-sm text-gray-600">
                            {record.description}
                          </p>
                          
                          {record.notes && (
                            <p className="mt-2 text-xs text-gray-500 italic">
                              Note: {record.notes}
                            </p>
                          )}
                        </div>
                        
                        <div className="mt-4 md:mt-0">
                          <Badge
                            variant={
                              record.status === 'completed' ? 'success' : 
                              record.status === 'in-progress' ? 'primary' : 'warning'
                            }
                            size="md"
                            className="mb-2 md:mb-0"
                          >
                            {record.status === 'in-progress' ? 'In Progress' : 
                             record.status === 'scheduled' ? 'Scheduled' : 'Completed'}
                          </Badge>
                          
                          {(user?.role === 'admin' || user?.role === 'staff') && record.status !== 'completed' && (
                            <div className="flex space-x-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                Update
                              </Button>
                              {record.status === 'in-progress' && (
                                <Button
                                  variant="success"
                                  size="sm"
                                >
                                  Complete
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    {activeTab === 'current' ? (
                      <Tool className="h-8 w-8 text-gray-400" />
                    ) : activeTab === 'upcoming' ? (
                      <Calendar className="h-8 w-8 text-gray-400" />
                    ) : (
                      <CheckCircle className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-gray-500 text-md">
                    {activeTab === 'current'
                      ? 'No maintenance currently in progress'
                      : activeTab === 'upcoming'
                      ? 'No upcoming maintenance scheduled'
                      : 'No completed maintenance records'}
                  </h3>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Equipment in maintenance */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <CardTitle>Equipment in Maintenance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {maintenanceEquipment.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {maintenanceEquipment.map((item) => (
                    <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{item.model}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className={`${getStatusColor(item.status)} h-2 w-2 rounded-full`}></div>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.lastMaintenance 
                              ? new Date(item.lastMaintenance).toLocaleDateString() 
                              : 'Not yet maintained'}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No equipment currently in maintenance</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {(user?.role === 'admin' || user?.role === 'staff') && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Maintenance Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-yellow-500 pl-4 py-1">
                    <p className="text-sm font-medium">3 equipment due for maintenance this month</p>
                    <p className="text-xs text-gray-500 mt-1">Schedule preventive maintenance to avoid equipment failure</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      icon={<Calendar className="h-4 w-4" />}
                    >
                      View Schedule
                    </Button>
                  </div>
                  
                  <div className="border-l-2 border-primary-500 pl-4 py-1">
                    <p className="text-sm font-medium">Weekly maintenance report</p>
                    <p className="text-xs text-gray-500 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                    >
                      Download Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Maintenance;