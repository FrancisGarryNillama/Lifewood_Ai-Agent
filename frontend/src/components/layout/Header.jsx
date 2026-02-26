import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Menu, User, Bell, UserCheck, UserX, X, Building2, Mail, Phone, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { useAuthContext, USER_ROLES } from '../../context';

const STATIC_PENDING_REQUESTS = [
  {
    accountID: 'emp-demo-001',
    accountPass: 'demo123',
    confirmPass: 'demo123',
    fullName: 'Juan Dela Cruz',
    department: 'Operations',
    email: 'juan.delacruz@lifewood.com',
    phone: '09172223333',
    address: 'Manila, Philippines',
    dateOfBirth: '1996-05-12',
    status: 'pending',
    requestedAt: '2026-02-25T08:00:00.000Z',
  },
  {
    accountID: 'emp-demo-002',
    accountPass: 'demo123',
    confirmPass: 'demo123',
    fullName: 'Maria Santos',
    department: 'Finance',
    email: 'maria.santos@lifewood.com',
    phone: '09173334444',
    address: 'Quezon City, Philippines',
    dateOfBirth: '1994-09-18',
    status: 'pending',
    requestedAt: '2026-02-25T08:10:00.000Z',
  },
  {
    accountID: 'emp-demo-003',
    accountPass: 'demo123',
    confirmPass: 'demo123',
    fullName: 'Carlo Reyes',
    department: 'IT',
    email: 'carlo.reyes@lifewood.com',
    phone: '09174445555',
    address: 'Pasig, Philippines',
    dateOfBirth: '1993-07-03',
    status: 'pending',
    requestedAt: '2026-02-25T08:20:00.000Z',
  },
  {
    accountID: 'emp-demo-004',
    accountPass: 'demo123',
    confirmPass: 'demo123',
    fullName: 'Ana Gomez',
    department: 'HR',
    email: 'ana.gomez@lifewood.com',
    phone: '09175556666',
    address: 'Makati, Philippines',
    dateOfBirth: '1995-01-27',
    status: 'pending',
    requestedAt: '2026-02-25T08:30:00.000Z',
  },
  {
    accountID: 'emp-demo-005',
    accountPass: 'demo123',
    confirmPass: 'demo123',
    fullName: 'Luis Mendoza',
    department: 'Procurement',
    email: 'luis.mendoza@lifewood.com',
    phone: '09176667777',
    address: 'Taguig, Philippines',
    dateOfBirth: '1992-11-14',
    status: 'pending',
    requestedAt: '2026-02-25T08:40:00.000Z',
  },
];

