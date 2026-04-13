'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { TwoFactorVerification } from '@/components/auth/TwoFactorVerification';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Win95LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth, setTwoFactorRequired, twoFactor, clearTwoFactor } = useAuthStore();
  const { settings, refreshSettings } = useSettings();
  const { refreshTheme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authApi.login(data.email, data.password);
      if (response.data?.requires_2fa && response.data?.two_factor_token) {
        setTwoFactorRequired(response.data.two_factor_token, data.email, response.data.webauthn_enabled ?? false, response.data.totp_enabled ?? false);
        return;
      }
      if (response.success) {
        setAuth(response.data.access_token, response.data.user);
        await Promise.all([refreshSettings(), refreshTheme()]);
        const returnUrl = searchParams.get('returnUrl');
        router.push(returnUrl && returnUrl.startsWith('/') ? returnUrl : '/dashboard');
      } else {
        setError(response.error?.message || 'Login failed');
      }
    } catch (err: any) {
      const errorData = err.response?.data?.error;
      setError(typeof errorData === 'string' ? errorData : errorData?.message || err.response?.data?.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  if (twoFactor.required) {
    return <TwoFactorVerification onBack={() => clearTwoFactor()} />;
  }

  const panelName = settings?.panel_name || 'BadgerPanel';

  return (
    <div className="win95 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[420px] mx-4">
        {/* Window frame */}
        <div className="bg-[#c0c0c0]" style={{ border: '2px solid', borderColor: 'white #000 #000 white', boxShadow: '2px 2px 0 #000' }}>
          {/* Title bar */}
          <div className="flex items-center justify-between px-2 py-1" style={{ background: 'linear-gradient(90deg, #000080, #1084d0)' }}>
            <div className="flex items-center gap-2">
              <span className="text-sm">&#128274;</span>
              <span className="text-white text-sm font-bold">Welcome to {panelName}</span>
            </div>
            <div className="flex gap-[2px]">
              <button className="w-4 h-[14px] bg-[#c0c0c0] text-[8px] flex items-center justify-center" style={{ border: '1px solid', borderColor: 'white #000 #000 white' }}>_</button>
              <button className="w-4 h-[14px] bg-[#c0c0c0] text-[8px] flex items-center justify-center" style={{ border: '1px solid', borderColor: 'white #000 #000 white' }}>x</button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex gap-4 mb-5">
              <div className="text-4xl shrink-0">&#128187;</div>
              <div>
                <p className="text-sm font-bold mb-1">Press Ctrl+Alt+Delete to begin.</p>
                <p className="text-xs text-[#808080]">Enter your credentials to log on to the server management panel.</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-2 bg-white flex items-start gap-2" style={{ border: '2px solid', borderColor: '#808080 white white #808080' }}>
                <span className="text-red-600 text-lg shrink-0">&#9888;</span>
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-center mb-3">
                <label className="text-sm w-24 text-right pr-3 shrink-0"><u>U</u>ser name:</label>
                <input
                  type="email"
                  {...register('email')}
                  className="flex-1 bg-white px-2 py-1 text-sm outline-none"
                  style={{ border: '2px solid', borderColor: '#808080 white white #808080' }}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-xs text-red-600 ml-24 mb-2">{errors.email.message}</p>}

              <div className="flex items-center mb-3">
                <label className="text-sm w-24 text-right pr-3 shrink-0"><u>P</u>assword:</label>
                <input
                  type="password"
                  {...register('password')}
                  className="flex-1 bg-white px-2 py-1 text-sm outline-none"
                  style={{ border: '2px solid', borderColor: '#808080 white white #808080' }}
                  placeholder="********"
                  autoComplete="current-password"
                />
              </div>
              {errors.password && <p className="text-xs text-red-600 ml-24 mb-2">{errors.password.message}</p>}

              <div className="my-4" style={{ borderTop: '1px solid #808080', borderBottom: '1px solid white' }} />

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-1 text-sm font-bold min-w-[80px] disabled:opacity-50"
                  style={{ background: '#c0c0c0', border: '2px solid', borderColor: 'white #000 #000 white' }}
                >
                  {isLoading ? 'Logging in...' : 'OK'}
                </button>
                <button
                  type="button"
                  className="px-6 py-1 text-sm min-w-[80px]"
                  style={{ background: '#c0c0c0', border: '2px solid', borderColor: 'white #000 #000 white' }}
                  onClick={() => router.push('/auth/register')}
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: '#004040', textShadow: '1px 1px 0 #00a0a0' }}>
          &copy; {new Date().getFullYear()} {panelName} - Best viewed in 800x600
        </p>
      </div>
    </div>
  );
}
