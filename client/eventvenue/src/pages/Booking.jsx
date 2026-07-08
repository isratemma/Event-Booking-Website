import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import {
  MdLocationOn, MdCalendarToday, MdAccessTime,
  MdEventSeat, MdArrowBack
} from 'react-icons/md';
import { HiTicket } from 'react-icons/hi';
import Footer from '../components/Footer';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { message: 'Please login to book an event.' } });
      return;
    }
    api.get(`/events/${id}`)
      .then(({ data }) => setEvent(data))
      .catch(() => setError('Event not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    setBooking(true);
    setError('');
    try {
      const res = await api.post('/bookings', { eventId: id });
      navigate('/payment-success', {
        state: {
          eventTitle: event?.title,
          eventDate: event?.date,
          eventTime: event?.time,
          eventVenue: event?.venue,
          eventLocation: event?.location,
          amount: event?.price,
          bookingId: res.data.booking?._id,
        }
      });
    } catch (err) {
      const reason = err.response?.data?.message || err.message;
      navigate('/payment-failed', {
        state: { eventId: id, eventTitle: event?.title, reason }
      });
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/events" style={{ color: '#7C3AED' }} className="font-semibold hover:underline">← Back to Events</Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const seatsLeft = event.availableSeats - (event.bookedSeats || 0);
  const isSoldOut = seatsLeft <= 0;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-semibold mb-6 hover:underline" style={{ color: '#7C3AED' }}>
          <MdArrowBack /> Back to Event
        </button>

        <h1 className="text-2xl font-extrabold mb-6" style={{ color: '#1E1B4B' }}>Complete Your Booking</h1>

        {/* Event Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="h-40 overflow-hidden relative" style={{ backgroundColor: '#EDE9FE' }}>
            {event.imageUrl
              ? <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-5xl">🎉</div>
            }
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
            <span style={{ background: 'linear-gradient(90deg,#7C3AED,#6D28D9)' }} className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full">
              {event.category}
            </span>
          </div>
          <div className="p-5">
            <h2 className="text-xl font-extrabold mb-3" style={{ color: '#1E1B4B' }}>{event.title}</h2>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MdCalendarToday style={{ color: '#7C3AED' }} /> {formattedDate}</span>
              <span className="flex items-center gap-1"><MdAccessTime style={{ color: '#7C3AED' }} /> {event.time}</span>
              <span className="flex items-center gap-1"><MdLocationOn style={{ color: '#7C3AED' }} /> {event.venue}</span>
              <span className="flex items-center gap-1"><MdEventSeat style={{ color: '#7C3AED' }} /> {seatsLeft} seats left</span>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <h3 className="font-extrabold mb-4" style={{ color: '#1E1B4B' }}>Booking Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Ticket × 1</span>
              <span>${event.price}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Service fee</span>
              <span>$0.00</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-extrabold text-base" style={{ color: '#1E1B4B' }}>
              <span>Total</span>
              <span style={{ color: '#22C55E' }}>${event.price}</span>
            </div>
          </div>
        </div>

        {/* Attendee Info */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <h3 className="font-extrabold mb-4" style={{ color: '#1E1B4B' }}>Attendee Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Name</p>
              <p className="font-semibold text-gray-700">{user?.name}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Email</p>
              <p className="font-semibold text-gray-700">{user?.email}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Confirm Button */}
        {isSoldOut ? (
          <button disabled className="w-full py-4 rounded-full text-white font-bold bg-gray-300 cursor-not-allowed text-lg">
            Sold Out
          </button>
        ) : (
          <button
            onClick={handleBook}
            disabled={booking}
            style={{ background: booking ? '#A78BFA' : 'linear-gradient(90deg,#FF8A00,#e67a00)' }}
            className="w-full py-4 rounded-full text-white font-extrabold text-lg hover:opacity-90 transition shadow-xl flex items-center justify-center gap-2"
          >
            <HiTicket className="text-xl" />
            {booking ? 'Confirming...' : `Confirm Booking — $${event.price}`}
          </button>
        )}

        <p className="text-center text-xs text-gray-400 mt-3">
          By booking you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default Booking;
