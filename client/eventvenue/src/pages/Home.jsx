import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import {
  MdLocationOn, MdCalendarToday, MdAccessTime,
  MdEventNote, MdStar, MdArrowForward, MdSearch
} from 'react-icons/md';
import { HiArrowRight, HiTicket } from 'react-icons/hi';
import Footer from '../components/Footer';

const CATEGORIES = ['All', 'Gala', 'Conference', 'Entertainment', 'Expo', 'Corporate', 'Wedding', 'Birthday'];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/events')
      .then(({ data }) => setEvents(data.slice(0, 9)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = selectedCategory === 'All'
    ? events
    : events.filter(e => e.category === selectedCategory);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/events?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/events');
    }
  };

  const handleCategoryClick = (cat) => {
    if (cat === 'All') navigate('/events');
    else navigate(`/events?category=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #4C1D95 50%, #7C3AED 100%)', minHeight: '90vh' }}>

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#FF8A00', filter: 'blur(80px)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10" style={{ backgroundColor: '#22C55E', filter: 'blur(80px)', transform: 'translate(-30%, 30%)' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-5" style={{ backgroundColor: 'white', filter: 'blur(60px)', transform: 'translate(-50%, -50%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 py-24 flex flex-col items-center text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#FCD34D', border: '1px solid rgba(255,255,255,0.2)' }}>
            <MdStar /> Discover · Book · Experience
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Your Next{' '}
            <span className="relative inline-block">
              <span style={{
                background: 'linear-gradient(90deg, #FCD34D, #FF8A00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Unforgettable
              </span>
            </span>
            <br />Event Awaits
          </h1>

          <p className="text-violet-200 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            From glamorous galas to cutting-edge conferences — discover, book, and experience
            the world's most exciting events in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-full text-lg hover:opacity-90 transition shadow-2xl"
              style={{ backgroundColor: '#FF8A00', color: 'white' }}
            >
              Explore Events <HiArrowRight />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-full text-lg transition"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}
            >
              Get Started Free
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto mb-12 relative">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-300 text-xl pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search weddings, galas, conferences..."
              className="w-full pl-11 pr-32 py-4 rounded-full text-sm font-medium focus:outline-none shadow-2xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}
              onFocus={e => { e.target.style.backgroundColor = 'white'; e.target.style.color = '#1E1B4B'; e.target.style.border = '2px solid #FF8A00'; }}
              onBlur={e => { if (!e.target.value) { e.target.style.backgroundColor = 'rgba(255,255,255,0.12)'; e.target.style.color = 'white'; e.target.style.border = '2px solid rgba(255,255,255,0.3)'; } }}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 font-bold px-5 py-2 rounded-full text-sm hover:opacity-90 transition"
              style={{ backgroundColor: '#FF8A00', color: 'white' }}
            >
              Search
            </button>
          </form>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: '500+', label: 'Events Listed' },
              { value: '10K+', label: 'Happy Attendees' },
              { value: '50+', label: 'Venues' },
              { value: '4.9★', label: 'Average Rating' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-black" style={{ color: '#FCD34D' }}>{s.value}</p>
                <p className="text-violet-300 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#7C3AED' }}>Simple Process</span>
          <h2 className="text-3xl md:text-4xl font-black mt-2" style={{ color: '#1E1B4B' }}>How It Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', icon: '🔍', title: 'Discover Events', desc: 'Browse hundreds of events by category, location, or date. Find exactly what excites you.' },
            { step: '02', icon: '🎟️', title: 'Book Your Seat', desc: 'Select your event, choose your tickets, and complete your booking in under 60 seconds.' },
            { step: '03', icon: '🎉', title: 'Enjoy the Experience', desc: 'Show up, enjoy, and create memories that last a lifetime.' },
          ].map(item => (
            <div key={item.step} className="relative bg-white rounded-3xl shadow-sm p-8 text-center hover:shadow-lg transition group">
              <div className="absolute top-4 right-4 text-5xl font-black opacity-5 group-hover:opacity-10 transition" style={{ color: '#7C3AED' }}>
                {item.step}
              </div>
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-extrabold mb-2" style={{ color: '#1E1B4B' }}>{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURED EVENTS ══ */}
      <section className="max-w-7xl mx-auto px-4 pb-16">

        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#7C3AED' }}>Don't Miss Out</span>
            <h2 className="text-3xl md:text-4xl font-black mt-1" style={{ color: '#1E1B4B' }}>Featured Events</h2>
          </div>
          <Link to="/events" style={{ color: '#7C3AED' }} className="hidden md:flex items-center gap-1 font-bold hover:underline">
            View all <HiArrowRight />
          </Link>
        </div>

        {/* Category filter */}
        <div className="flex gap-3 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); handleCategoryClick(cat); }}
              style={
                selectedCategory === cat
                  ? { background: 'linear-gradient(90deg,#7C3AED,#6D28D9)', color: 'white' }
                  : { backgroundColor: 'white', color: '#7C3AED', border: '1.5px solid #7C3AED' }
              }
              className="px-5 py-2 rounded-full text-sm font-semibold transition hover:opacity-90 shadow-sm"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-400 py-10">No events in this category.</p>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(event => <EventCard key={event._id} event={event} />)}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/events"
            style={{ background: 'linear-gradient(90deg,#7C3AED,#6D28D9)' }}
            className="inline-flex items-center gap-2 text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition shadow-lg"
          >
            View All Events <HiArrowRight />
          </Link>
        </div>
      </section>

      {/* ══ CATEGORIES SHOWCASE ══ */}
      <section style={{ backgroundColor: '#F5F3FF' }} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#7C3AED' }}>Browse By Type</span>
            <h2 className="text-3xl md:text-4xl font-black mt-2" style={{ color: '#1E1B4B' }}>Event Categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {[
              { name: 'Gala', emoji: '✨', color: '#7C3AED' },
              { name: 'Conference', emoji: '🎤', color: '#2563EB' },
              { name: 'Entertainment', emoji: '🎶', color: '#DB2777' },
              { name: 'Expo', emoji: '🏛️', color: '#D97706' },
              { name: 'Corporate', emoji: '💼', color: '#059669' },
              { name: 'Wedding', emoji: '💍', color: '#EC4899' },
              { name: 'Birthday', emoji: '🎂', color: '#F59E0B' },
            ].map(cat => (
              <button
                key={cat.name}
                onClick={() => navigate(`/events?category=${encodeURIComponent(cat.name)}`)}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition group cursor-pointer"
              >
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <p className="font-bold text-sm" style={{ color: cat.color }}>{cat.name}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #7C3AED 100%)' }} className="py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: '#FF8A00', filter: 'blur(60px)' }} />
        <div className="max-w-3xl mx-auto text-center relative">
          <HiTicket className="text-6xl mx-auto mb-4" style={{ color: '#FCD34D' }} />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to Create Memories?
          </h2>
          <p className="text-violet-200 text-lg mb-8">
            Join thousands of event lovers. Sign up free and start booking today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              style={{ backgroundColor: '#FF8A00' }}
              className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-full hover:opacity-90 transition shadow-xl text-lg"
            >
              Sign Up Free <MdArrowForward />
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-full text-lg transition"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)' }}
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <Footer />
    </div>
  );
};

/* ── Event Card ── */
const EventCard = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
  const seatsLeft = event.availableSeats - (event.bookedSeats || 0);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="h-48 overflow-hidden relative" style={{ backgroundColor: '#EDE9FE' }}>
        {event.imageUrl
          ? <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-5xl">🎉</div>
        }
        <span style={{ background: 'linear-gradient(90deg,#7C3AED,#6D28D9)', color: 'white' }} className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full shadow">
          {event.category}
        </span>
        {seatsLeft <= 20 && seatsLeft > 0 && (
          <span className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full shadow" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
            Only {seatsLeft} left!
          </span>
        )}
        {seatsLeft <= 0 && (
          <span className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full shadow" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
            Sold Out
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-extrabold mb-1 line-clamp-1" style={{ color: '#1E1B4B' }}>{event.title}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description}</p>

        <div className="flex flex-col gap-1 text-sm text-gray-400 mb-4">
          <span className="flex items-center gap-1"><MdCalendarToday style={{ color: '#7C3AED' }} /> {formattedDate}</span>
          <span className="flex items-center gap-1"><MdAccessTime style={{ color: '#7C3AED' }} /> {event.time}</span>
          <span className="flex items-center gap-1"><MdLocationOn style={{ color: '#7C3AED' }} /> {event.venue}, {event.location}</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="font-extrabold text-xl" style={{ color: '#22C55E' }}>${event.price}</span>
          <div className="flex items-center gap-2">
            <Link to={`/events/${event._id}`} style={{ color: '#7C3AED', border: '1.5px solid #7C3AED' }} className="text-sm px-4 py-2 rounded-full hover:bg-violet-50 transition font-bold">
              View Details
            </Link>
            <Link to={`/book/${event._id}`} style={{ backgroundColor: seatsLeft <= 0 ? '#9CA3AF' : '#FF8A00' }} className="text-white text-sm px-4 py-2 rounded-full hover:opacity-90 transition font-bold shadow">
              {seatsLeft <= 0 ? 'Sold Out' : 'Book Now'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
