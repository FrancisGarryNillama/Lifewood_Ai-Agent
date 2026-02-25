import React, { useState } from 'react';
import { User, Lock, ShieldCheck, UserCircle, Building2, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Button, Input } from '../../../components/common';

const PENDING_KEY = 'pendingAccountRequests';

function savePendingRequest(request) {
  const existing = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
  existing.push({ ...request, status: 'pending', requestedAt: new Date().toISOString() });
  localStorage.setItem(PENDING_KEY, JSON.stringify(existing));
}

export default function RegisterForm({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    accountID: '',
    accountPass: '',
    confirmPass: '',
    fullName: '',
    department: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleNextStep = (e) => {
    e.preventDefault();
    setError('');
    if (!form.accountID) return setError('Account ID is required');
    if (form.accountPass.length < 6) return setError('Password must be at least 6 characters');
    if (form.accountPass !== form.confirmPass) return setError('Passwords do not match');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.fullName || !form.email || !form.department) {
      return setError('Full Name, Email, and Department are required');
    }

    // Check for duplicate accountID
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
    const approved = JSON.parse(localStorage.getItem('approvedAccounts') || '[]');
    const allIds = [...pending, ...approved].map(a => a.accountID.toLowerCase());
    if (allIds.includes(form.accountID.toLowerCase())) {
      return setError('This Account ID is already taken or pending approval');
    }

    setLoading(true);
    savePendingRequest(form);
    setLoading(false);
    if (onSuccess) onSuccess();
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-5">
        <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-lifewood-castletonGreen' : 'bg-gray-200'}`} />
        <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-lifewood-castletonGreen' : 'bg-gray-200'}`} />
      </div>

      {step === 1 && (
        <form onSubmit={handleNextStep} className="space-y-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Step 1 — Account Credentials</p>

          <Input
            type="text"
            label="Account ID"
            placeholder="Choose your account ID"
            value={form.accountID}
            onChange={e => update('accountID', e.target.value)}
            icon={User}
            autoComplete="username"
          />
          <Input
            type="password"
            label="Password"
            placeholder="Create a password (min. 6 chars)"
            value={form.accountPass}
            onChange={e => update('accountPass', e.target.value)}
            icon={Lock}
            autoComplete="new-password"
          />
          <Input
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={form.confirmPass}
            onChange={e => update('confirmPass', e.target.value)}
            icon={ShieldCheck}
            autoComplete="new-password"
          />

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1">Next →</Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Step 2 — Profile Information</p>

          <Input
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            value={form.fullName}
            onChange={e => update('fullName', e.target.value)}
            icon={UserCircle}
          />
          <Input
            type="text"
            label="Department / Team"
            placeholder="e.g. Human Resources"
            value={form.department}
            onChange={e => update('department', e.target.value)}
            icon={Building2}
          />
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email address"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            icon={Mail}
          />
          <Input
            type="tel"
            label="Phone Number"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={e => update('phone', e.target.value)}
            icon={Phone}
          />
          <Input
            type="text"
            label="Address"
            placeholder="Enter your address"
            value={form.address}
            onChange={e => update('address', e.target.value)}
            icon={MapPin}
          />
          <Input
            type="date"
            label="Date of Birth"
            value={form.dateOfBirth}
            onChange={e => update('dateOfBirth', e.target.value)}
            icon={Calendar}
          />

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>← Back</Button>
            <Button type="submit" className="flex-1" loading={loading} disabled={loading}>
              Submit Request
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}