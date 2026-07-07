import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdErrorOutline, MdRefresh, MdArrowBack } from 'react-icons/md';
import { HiTicket } from 'react-icons/hi';

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, eventTitle, reason } = location.state || {};

  const commonReasons = [
    'Your session may have expired — please log in again',
    'This event may be sold out',
    'You may have already booked this event',
    'There was a temporary server issue',
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #FFF5F5 0%, #FEE2E2 50%, #FECACA 100%)' }}
    >
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 text-center">

        {/* Icon */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: '#FEE2E2' }}
        >
          <MdErrorOutline className="text-6xl" style={{ color: '#DC2626' }} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#1E1B4B' }}>
          Booking Failed
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          {reason
            ? <span className="text-red-500 font-medium">{reason}</span>
            : 'Something went wrong while processing your booking.'}
        </p>

        {/* Event info if available */}
        {eventTitle && (
          <div className="rounded-2xl p-4 mb-6 text-left" style={{ backgroundColor: '#FFF5F5', border: '1px solid #FECACA' }}>
            <p className="text-sm text-gray-500">Attempted booking for:</p>
            <p className="font-bold mt-1" style={{ color: '#1E1B4B' }}>{eventTitle}</p>
          </div>
        )}

        {/* Common reasons */}
        <div className="rounded-2xl p-4 mb-6 text-left" style={{ backgroundColor: '#F9FAFB' }}>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
            Possible Reasons
          </p>
          <ul className="space-y-2">
            {commonReasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                <span style={{ color: '#DC2626' }} className="mt-0.5 flex-shrink-0">✕</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {eventId && (
            <button
              onClick={() => navigate(`/book/${eventId}`)}
              style={{ background: 'linear-gradient(90deg,#FF8A00,#e67a00)' }}
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-full hover:opacity-90 transition"
            >
              <MdRefresh className="text-lg" /> Try Again
            </button>
          )}

          <Link
            to="/events"
            style={{ background: 'linear-gradient(90deg,#7C3AED,#6D28D9)' }}
            className="w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-full hover:opacity-90 transition"
          >
            <HiTicket className="text-lg" /> Browse Other Events
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-full hover:bg-gray-50 transition border border-gray-200"
            style={{ color: '#7C3AED' }}
          >
            <MdArrowBack /> Go Back
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Need help?{' '}
          <a href="mailto:support@eventvenue.com" className="hover:underline" style={{ color: '#7C3AED' }}>
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentFailed;
