import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="bg-primary-100 p-6 inline-flex rounded-full">
            <Search className="h-12 w-12 text-primary-500" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-3">404 - Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
          <Button 
            variant="primary"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            Go to Dashboard
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;