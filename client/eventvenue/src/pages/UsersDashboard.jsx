import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdBookOnline, MdLocationOn, MdCalendarToday } from 'react-icons/md';
import { HiTicket } from 'react-icons/hi';

const API = '';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    axios.get(`${API}/api/bookings/my`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(({ data }) => setBookings(data))
      .catch(err => {
        const msg = err.response?.data?.message || err.message;
        setError(`Failed to load bookings: ${msg}`);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const statusColor = (status) => {
    if (status === 'confirmed') return { bg: '#DCFCE7', text: '#16A34A' };
    if (status === 'cancelled') return { bg: '#FEE2E2', text: '#DC2626' };
    return { bg: '#FEF3C7', text: '#D97706' };
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Welcome */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-extrabold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#C026D3)' }}>
            {user?.avatar
              ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt={user.name} />
              : user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-extrabold" style={{ color: '#1E1B4B' }}>Welcome back, {user?.name}! 👋</h1>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-extrabold" style={{ color: '#7C3AED' }}>{bookings.length}</p>
            <p className="text-gray-400 text-xs">Total Bookings</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: '#22C55E' },
            { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: '#F59E0B' },
            { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, color: '#EF4444' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm p-4 text-center">
              <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-gray-400 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Bookings */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-extrabold" style={{ color: '#1E1B4B' }}>My Bookings</h2>
          <Link to="/events" style={{ backgroundColor: '#FF8A00' }}
            className="text-white text-sm px-4 py-2 rounded-full font-bold hover:opacity-90 transition">
            Browse Events
          </Link>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <HiTicket className="text-5xl mx-auto mb-3" style={{ color: '#DDD6FE' }} />
            <p className="text-gray-400 font-medium">No bookings yet.</p>
            <Link to="/events" style={{ backgroundColor: '#7C3AED' }}
              className="inline-block mt-4 text-white text-sm px-5 py-2 rounded-full font-bold hover:opacity-90 transition">
              Find Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => {
              const colors = statusColor(b.status);
              return (
                <div key={b._id} className="bg-white rounded-2xl shadow-sm p-5 flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: '#EDE9FE', color: '#7C3AED' }}>
                    <MdBookOnline />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-extrabold" style={{ color: '#1E1B4B' }}>
                        {b.eventId?.title || 'Event'}
                      </h3>
                      <span className="text-xs font-bold px-3 py-1 rounded-full ml-2 flex-shrink-0"
                        style={{ backgroundColor: colors.bg, color: colors.text }}>
                        {b.status}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-2 text-sm text-gray-400 flex-wrap">
                      {b.eventId?.venue && (
                        <span className="flex items-center gap-1">
                          <MdLocationOn style={{ color: '#7C3AED' }} /> {b.eventId.venue}
                        </span>
                      )}
                      {b.eventId?.date && (
                        <span className="flex items-center gap-1">
                          <MdCalendarToday style={{ color: '#7C3AED' }} />
                          {new Date(b.eventId.date).toLocaleDateString()}
                        </span>
                      )}
                      <span className="font-bold" style={{ color: '#22C55E' }}>${b.amount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
