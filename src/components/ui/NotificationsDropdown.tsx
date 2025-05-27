import React, { useEffect, useRef } from 'react';
import { Bell, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'alert' | 'reminder' | 'success';
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsDropdownProps {
  onClose: () => void;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    message: '显微镜 #OLY-2023-1234 需要进行维护',
    time: '2小时前',
    read: false
  },
  {
    id: '2',
    type: 'reminder',
    message: '您预约的数码相机已获批准',
    time: '1天前',
    read: false
  },
  {
    id: '3',
    type: 'success',
    message: '笔记本电脑 #APPLE-2022-5678 已成功归还',
    time: '3天前',
    read: true
  },
  {
    id: '4',
    type: 'alert',
    message: 'VR头显 #OCU-2023-4567 已超期未归还',
    time: '5天前',
    read: true
  }
];

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-error-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-warning-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in"
      style={{ top: '100%' }}
    >
      <div className="px-4 py-2 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">通知</h3>
          <span className="text-xs font-medium bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
            {mockNotifications.filter(n => !n.read).length} 条新通知
          </span>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {mockNotifications.length > 0 ? (
          <div>
            {mockNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={`px-4 py-3 hover:bg-gray-50 transition-colors border-l-4 ${
                  notification.read ? 'border-transparent' : 'border-primary-500'
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500 text-sm">
            暂无通知
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-gray-100">
        <button className="text-xs text-primary-600 hover:text-primary-800 font-medium">
          标记所有为已读
        </button>
        <button className="text-xs text-primary-600 hover:text-primary-800 font-medium float-right">
          查看全部
        </button>
      </div>
    </div>
  );
};

export default NotificationsDropdown;