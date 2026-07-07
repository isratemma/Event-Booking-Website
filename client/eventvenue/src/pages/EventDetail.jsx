import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import {
  MdLocationOn, MdCalendarToday, MdAccessTime,
  MdEventSeat, MdCategory, MdArrowBack,
} from 'react-icons/md';
import { HiTicket } from 'react-icons/hi';
import Footer from '../components/Footer';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/api/events/${id}`);
        setEvent(data);
      } catch {
        setError('Event not found or server error.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-72 bg-gray-200 rounded-2xl mb-8" />
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-24">
        <p className="text-red-500 text-lg mb-4">{error || 'Event not found.'}</p>
        <Link to="/events" style={{ color: '#7C3AED' }} className="font-semibold hover:underline">
          ← Back to Events
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const seatsLeft = event.availableSeats - (event.bookedSeats || 0);
  const isSoldOut = seatsLeft <= 0;

  return (
    <>
    <div className="min-h-screen bg-gray-50">

      {/* Hero Image */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden" style={{ backgroundColor: '#EDE9FE' }}>
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl">🎉</div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white text-gray-700 flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold shadow hover:shadow-md transition"
        >
          <MdArrowBack /> Back
        </button>

        {/* Category badge */}
        <span
          style={{ background: 'linear-gradient(90deg,#7C3AED,#6D28D9)' }}
          className="absolute top-4 right-4 text-white text-xs font-bold px-4 py-1 rounded-full shadow"
        >
          {event.category}
        </span>

        {/* Title on image */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left — Details */}
        <div className="md:col-span-2 space-y-6">

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-3" style={{ color: '#1E1B4B' }}>About this Event</h2>
            <p className="text-gray-500 leading-relaxed">{event.description}</p>
          </div>

          {/* Event Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: '#1E1B4B' }}>Event Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={<MdCalendarToday style={{ color: '#7C3AED' }} />} label="Date" value={formattedDate} />
              <InfoRow icon={<MdAccessTime style={{ color: '#7C3AED' }} />} label="Time" value={event.time} />
              <InfoRow icon={<MdLocationOn style={{ color: '#7C3AED' }} />} label="Venue" value={event.venue} />
              <InfoRow icon={<MdLocationOn style={{ color: '#7C3AED' }} />} label="Location" value={event.location} />
              <InfoRow icon={<MdEventSeat style={{ color: '#7C3AED' }} />} label="Total Seats" value={event.totalSeats} />
              <InfoRow icon={<MdEventSeat style={{ color: '#22C55E' }} />} label="Seats Available" value={isSoldOut ? 'Sold Out' : seatsLeft} />
              <InfoRow icon={<MdCategory style={{ color: '#7C3AED' }} />} label="Category" value={event.category} />
              <InfoRow icon={<HiTicket style={{ color: '#FF8A00' }} />} label="Ticket Price" value={`$${event.ticketPrice}`} />
            </div>
          </div>
        </div>

        {/* Right — Booking Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
            <p className="text-gray-400 text-sm mb-1">Price per ticket</p>
            <p className="text-4xl font-extrabold mb-1" style={{ color: '#22C55E' }}>
              ${event.price}
            </p>

            <div className="flex items-center gap-2 text-sm mb-6 mt-2">
              <span
                style={{
                  backgroundColor: isSoldOut ? '#FEE2E2' : '#DCFCE7',
                  color: isSoldOut ? '#DC2626' : '#16A34A',
                }}
                className="px-3 py-1 rounded-full font-semibold"
              >
                {isSoldOut ? 'Sold Out' : `${seatsLeft} seats left`}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-500 mb-6">
              <p className="flex items-center gap-2">
                <MdCalendarToday style={{ color: '#7C3AED' }} />
                {formattedDate}
              </p>
              <p className="flex items-center gap-2">
                <MdAccessTime style={{ color: '#7C3AED' }} />
                {event.time}
              </p>
              <p className="flex items-center gap-2">
                <MdLocationOn style={{ color: '#7C3AED' }} />
                {event.venue}, {event.location}
              </p>
            </div>

            {isSoldOut ? (
              <button
                disabled
                className="w-full py-3 rounded-full text-white font-bold bg-gray-300 cursor-not-allowed"
              >
                Sold Out
              </button>
            ) : (
              <Link
                to={`/book/${event._id}`}
                style={{ backgroundColor: '#FF8A00' }}
                className="block w-full text-center py-3 rounded-full text-white font-bold hover:opacity-90 transition shadow-md"
              >
                Book Now
              </Link>
            )}

            <Link
              to="/events"
              className="block text-center mt-3 text-sm font-semibold hover:underline"
              style={{ color: '#7C3AED' }}
            >
              ← Browse more events
            </Link>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <span className="text-lg mt-0.5">{icon}</span>
    <div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-gray-700 font-semibold">{value}</p>
    </div>
  </div>
);

export default EventDetail;
