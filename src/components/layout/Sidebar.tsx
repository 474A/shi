import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, Calendar, PenTool as Tool, User, LogOut, X, Database, FileText } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, className }) => {
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: '仪表盘', icon: Home, path: '/' },
    { name: '设备管理', icon: Package, path: '/equipment' },
    { name: '预约管理', icon: Calendar, path: '/reservations' },
    { name: '维护管理', icon: Tool, path: '/maintenance' },
    { name: '个人中心', icon: User, path: '/profile' },
  ];

  const adminNavItems = [
    { name: '统计报表', icon: FileText, path: '/reports' },
    { name: '系统设置', icon: Database, path: '/system' },
  ];

  const handleLogout = () => {
    logout();
  };

  const linkClasses = ({ isActive }: { isActive: boolean }) => {
    return `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
      isActive 
        ? 'bg-primary-100 text-primary-700' 
        : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
    }`;
  };

  return (
    <div className={`w-64 flex flex-col bg-white border-r border-gray-200 ${className}`}>
      {/* Logo and close button for mobile */}
      <div className="flex items-center justify-between px-4 py-5 md:hidden">
        <div className="flex items-center">
          <Package className="h-7 w-7 text-primary-500" />
          <span className="ml-2 text-xl font-bold text-gray-900">设备管理</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Desktop logo */}
      <div className="hidden md:flex items-center px-6 py-5">
        <Package className="h-7 w-7 text-primary-500" />
        <span className="ml-2 text-xl font-bold text-gray-900">设备管理</span>
      </div>

      {/* User info */}
      <div className="flex flex-col items-center px-4 py-5 border-b border-gray-200">
        <div className="w-20 h-20 rounded-full mb-2 overflow-hidden border-2 border-primary-200">
          <img
            src={user?.avatar || 'https://images.pexels.com/photos/1699159/pexels-photo-1699159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
            alt={user?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-md font-semibold">{user?.name}</h3>
        <p className="text-xs text-gray-500 mt-1">
          {user?.role === 'admin' ? '管理员' : user?.role === 'staff' ? '教职工' : '学生'} - {user?.department}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={linkClasses}
            end={item.path === '/'}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}

        {/* Admin-only navigation items */}
        {user?.role === 'admin' && (
          <>
            <div className="pt-4 pb-2">
              <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                管理员功能
              </div>
            </div>
            
            {adminNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={linkClasses}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          退出登录
        </button>
      </div>
    </div>
  );
};

export default Sidebar;