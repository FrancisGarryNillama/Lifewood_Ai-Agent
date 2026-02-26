import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Save } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import ProfileForm from './ProfileForm';

export default function ProfilePanel({ userId, userRole, isOpen, onClose, onSaveSuccess }) {
  const { profile, updateProfile, saveProfile, loading, profileExists } = useProfile(userId, userRole);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleSave = async () => {
    const success = await saveProfile();
    if (success) {
      if (onSaveSuccess) onSaveSuccess();
      setTimeout(() => onClose(), 1500);
    }
  };

  if (!isOpen) return null;

  // Avatar initials from userId
  const initials = (userId || 'U').slice(0, 2).toUpperCase();

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden
                   flex flex-col max-h-[95vh] border border-lifewood-platinum/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="relative bg-lifewood-darkSerpent px-6 py-5 flex items-center gap-4 shrink-0">
          {/* gold shimmer bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-lifewood-goldenBrown via-lifewood-saffaron to-lifewood-earthYellow" />

          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lifewood-saffaron to-lifewood-goldenBrown
                          flex items-center justify-center shadow-gold shrink-0">
            <span className="text-lifewood-darkSerpent font-extrabold text-lg leading-none">{initials}</span>
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-lg leading-tight">
              {profileExists ? 'Edit Profile' : 'Create Profile'}
            </h2>
            <p className="text-white/45 text-xs mt-0.5 truncate">
              {userId ? `@${userId}` : 'Complete your Lifewood profile'}
            </p>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          <ProfileForm
            profile={profile}
            onUpdate={updateProfile}
            showWarning={!loading && !profileExists}
          />
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 px-6 py-4 border-t border-lifewood-platinum/50 bg-lifewood-paper/50
                        flex items-center justify-between gap-3">
          <p className="text-xs text-lifewood-silver hidden sm:block">
            Fields marked are required to upload receipts.
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-lifewood-castletonGreen/30
                         text-lifewood-castletonGreen font-semibold text-sm
                         hover:bg-lifewood-castletonGreen/8 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                         bg-lifewood-castletonGreen hover:bg-lifewood-darkSerpent text-white
                         font-semibold text-sm transition-all shadow-green
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {profileExists ? 'Update Profile' : 'Save Profile'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
