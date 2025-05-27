import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Tag, PenTool as Tool, AlertTriangle, Edit, ChevronLeft, Share2, Printer, Info } from 'lucide-react';
import { useEquipmentStore, getStatusColor, getTimeAgo } from '../store/equipmentStore';
import { useReservationStore } from '../store/reservationStore';
import { useAuthStore } from '../store/authStore';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const EquipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getEquipmentById, updateEquipmentStatus } = useEquipmentStore();
  const { getReservationsByEquipmentId, createReservation } = useReservationStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [equipment, setEquipment] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reservationDates, setReservationDates] = useState({
    startDate: '',
    endDate: '',
    purpose: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      const equipmentData = getEquipmentById(id);
      const reservationsData = getReservationsByEquipmentId(id);
      
      if (equipmentData) {
        setEquipment(equipmentData);
        setReservations(reservationsData);
      } else {
        toast.error('Equipment not found');
        navigate('/equipment');
      }
      
      setIsLoading(false);
    };
    
    fetchData();
  }, [id, getEquipmentById, getReservationsByEquipmentId, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Equipment Not Found</h2>
        <p className="text-gray-500 mb-6">The equipment you're looking for doesn't exist or has been removed.</p>
        <Button variant="primary" onClick={() => navigate('/equipment')}>
          Return to Equipment List
        </Button>
      </div>
    );
  }

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      await createReservation({
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        userId: user.id,
        userName: user.name,
        startDate: reservationDates.startDate,
        endDate: reservationDates.endDate,
        status: 'pending',
        purpose: reservationDates.purpose
      });
      
      toast.success('Reservation request submitted');
      setShowReserveModal(false);
      // Refresh reservations
      const updatedReservations = getReservationsByEquipmentId(equipment.id);
      setReservations(updatedReservations);
      
    } catch (error) {
      toast.error('Failed to submit reservation');
    }
  };

  const handleStatusChange = async (newStatus: 'available' | 'in-use' | 'maintenance' | 'reserved') => {
    try {
      await updateEquipmentStatus(equipment.id, newStatus);
      setEquipment({ ...equipment, status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Back button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4"
        icon={<ChevronLeft className="h-4 w-4" />}
        onClick={() => navigate('/equipment')}
      >
        Back to Equipment
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main info card */}
          <Card>
            <CardContent className="p-0">
              <div className="relative aspect-video md:aspect-[16/9] overflow-hidden rounded-t-lg">
                <img 
                  src={equipment.imageUrl} 
                  alt={equipment.name} 
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-4 right-4 ${getStatusColor(equipment.status)} text-white text-sm font-medium px-3 py-1 rounded-full`}>
                  {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1).replace('-', ' ')}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">{equipment.name}</h1>
                  
                  <div className="flex space-x-2">
                    {(user?.role === 'admin' || user?.role === 'staff') && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Edit className="h-4 w-4" />}
                        onClick={() => navigate(`/equipment/${equipment.id}/edit`)}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Share2 className="h-4 w-4" />}
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('Link copied to clipboard');
                      }}
                    >
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Printer className="h-4 w-4" />}
                      onClick={() => window.print()}
                    >
                      Print
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 mb-6">
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Model</p>
                      <p className="font-medium">{equipment.model}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Info className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Serial Number</p>
                      <p className="font-medium">{equipment.serialNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium">{equipment.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Purchase Date</p>
                      <p className="font-medium">{new Date(equipment.purchaseDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-md font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{equipment.description}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-md font-semibold mb-2">Department</h3>
                  <Badge variant="secondary" size="md">
                    {equipment.department}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="text-md font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {equipment.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="gray" size="sm" rounded>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Maintenance history */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardContent>
              {equipment.lastMaintenance ? (
                <div className="border-l-2 border-secondary-500 pl-4">
                  <p className="text-sm font-medium">Last maintenance performed {getTimeAgo(equipment.lastMaintenance)}</p>
                  <p className="text-xs text-gray-500 mt-1">Regular maintenance schedule: Every 6 months</p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Tool className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No maintenance records found</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {(user?.role === 'admin' || user?.role === 'staff') && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  icon={<Tool className="h-4 w-4" />}
                  onClick={() => navigate(`/maintenance/new?equipmentId=${equipment.id}`)}
                >
                  Schedule Maintenance
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions card */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipment.status === 'available' ? (
                  <Button 
                    variant="primary" 
                    size="md" 
                    fullWidth 
                    icon={<Calendar className="h-4 w-4" />}
                    onClick={() => setShowReserveModal(true)}
                  >
                    Reserve Equipment
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="md" 
                    fullWidth 
                    disabled
                  >
                    Not Available for Reservation
                  </Button>
                )}
                
                {/* Admin/Staff only actions */}
                {(user?.role === 'admin' || user?.role === 'staff') && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-3">Change Equipment Status:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={equipment.status === 'available' ? 'success' : 'outline'}
                        size="sm"
                        disabled={equipment.status === 'available'}
                        onClick={() => handleStatusChange('available')}
                      >
                        Available
                      </Button>
                      <Button
                        variant={equipment.status === 'in-use' ? 'primary' : 'outline'}
                        size="sm"
                        disabled={equipment.status === 'in-use'}
                        onClick={() => handleStatusChange('in-use')}
                      >
                        In Use
                      </Button>
                      <Button
                        variant={equipment.status === 'maintenance' ? 'danger' : 'outline'}
                        size="sm"
                        disabled={equipment.status === 'maintenance'}
                        onClick={() => handleStatusChange('maintenance')}
                      >
                        Maintenance
                      </Button>
                      <Button
                        variant={equipment.status === 'reserved' ? 'warning' : 'outline'}
                        size="sm"
                        disabled={equipment.status === 'reserved'}
                        onClick={() => handleStatusChange('reserved')}
                      >
                        Reserved
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Reservations */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              {reservations.length > 0 ? (
                <ul className="space-y-3">
                  {reservations.map((res) => (
                    <li key={res.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">{res.userName}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(res.startDate).toLocaleDateString()} - {new Date(res.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            res.status === 'approved' ? 'success' : 
                            res.status === 'pending' ? 'warning' : 
                            res.status === 'rejected' ? 'danger' : 'primary'
                          }
                          size="sm"
                        >
                          {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No upcoming reservations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Reservation Modal */}
      {showReserveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">Reserve {equipment.name}</h3>
              <button 
                onClick={() => setShowReserveModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleReservationSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    value={reservationDates.startDate}
                    onChange={(e) => setReservationDates({...reservationDates, startDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    value={reservationDates.endDate}
                    onChange={(e) => setReservationDates({...reservationDates, endDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose
                  </label>
                  <textarea
                    value={reservationDates.purpose}
                    onChange={(e) => setReservationDates({...reservationDates, purpose: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Briefly describe why you need this equipment..."
                    required
                  />
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Important Information
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Your reservation request will need approval before being finalized. You'll receive a notification once approved.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowReserveModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Mock X component (included for the modal close button)
const X: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);

export default EquipmentDetail;