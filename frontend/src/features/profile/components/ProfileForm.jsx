import React from 'react';
import { User, School, Mail, Phone, MapPin, Calendar, AlertTriangle } from 'lucide-react';

function Field({ label, icon: Icon, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider text-lifewood-charcoal/60">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 text-lifewood-castletonGreen/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
        {children}
      </div>
    </div>
  );
}

const inputCls =
  'w-full pl-10 pr-4 py-2.5 rounded-xl border border-lifewood-platinum ' +
  'bg-lifewood-seaSalt/40 text-lifewood-darkSerpent text-sm placeholder-lifewood-silver ' +
  'focus:outline-none focus:border-lifewood-castletonGreen focus:ring-2 focus:ring-lifewood-castletonGreen/15 ' +
  'hover:border-lifewood-castletonGreen/40 transition-all';

export default function ProfileForm({ profile, onUpdate, showWarning }) {
  return (
    <div className="space-y-6">

      {/* Warning banner */}
      {showWarning && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800">Profile Required</p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              Please create your profile before uploading receipts.
            </p>
          </div>
        </div>
      )}

      {/* ── Personal Information ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-lifewood-saffaron to-lifewood-goldenBrown" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-lifewood-charcoal/50">
            Personal Information
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Full Name" icon={User}>
            <input
              type="text"
              placeholder="Enter your full name"
              value={profile.name || ''}
              onChange={(e) => onUpdate('name', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Date of Birth" icon={Calendar}>
            <input
              type="date"
              value={profile.date_of_birth || ''}
              onChange={(e) => onUpdate('date_of_birth', e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
      </div>

      {/* ── Organization ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-lifewood-castletonGreen to-lifewood-darkSerpent" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-lifewood-charcoal/50">
            Organization
          </span>
        </div>
        <Field label="School / Department" icon={School}>
          <input
            type="text"
            placeholder="Enter your school or department name"
            value={profile.school_name || ''}
            onChange={(e) => onUpdate('school_name', e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      {/* ── Contact Details ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-lifewood-saffaron to-lifewood-goldenBrown" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-lifewood-charcoal/50">
            Contact Details
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Email" icon={Mail}>
            <input
              type="email"
              placeholder="your@email.com"
              value={profile.email || ''}
              onChange={(e) => onUpdate('email', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Phone Number" icon={Phone}>
            <input
              type="tel"
              placeholder="09XX-XXX-XXXX"
              value={profile.phone || ''}
              onChange={(e) => onUpdate('phone', e.target.value)}
              className={inputCls}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Address" icon={MapPin}>
              <input
                type="text"
                placeholder="Street, City, Province"
                value={profile.address || ''}
                onChange={(e) => onUpdate('address', e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      </div>

    </div>
  );
}
