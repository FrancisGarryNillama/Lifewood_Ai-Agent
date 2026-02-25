import React, { useState } from 'react';
import { LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoginModal, RegisterModal } from './AuthModal';
import { useAuthContext } from '../../../context';

export default function AuthButtons() {
  const { isAuthenticated, user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleRegisterSuccess = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const handleDashboardClick = () => {
    navigate('/Dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2 sm:gap-4">
        {/* User Info */}
        <div className="hidden sm:flex flex-col items-end mr-1">
          <span className="text-sm font-bold text-gray-800 leading-tight">
            {user?.username || user?.name || 'User'}
          </span>
        </div>

        {/* Dashboard Button */}
        <button
          onClick={handleDashboardClick}
          className="bg-gradient-to-r from-lifewood-castletonGreen to-lifewood-darkSerpent text-white p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-lifewood-castletonGreen/25 transition-all group"
          title="Go to Dashboard"
        >
          <LayoutDashboard className="h-5 w-5 transition-transform group-hover:scale-110" />
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-100 hover:bg-red-50 p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all"
          title="Sign Out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
        {/* Login Button - Responsive */}
        <button
          onClick={() => setIsLoginOpen(true)}
          className="text-gray-700 hover:text-lifewood-castletonGreen px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg font-medium flex items-center gap-1 sm:gap-2 transition-colors"
        >
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline text-sm md:text-base">Log In</span>
        </button>

        {/* Sign Up Button - Responsive */}
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="bg-gradient-to-r from-lifewood-castletonGreen to-lifewood-darkSerpent text-white px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-lg sm:rounded-xl font-medium flex items-center gap-1 sm:gap-2 hover:shadow-lg hover:shadow-lifewood-castletonGreen/25 transition-all text-sm md:text-base"
        >
          <UserPlus className="h-4 w-4" />
          <span className="hidden xs:inline sm:inline">Request Account</span>
        </button>
      </div>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleRegisterSuccess}
      />
    </>
  );
}