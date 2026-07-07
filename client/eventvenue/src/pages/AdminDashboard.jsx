import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { MdEventNote, MdBookOnline, MdDelete,
  MdEdit, MdAdd, MdAttachMoney, MdCheckCircle as MdCheck, MdError, MdClose
} from 'react-icons/md';
import { HiCheckCircle } from 'react-icons/hi';

// ── Toast ──
const Toast = ({ toasts, remove }) => (
  <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
    {toasts.map(t => (
      <div key={t.id} className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold min-w-[280px]"
        style={{ backgroundColor: t.type === 'success' ? '#DCFCE7' : '#FEE2E2', color: t.type === 'success' ? '#16A34A' : '#DC2626', border: `1px solid ${t.type === 'success' ? '#BBF7D0' : '#FECACA'}` }}>
        {t.type === 'success' ? <MdCheck className="text-xl flex-shrink-0" /> : <MdError className="text-xl flex-shrink-0" />}
        <span className="flex-1">{t.message}</span>
        <button onClick={() => remove(t.id)} className="hover:opacity-70"><MdClose /></button>
      </div>
    ))}
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');
  const [tab, setTab] = useState('bookings');
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);

  const toast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (!storedUser || !storedToken) { navigate('/login'); return; }
    const parsed = JSON.parse(storedUser);
    if (parsed.role !== 'admin') { navigate('/login'); return; }
    setUser(parsed);

    setLoading(true);
    Promise.all([
      api.get('/events'),
      api.get('/bookings'),
    ]).then(([eventsRes, bookingsRes]) => {
      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);
    }).catch(err => {
      setError(`Failed to load data: ${err.response?.data?.message || err.message}`);
    }).finally(() => setLoading(false));
  }, []);

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.delete(`/api/events/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
      toast('Event deleted successfully.');
    } catch { toast('Failed to delete event.', 'error'); }
  };

  const handleConfirmBooking = async (id) => {
    try {
      await api.put(`/api/bookings/${id}/confirm`, {});
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'confirmed' } : b));
      toast('Booking confirmed successfully.');
    } catch { toast('Failed to confirm booking.', 'error'); }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      await api.delete(`/api/bookings/${id}`);
      setBookings(prev => prev.filter(b => b._id !== id));
      toast('Booking deleted.');
    } catch { toast('Failed to delete booking.', 'error'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return null;

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  const stats = [
    { label: 'Total Events', value: events.length, icon: <MdEventNote />, color: '#7C3AED' },
    { label: 'Total Bookings', value: bookings.length, icon: <MdBookOnline />, color: '#FF8A00' },
    { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, icon: <HiCheckCircle />, color: '#22C55E' },
    { label: 'Revenue', value: `$${totalRevenue}`, icon: <MdAttachMoney />, color: '#059669' },
  ];

  const statusStyle = (status) => {
    if (status === 'confirmed') return { backgroundColor: '#DCFCE7', color: '#16A34A' };
    if (status === 'cancelled') return { backgroundColor: '#FEE2E2', color: '#DC2626' };
    return { backgroundColor: '#FEF3C7', color: '#D97706' };
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition">
              <div className="text-2xl p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: s.color + '20', color: s.color }}>
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-extrabold" style={{ color: '#1E1B4B' }}>{s.value}</p>
                <p className="text-gray-400 text-xs">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {['bookings', 'events'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={tab === t
                ? { background: 'linear-gradient(90deg,#7C3AED,#6D28D9)', color: 'white' }
                : { backgroundColor: 'white', color: '#7C3AED', border: '1.5px solid #7C3AED' }}
              className="px-5 py-2 rounded-full text-sm font-bold capitalize transition"
            >
              {t === 'bookings' ? `Bookings (${bookings.length})` : `Events (${events.length})`}
            </button>
          ))}
          {tab === 'events' && (
            <button
              onClick={() => toast('Create event form coming soon!', 'info')}
              style={{ backgroundColor: '#FF8A00' }}
              className="ml-auto flex items-center gap-1 text-white px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition"
            >
              <MdAdd /> Add Event
            </button>
          )}
        </div>

        {error && <p className="text-red-500 mb-4 bg-red-50 px-4 py-2 rounded-xl">{error}</p>}

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-16 animate-pulse" />)}
          </div>
        ) : (
          <>
            {/* ── Bookings Tab ── */}
            {tab === 'bookings' && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {bookings.length === 0 ? (
                  <div className="text-center py-16">
                    <MdBookOnline className="text-5xl mx-auto mb-3" style={{ color: '#DDD6FE' }} />
                    <p className="text-gray-400">No bookings yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[640px]">
                      <thead style={{ backgroundColor: '#F5F3FF' }}>
                        <tr>
                          {['User', 'Event', 'Amount', 'Payment', 'Status', 'Booked On', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 font-bold text-gray-600 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                            <td className="px-4 py-3">
                              <p className="font-semibold" style={{ color: '#1E1B4B' }}>{b.userId?.name || '—'}</p>
                              <p className="text-gray-400 text-xs">{b.userId?.email}</p>
                            </td>
                            <td className="px-4 py-3 font-semibold text-gray-600 max-w-[160px] truncate">
                              {b.eventId?.title || '—'}
                            </td>
                            <td className="px-4 py-3 font-bold" style={{ color: '#22C55E' }}>${b.amount}</td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                                style={b.paymentStatus === 'paid'
                                  ? { backgroundColor: '#DCFCE7', color: '#16A34A' }
                                  : { backgroundColor: '#FEF3C7', color: '#D97706' }}>
                                {b.paymentStatus || 'pending'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={statusStyle(b.status)}>
                                {b.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                              {new Date(b.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                {b.status === 'pending' && (
                                  <button
                                    onClick={() => handleConfirmBooking(b._id)}
                                    title="Confirm"
                                    className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition"
                                  >
                                    <HiCheckCircle className="text-lg" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteBooking(b._id)}
                                  title="Delete"
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"
                                >
                                  <MdDelete className="text-lg" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── Events Tab ── */}
            {tab === 'events' && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {events.length === 0 ? (
                  <div className="text-center py-16">
                    <MdEventNote className="text-5xl mx-auto mb-3" style={{ color: '#DDD6FE' }} />
                    <p className="text-gray-400">No events found.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[640px]">
                      <thead style={{ backgroundColor: '#F5F3FF' }}>
                        <tr>
                          {['Event', 'Category', 'Date', 'Location', 'Price', 'Seats Left', 'Actions'].map(h => (
                            <th key={h} className="text-left px-4 py-3 font-bold text-gray-600 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {events.map(e => (
                          <tr key={e._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                            <td className="px-4 py-3">
                              <p className="font-semibold max-w-[160px] truncate" style={{ color: '#1E1B4B' }}>{e.title}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span style={{ backgroundColor: '#EDE9FE', color: '#7C3AED' }} className="px-2 py-0.5 rounded-full text-xs font-semibold">
                                {e.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(e.date).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-gray-500">{e.location}</td>
                            <td className="px-4 py-3 font-bold" style={{ color: '#22C55E' }}>${e.price}</td>
                            <td className="px-4 py-3">
                              <span className={`font-semibold text-xs ${e.availableSeats <= 10 ? 'text-red-500' : 'text-gray-500'}`}>
                                {e.availableSeats}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Link to={`/events/${e._id}`} className="p-1.5 rounded-lg hover:bg-violet-50 transition" style={{ color: '#7C3AED' }} title="View">
                                  <MdEdit className="text-lg" />
                                </Link>
                                <button onClick={() => handleDeleteEvent(e._id)} className="p-1.5 rounded-lg hover:bg-red-50 transition text-red-500" title="Delete">
                                  <MdDelete className="text-lg" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
