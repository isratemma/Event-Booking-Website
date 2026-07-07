import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdEventNote, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate('/login', { state: { message: 'Registered successfully! Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { displayName, email, uid, photoURL } = result.user;

      const { data } = await axios.post('/api/auth/google', {
        name: displayName,
        email,
        googleId: uid,
        avatar: photoURL,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: data.avatar,
      }));

      navigate(data.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      console.error('Google error:', err.code, err.message);
      if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups for this site.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized in Firebase. Add localhost to Firebase authorized domains.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled. Enable it in Firebase Console → Authentication.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(`Google sign-in failed: ${err.message || err.code}`);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #DDD6FE 100%)' }}
    >
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-extrabold text-2xl">
            <MdEventNote style={{ color: '#7C3AED' }} className="text-3xl" />
            <span style={{ color: '#1E1B4B' }}>Event<span style={{ color: '#7C3AED' }}>Venue</span></span>
          </Link>
          <h2 className="text-2xl font-extrabold mt-4" style={{ color: '#1E1B4B' }}>Create an account</h2>
          <p className="text-gray-400 text-sm mt-1">Join us and start booking amazing events</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Emma Johnson"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ '--tw-ring-color': '#7C3AED' }}
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #7C3AED'}
              onBlur={e => e.target.style.boxShadow = 'none'}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="emma@example.com"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #7C3AED'}
              onBlur={e => e.target.style.boxShadow = 'none'}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none transition"
                onFocus={e => e.target.style.boxShadow = '0 0 0 2px #7C3AED'}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #7C3AED'}
              onBlur={e => e.target.style.boxShadow = 'none'}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ background: loading ? '#A78BFA' : 'linear-gradient(90deg,#7C3AED,#6D28D9)' }}
            className="w-full text-white font-bold py-3 rounded-xl hover:opacity-90 transition mt-2 text-sm"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold hover:underline" style={{ color: '#7C3AED' }}>
            Sign in
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="flex items-center justify-center gap-3 w-full border-2 border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          {googleLoading ? 'Signing in...' : 'Continue with Google'}
        </button>
      </div>
    </div>
  );
};

export default Register;
