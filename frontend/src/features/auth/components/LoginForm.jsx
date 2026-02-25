import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { Button, Input } from '../../../components/common';
import { useAuth } from '../hooks/useAuth';

export default function LoginForm({ onClose }) {
  const [accountID, setAccountID] = useState('');
  const [accountPass, setAccountPass] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!accountID || !accountPass) {
      setError('Please fill in all fields');
      return;
    }

    await login(accountID, accountPass);
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
        placeholder="Enter your account ID"
        value={accountID}
        onChange={(e) => setAccountID(e.target.value)}
        icon={User}
        autoComplete="username"
      />

      <Input
        type="password"
        label="Password"
        placeholder="Enter your password"
        value={accountPass}
        onChange={(e) => setAccountPass(e.target.value)}
        icon={Lock}
        autoComplete="current-password"
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
          Sign In
        </Button>
      </div>
    </form>
  );
}