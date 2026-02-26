export const COLORS = {
  primary: '#2563EB',      // blue-600
  primaryHover: '#1D4ED8', // blue-700
  success: '#10B981',      // green-500
  successHover: '#059669', // green-600
  danger: '#EF4444',       // red-500
  dangerHover: '#DC2626',  // red-600
  warning: '#F59E0B',      // amber-500
  warningHover: '#D97706', // amber-600
  info: '#3B82F6',         // blue-500
  gray: '#6B7280',         // gray-500
};

export const SPACING = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
};

export const ROUTES = {
  LANDING: '/',
  LOGIN: '/LoginPage',
  REGISTER: '/RegisterPage',
  
  // Student
  HOME: '/Dashboard',
  PROFILE: '/profile',
  ABOUT: '/AboutUsPage',
  
  // Faculty
  ADMIN_DASHBOARD: '/Dashboard',
  REQUEST: '/request/:id',
  DOCUMENT: '/document/:id',
  FINAL_DOCUMENT: '/finalDocument/:id',
};

export const USER_ROLES = {
  EMPLOYEE: 'Employee',
  ADMIN: 'Admin',
};

export const REQUEST_STATUS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  DENIED: 'Denied',
  FINALIZED: 'Finalized',
};

export const FILE_TYPES = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
