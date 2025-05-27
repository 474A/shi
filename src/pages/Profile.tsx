import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useReservationStore } from '../store/reservationStore';
import { Mail, User, Building, Key, Shield, Calendar, CheckCircle, X } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const { reservations } = useReservationStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const userReservations = reservations.filter(res => res.userId === user?.id);
  const activeReservations = userReservations.filter(res => 
    res.status === 'approved' || res.status === 'pending'
  );
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Simulate saving changes
      toast.success('Profile updated successfully');
    }
    setIsEditing(!isEditing);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    // Simulate password change
    toast.success('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Profile header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
        <div className="px-6 py-4 md:flex md:items-center md:justify-between relative">
          <div className="flex md:block">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md absolute -top-12 md:relative md:top-0">
              <img 
                src={user?.avatar || 'https://images.pexels.com/photos/1699159/pexels-photo-1699159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                alt={user?.name} 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="ml-28 md:ml-0 md:mt-4">
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <div className="flex items-center mt-1">
                <Badge 
                  variant={
                    user?.role === 'admin' ? 'primary' :
                    user?.role === 'staff' ? 'secondary' : 
                    'info'
                  }
                  size="sm"
                >
                  {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              icon={isEditing ? <CheckCircle className="h-4 w-4" /> : <User className="h-4 w-4" />}
              onClick={handleEditToggle}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-gray-900">{user?.name}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-gray-900">{user?.email}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.department}
                        onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-gray-900">{user?.department}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Role (non-editable) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-gray-900 capitalize">{user?.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Password Change */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter your current password"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter new password"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={!currentPassword || !newPassword || !confirmPassword}
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Reservations */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary-500 mr-2" />
                <CardTitle>Active Reservations</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {activeReservations.length > 0 ? (
                <ul className="space-y-3">
                  {activeReservations.map(reservation => (
                    <li key={reservation.id} className="bg-gray-50 rounded-md p-3">
                      <h4 className="font-medium text-gray-800">{reservation.equipmentName}</h4>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                      </div>
                      <div className="mt-2">
                        <Badge 
                          variant={reservation.status === 'approved' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {reservation.status === 'approved' ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No active reservations</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-primary-500 mr-2" />
                <CardTitle>Account Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm">Email Notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm">Two-Factor Authentication</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Account Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary-500 mr-2" />
                <CardTitle>Recent Activity</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="text-sm">
                  <div className="flex">
                    <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 mr-2"></div>
                    <div>
                      <p className="text-gray-800">You reserved Microscope</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                </li>
                <li className="text-sm">
                  <div className="flex">
                    <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 mr-2"></div>
                    <div>
                      <p className="text-gray-800">You returned 3D Printer</p>
                      <p className="text-xs text-gray-500">5 days ago</p>
                    </div>
                  </div>
                </li>
                <li className="text-sm">
                  <div className="flex">
                    <div className="w-1 h-1 rounded-full bg-primary-500 mt-2 mr-2"></div>
                    <div>
                      <p className="text-gray-800">Profile information updated</p>
                      <p className="text-xs text-gray-500">2 weeks ago</p>
                    </div>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;