// ─── Request Detail Modal ────────────────────────────────────────────────────
function RequestDetailModal({ request, onClose, onApprove, onReject }) {
  if (!request) return null;

  const fields = [
    { icon: User, label: 'Full Name', value: request.fullName },
    { icon: User, label: 'Account ID', value: request.accountID },
    { icon: User, label: 'Password', value: request.accountPass },
    { icon: User, label: 'Confirm Password', value: request.confirmPass },
    { icon: Building2, label: 'Department', value: request.department },
    { icon: Mail, label: 'Email', value: request.email },
    { icon: Phone, label: 'Phone', value: request.phone },
    { icon: MapPin, label: 'Address', value: request.address },
    { icon: Calendar, label: 'Date of Birth', value: request.dateOfBirth },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-lifewood-castletonGreen to-lifewood-darkSerpent p-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Account Request</h2>
            <p className="text-xs text-white/70 mt-0.5">Review employee information</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fields */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {fields.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="p-2 bg-lifewood-seaSalt rounded-lg shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-lifewood-castletonGreen" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value || '—'}</p>
              </div>
            </div>
          ))}
          <div className="pt-1">
            <p className="text-xs text-gray-400 font-medium">Requested On</p>
            <p className="text-sm text-gray-600">{new Date(request.requestedAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button
            onClick={() => { onReject(request); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm border border-red-200 transition-all"
          >
            <UserX className="w-4 h-4" /> Reject
          </button>
          <button
            onClick={() => { onApprove(request); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-lifewood-castletonGreen hover:bg-lifewood-darkSerpent text-white font-semibold text-sm transition-all"
          >
            <UserCheck className="w-4 h-4" /> Approve
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Notification Bell (Admin only) ─────────────────────────────────────────
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState([]);
  const [selected, setSelected] = useState(null);
  const dropdownRef = useRef(null);

  const loadPending = useCallback(() => {
    const all = JSON.parse(localStorage.getItem('pendingAccountRequests') || '[]');
    const realPending = all.filter(r => r.status === 'pending');
    const staticIds = new Set(STATIC_PENDING_REQUESTS.map((req) => req.accountID));
    const withoutStaticDuplicate = realPending.filter((r) => !staticIds.has(r.accountID));
    setPending([...STATIC_PENDING_REQUESTS, ...withoutStaticDuplicate]);
  }, []);

  useEffect(() => {
    loadPending();
    // Refresh every 10 seconds
    const interval = setInterval(loadPending, 10000);
    return () => clearInterval(interval);
  }, [loadPending]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleApprove = (req) => {
    const approved = JSON.parse(localStorage.getItem('approvedAccounts') || '[]');
    approved.push({ ...req, status: 'approved', approvedAt: new Date().toISOString() });
    localStorage.setItem('approvedAccounts', JSON.stringify(approved));

    const all = JSON.parse(localStorage.getItem('pendingAccountRequests') || '[]');
    localStorage.setItem('pendingAccountRequests',
      JSON.stringify(all.map(r => r.accountID === req.accountID ? { ...r, status: 'approved' } : r))
    );
    loadPending();
  };

  const handleReject = (req) => {
    const all = JSON.parse(localStorage.getItem('pendingAccountRequests') || '[]');
    localStorage.setItem('pendingAccountRequests',
      JSON.stringify(all.map(r => r.accountID === req.accountID ? { ...r, status: 'rejected' } : r))
    );
    loadPending();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => { setOpen(!open); loadPending(); }}
        className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
        {pending.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-lifewood-saffaron text-[10px] font-bold text-lifewood-darkSerpent">
            {pending.length > 9 ? '9+' : pending.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* Dropdown header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">Account Requests</span>
            <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
              {pending.length} pending
            </span>
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto">
            {pending.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                No pending requests
              </div>
            ) : (
              pending.map((req) => (
                <button
                  key={req.accountID}
                  onClick={() => { setSelected(req); setOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-lifewood-seaSalt/50 transition-colors text-left border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lifewood-castletonGreen to-lifewood-darkSerpent flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-white">
                        {req.fullName?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{req.fullName}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <RequestDetailModal
          request={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

// ─── Main Header ─────────────────────────────────────────────────────────────
export default function Header({ toggleSidebar, userName }) {
  const { user } = useAuthContext();
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  return (
    <header className="sticky top-0 z-30 bg-lifewood-darkSerpent shadow-lifewood-lg">
      {/* Gold gradient accent bar */}
      <div className="h-[3px] bg-gradient-to-r from-lifewood-goldenBrown via-lifewood-saffaron to-lifewood-earthYellow" />

      <div className="h-[53px] px-4 sm:px-6 flex items-center justify-between">

        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="group p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10
                       transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lifewood-saffaron/50"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <img
              src="/lifewood-logo.png"
              alt="Lifewood"
              className="h-7 sm:h-8 w-auto object-contain brightness-0 invert"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-white font-bold text-sm leading-tight tracking-wide">LIFEWOOD AI</span>
              <span className="text-white/40 text-[10px] leading-tight tracking-widest uppercase">Document Portal</span>
            </div>
          </div>
        </div>

        {/* Right: Notif Bell + User */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Admin-only notification bell */}
          {isAdmin && <NotificationBell />}

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-white/15" />

          {/* User avatar + info */}
          <div className="flex items-center gap-2.5">
            {/* Avatar circle */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-lifewood-saffaron to-lifewood-goldenBrown
                            flex items-center justify-center shadow-gold shrink-0">
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-lifewood-darkSerpent" />
            </div>

            {/* Username + role */}
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-white text-sm font-semibold leading-tight truncate max-w-[140px]">
                {userName || 'Guest'}
              </span>
              {user?.role && (
                <span className={`text-[10px] font-bold px-1.5 py-px rounded-md mt-0.5 tracking-wide uppercase ${
                  isAdmin
                    ? 'bg-lifewood-saffaron/20 text-lifewood-saffaron'
                    : 'bg-lifewood-fernGreen/30 text-lifewood-iceGreen'
                }`}>
                  {user.role}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
