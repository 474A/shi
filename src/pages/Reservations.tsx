import React, { useEffect, useState } from 'react';
import { useReservationStore, Reservation, getStatusColor, getStatusBadge } from '../store/reservationStore';
import { useAuthStore } from '../store/authStore';
import { Calendar, Filter, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';

const Reservations: React.FC = () => {
  const { user } = useAuthStore();
  const { reservations, isLoading, fetchReservations } = useReservationStore();
  
  const [activeTab, setActiveTab] = useState<'all' | 'mine' | 'pending'>(
    user?.role === 'student' ? 'mine' : 'pending'
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Filter reservations based on active tab and status
  const filteredReservations = reservations.filter(res => {
    // Tab filter
    if (activeTab === 'mine' && res.userId !== user?.id) {
      return false;
    }
    
    if (activeTab === 'pending' && res.status !== 'pending') {
      return false;
    }
    
    // Status filter
    if (statusFilter !== 'all' && res.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  // Group reservations by date for better organization
  const groupedReservations: Record<string, Reservation[]> = {};
  
  filteredReservations.forEach(res => {
    const date = new Date(res.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    if (!groupedReservations[date]) {
      groupedReservations[date] = [];
    }
    
    groupedReservations[date].push(res);
  });
  
  const sortedDates = Object.keys(groupedReservations).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

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
          <h1 className="text-2xl font-bold text-gray-800">Reservations</h1>
          <p className="text-gray-500">Manage equipment reservations and requests</p>
        </div>
        
        <Button
          variant="primary"
          icon={<Plus className="h-4 w-4" />}
          className="mt-4 md:mt-0"
          onClick={() => {/* Navigate to equipment list to make a reservation */}}
        >
          Make Reservation
        </Button>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-3 px-4 text-sm font-medium ${
            activeTab === 'all'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All Reservations
        </button>
        
        <button
          className={`py-3 px-4 text-sm font-medium ${
            activeTab === 'mine'
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('mine')}
        >
          My Reservations
        </button>
        
        {(user?.role === 'admin' || user?.role === 'staff') && (
          <button
            className={`py-3 px-4 text-sm font-medium ${
              activeTab === 'pending'
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Approval
          </button>
        )}
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-700 mr-4">Filter by status:</span>
          
          <div className="flex flex-wrap gap-2">
            <button
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                statusFilter === 'all'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                statusFilter === 'pending'
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
              }`}
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </button>
            <button
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                statusFilter === 'approved'
                  ? 'bg-green-200 text-green-800'
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
              onClick={() => setStatusFilter('approved')}
            >
              Approved
            </button>
            <button
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                statusFilter === 'rejected'
                  ? 'bg-red-200 text-red-800'
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              }`}
              onClick={() => setStatusFilter('rejected')}
            >
              Rejected
            </button>
            <button
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                statusFilter === 'completed'
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
              onClick={() => setStatusFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>
      </div>
      
      {/* Reservations list */}
      {sortedDates.length > 0 ? (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <Card key={date}>
              <CardHeader>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <CardTitle>{date}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {groupedReservations[date].map(reservation => (
                    <li key={reservation.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">
                            {reservation.equipmentName}
                          </h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" /> 
                            {new Date(reservation.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(reservation.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                            {reservation.purpose}
                          </p>
                        </div>
                        
                        <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                          <Badge
                            variant={
                              reservation.status === 'approved' ? 'success' : 
                              reservation.status === 'pending' ? 'warning' : 
                              reservation.status === 'rejected' ? 'danger' : 'primary'
                            }
                            size="md"
                            className="mb-2"
                          >
                            {getStatusBadge(reservation.status)}
                          </Badge>
                          
                          <p className="text-xs text-gray-500">
                            {reservation.userId === user?.id 
                              ? 'You requested this reservation' 
                              : `Requested by ${reservation.userName}`}
                          </p>
                          
                          {/* Actions for admins/staff */}
                          {(user?.role === 'admin' || user?.role === 'staff') && 
                           reservation.status === 'pending' && (
                            <div className="flex space-x-2 mt-2">
                              <Button variant="success" size="sm">
                                Approve
                              </Button>
                              <Button variant="danger" size="sm">
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No reservations found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {activeTab === 'mine'
              ? "You haven't made any reservations yet. Browse our equipment catalog to reserve items."
              : activeTab === 'pending'
              ? "There are no pending reservation requests that need approval."
              : "No reservations match your current filter. Try changing your filter criteria."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Reservations;