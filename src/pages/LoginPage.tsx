import { useState } from 'react';
import { ArrowRight, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { navigate } from '@/hooks/useRouter';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, phone },
          },
        });
        if (signUpError) throw signUpError;
        navigate('shop');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate('shop');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-900 px-5 py-12">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&h=1400&w=1920"
          alt=""
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900/80 to-clay-800/70" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="#/" className="inline-flex items-center gap-2.5">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-coral-500 font-display text-xl font-bold text-white">
              Z
            </span>
            <span className="font-display text-3xl font-semibold text-white">Zesto</span>
          </a>
        </div>

        <div className="rounded-3xl bg-cream-50 p-8 shadow-2xl">
          <h1 className="font-display text-3xl font-medium lowercase text-ink-900">
            {mode === 'login' ? 'welcome back' : 'create account'}
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            {mode === 'login'
              ? 'sign in to shop and track your orders'
              : 'join Zesto+ and start earning cashback'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'signup' && (
              <>
                <Field
                  icon={<User className="h-5 w-5" />}
                  type="text"
                  placeholder="full name"
                  value={fullName}
                  onChange={setFullName}
                  required
                />
                <Field
                  icon={<Phone className="h-5 w-5" />}
                  type="tel"
                  placeholder="phone number"
                  value={phone}
                  onChange={setPhone}
                />
              </>
            )}
            <Field
              icon={<Mail className="h-5 w-5" />}
              type="email"
              placeholder="email address"
              value={email}
              onChange={setEmail}
              required
            />
            <div className="relative">
              <Field
                icon={<Lock className="h-5 w-5" />}
                type={showPw ? 'text' : 'password'}
                placeholder="password"
                value={password}
                onChange={setPassword}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              >
                {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-coral-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:gap-3.5 hover:bg-coral-600 disabled:opacity-60"
            >
              {loading ? 'please wait…' : mode === 'login' ? 'sign in' : 'sign up'}
              {!loading && <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-500">
            {mode === 'login' ? "don't have an account? " : 'already have an account? '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              className="font-semibold text-coral-600 hover:text-coral-500"
            >
              {mode === 'login' ? 'sign up' : 'sign in'}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/50">
          go back to{' '}
          <a href="#/" className="font-medium text-coral-400 hover:text-coral-300">
            home page
          </a>
        </p>
      </div>
    </div>
  );
}

function Field({
  icon,
  type,
  placeholder,
  value,
  onChange,
  required,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white px-4 py-3.5 transition-colors focus-within:border-coral-500">
      <span className="text-ink-400">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
      />
    </div>
  );
}
