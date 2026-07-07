import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdCheckCircle, MdCalendarToday, MdAccessTime, MdLocationOn, MdConfirmationNumber } from 'react-icons/md';
import { HiTicket } from 'react-icons/hi';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventTitle, eventDate, eventTime, eventVenue, eventLocation, amount, bookingId } = location.state || {};

  // If no state, redirect home after 5s
  useEffect(() => {
    if (!bookingId && !eventTitle) {
      const t = setTimeout(() => navigate('/'), 5000);
      return () => clearTimeout(t);
    }
  }, []);

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%)' }}
    >
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 text-center">

        {/* Animated checkmark */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: '#DCFCE7' }}
        >
          <MdCheckCircle className="text-6xl" style={{ color: '#16A34A' }} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold mb-1" style={{ color: '#1E1B4B' }}>
          Booking Confirmed! 🎉
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Your spot is reserved. We can't wait to see you there!
        </p>

        {/* Booking details */}
        {(eventTitle || bookingId) && (
          <div className="rounded-2xl p-5 mb-6 text-left space-y-3"
            style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>

            {eventTitle && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-1">Event</p>
                <p className="font-extrabold text-base" style={{ color: '#1E1B4B' }}>{eventTitle}</p>
              </div>
            )}

            {bookingId && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MdConfirmationNumber style={{ color: '#16A34A' }} />
                <span>Booking ID: <span className="font-mono font-bold text-xs">{bookingId}</span></span>
              </div>
            )}

            {formattedDate && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MdCalendarToday style={{ color: '#16A34A' }} />
                {formattedDate}
              </div>
            )}

            {eventTime && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MdAccessTime style={{ color: '#16A34A' }} />
                {eventTime}
              </div>
            )}

            {(eventVenue || eventLocation) && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MdLocationOn style={{ color: '#16A34A' }} />
                {[eventVenue, eventLocation].filter(Boolean).join(', ')}
              </div>
            )}

            {amount && (
              <div className="border-t border-green-100 pt-3 flex justify-between items-center">
                <span className="text-sm text-gray-400">Amount Paid</span>
                <span className="font-extrabold text-lg" style={{ color: '#16A34A' }}>${amount}</span>
              </div>
            )}
          </div>
        )}

        {/* Confetti message */}
        <div className="rounded-2xl p-4 mb-6 text-sm" style={{ backgroundColor: '#F5F3FF', color: '#7C3AED' }}>
          🎟️ Your ticket has been added to <strong>My Bookings</strong>.
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            style={{ background: 'linear-gradient(90deg,#7C3AED,#6D28D9)' }}
            className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-full hover:opacity-90 transition"
          >
            <HiTicket className="text-lg" /> View My Bookings
          </Link>
          <Link
            to="/events"
            className="w-full flex items-center justify-center gap-2 font-bold py-3 rounded-full hover:bg-gray-50 transition border-2"
            style={{ color: '#7C3AED', borderColor: '#7C3AED' }}
          >
            Browse More Events
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          A confirmation has been saved to your account.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
