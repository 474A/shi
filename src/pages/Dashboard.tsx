import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Calendar, CheckCircle, Clock, Package, Settings, PenTool as Tool, TrendingUp } from 'lucide-react';
import { useEquipmentStore, Equipment } from '../store/equipmentStore';
import { useReservationStore, Reservation } from '../store/reservationStore';
import { useAuthStore } from '../store/authStore';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EquipmentCard from '../components/equipment/EquipmentCard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { equipment, isLoading: equipmentLoading, fetchEquipment } = useEquipmentStore();
  const { reservations, isLoading: reservationsLoading, fetchReservations } = useReservationStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchEquipment(), fetchReservations()]);
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchEquipment, fetchReservations]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Quick stats
  const totalEquipment = equipment.length;
  const availableEquipment = equipment.filter(item => item.status === 'available').length;
  const maintenanceEquipment = equipment.filter(item => item.status === 'maintenance').length;
  
  // For admin and staff: pending reservations that need approval
  const pendingReservations = reservations.filter(res => res.status === 'pending');
  
  // For students: their own reservations
  const userReservations = reservations.filter(res => res.userId === user?.id);
  
  // Recent equipment - available for checkout
  const recentAvailableEquipment = equipment
    .filter(item => item.status === 'available')
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}!</h2>
          <p className="text-gray-500 mt-1">Here's what's happening with your equipment today.</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button 
            variant="primary" 
            icon={<Calendar className="h-5 w-5" />}
            onClick={() => navigate('/reservations')}
          >
            Make a Reservation
          </Button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-4">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Equipment</p>
                <p className="text-2xl font-bold text-gray-900">{totalEquipment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-green-100 text-green-600 mr-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Available</p>
                <p className="text-2xl font-bold text-gray-900">{availableEquipment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Your Reservations</p>
                <p className="text-2xl font-bold text-gray-900">{userReservations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-red-100 text-red-600 mr-4">
                <Tool className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">In Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">{maintenanceEquipment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent equipment */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Available Equipment</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/equipment')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentAvailableEquipment.map(item => (
                  <EquipmentCard key={item.id} equipment={item} />
                ))}
                
                {recentAvailableEquipment.length === 0 && (
                  <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-gray-500 text-sm">No available equipment at the moment</h3>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent activity / Analytics */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>System Activity</CardTitle>
                <div className="text-sm text-gray-500">Last 30 days</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center">
                <div className="flex flex-col items-center text-center">
                  <TrendingUp className="h-12 w-12 text-primary-500 mb-2" />
                  <p className="text-gray-500 text-sm">
                    Activity charts and analytics will be displayed here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar widgets */}
        <div className="space-y-6">
          {/* Pending approvals - for admin and staff only */}
          {(user?.role === 'admin' || user?.role === 'staff') && (
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingReservations.length > 0 ? (
                  <ul className="space-y-3">
                    {pendingReservations.slice(0, 5).map((reservation) => (
                      <li key={reservation.id} className="bg-yellow-50 border border-yellow-100 rounded-md p-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">
                              {reservation.equipmentName}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Requested by {reservation.userName}
                            </p>
                            <div className="mt-2 flex space-x-2">
                              <Button variant="success" size="sm">Approve</Button>
                              <Button variant="danger" size="sm">Deny</Button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No pending approvals</p>
                  </div>
                )}
                
                {pendingReservations.length > 5 && (
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/reservations')}
                    >
                      View all ({pendingReservations.length})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Your reservations */}
          <Card>
            <CardHeader>
              <CardTitle>Your Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              {userReservations.length > 0 ? (
                <ul className="space-y-3">
                  {userReservations.slice(0, 5).map((reservation) => (
                    <li key={reservation.id} className="border-b border-gray-100 pb-3 last:border-0">
                      <p className="text-sm font-medium text-gray-800">
                        {reservation.equipmentName}
                      </p>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <p className="text-xs text-gray-500">
                          {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`mt-2 inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No reservations found</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => navigate('/reservations')}
                  >
                    Make a reservation
                  </Button>
                </div>
              )}
              
              {userReservations.length > 0 && (
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/reservations')}
                  >
                    View all reservations
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Admin settings quick access */}
          {user?.role === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    icon={<Package className="h-4 w-4 mr-1" />}
                    onClick={() => navigate('/equipment')}
                  >
                    Add Equipment
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    icon={<Tool className="h-4 w-4 mr-1" />}
                    onClick={() => navigate('/maintenance')}
                  >
                    Maintenance
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    icon={<TrendingUp className="h-4 w-4 mr-1" />}
                    onClick={() => navigate('/reports')}
                  >
                    Reports
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    icon={<Settings className="h-4 w-4 mr-1" />}
                    onClick={() => navigate('/system')}
                  >
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function for reservation status badge colors
const getStatusBadgeColor = (status: Reservation['status']) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default Dashboard;