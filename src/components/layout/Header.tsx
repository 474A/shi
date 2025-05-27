import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import NotificationsDropdown from '../ui/NotificationsDropdown';

interface HeaderProps {
  toggleSidebar: () => void;
}

const pageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/':
      return '仪表盘';
    case '/equipment':
      return '设备目录';
    case '/reservations':
      return '预约管理';
    case '/maintenance':
      return '维护管理';
    case '/profile':
      return '个人中心';
    case '/reports':
      return '统计报表';
    case '/system':
      return '系统设置';
    default:
      if (pathname.startsWith('/equipment/')) {
        return '设备详情';
      }
      return '高校设备管理系统';
  }
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-2 md:ml-0 text-xl font-semibold text-gray-800">
              {pageTitle(location.pathname)}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="搜索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64 text-sm"
              />
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors focus:outline-none relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-error-500"></span>
              </button>
              
              {showNotifications && (
                <NotificationsDropdown onClose={() => setShowNotifications(false)} />
              )}
            </div>

            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                <img
                  src={user?.avatar || 'https://images.pexels.com/photos/1699159/pexels-photo-1699159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                  alt={user?.name || '用户'}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                {user?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;