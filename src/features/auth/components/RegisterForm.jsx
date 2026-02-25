import React, { useState } from 'react';
import { User, Lock, ShieldCheck } from 'lucide-react';
import { Button, Input } from '../../../components/common';
import { useAuth } from '../hooks/useAuth';

export default function RegisterForm({ onClose, onSuccess }) {
  const [accountID, setAccountID] = useState('');
  const [accountPass, setAccountPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!accountID || !accountPass || !confirmPass) {
      setError('Please fill in all fields');
      return;
    }

    if (accountPass !== confirmPass) {
      setError('Passwords do not match');
      return;
    }

    if (accountPass.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const success = await register(accountID, accountPass);
    if (success) {
      setAccountID('');
      setAccountPass('');
      setConfirmPass('');
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
      {error && (
        <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-lg text-center">
          {error}
        </div>
      )}

      <Input
        type="text"
        label="Account ID"
        placeholder="Enter desired account ID"
        value={accountID}
        onChange={(e) => setAccountID(e.target.value)}
        icon={User}
        autoComplete="username"
      />

      <Input
        type="password"
        label="Password"
        placeholder="Create a password"
        value={accountPass}
        onChange={(e) => setAccountPass(e.target.value)}
        icon={Lock}
        autoComplete="new-password"
      />

      <Input
        type="password"
        label="Confirm Password"
        placeholder="Confirm your password"
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
        icon={ShieldCheck}
        autoComplete="new-password"
      />

      <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 text-sm sm:text-base py-2 sm:py-2.5"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 text-sm sm:text-base py-2 sm:py-2.5"
          loading={loading}
          disabled={loading}
        >
          Register Account
        </Button>
      </div>
    </form>
  );
}