import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { MdLocationOn, MdCalendarToday, MdAccessTime, MdSearch, MdFilterList } from 'react-icons/md';
import Footer from '../components/Footer';
import { HiArrowRight } from 'react-icons/hi';

const CATEGORIES = ['All', 'Gala', 'Conference', 'Entertainment', 'Expo', 'Corporate', 'Wedding', 'Birthday'];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [searchParams, setSearchParams] = useSearchParams();

  // Read from URL params
  const search = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All';

  const setSearch = (val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set('search', val); else p.delete('search');
    setSearchParams(p);
  };

  const setSelectedCategory = (cat) => {
    const p = new URLSearchParams(searchParams);
    if (cat && cat !== 'All') p.set('category', cat); else p.delete('category');
    setSearchParams(p);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('/api/events');
        setEvents(data);
      } catch {
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filtered = events
    .filter(e => selectedCategory === 'All' || e.category === selectedCategory)
    .filter(e =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return new Date(a.date) - new Date(b.date);
    });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section
        style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' }}
        className="py-14 px-4 text-center"
      >
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">All Events</h1>
        <p className="text-violet-200 text-lg mb-8">Find and book the perfect event for you</p>

        {/* Search bar */}
        <div className="max-w-xl mx-auto relative">
          <MdSearch className="absolute left-4 top-3.5 text-violet-400 text-xl" />
          <input
            type="text"
            placeholder="Search by title, venue or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full text-sm focus:outline-none shadow-2xl font-medium"
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.4)',
              backdropFilter: 'blur(10px)',
            }}
            onFocus={e => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#1E1B4B';
              e.target.style.border = '2px solid #FF8A00';
              e.target.previousSibling.style.color = '#FF8A00';
            }}
            onBlur={e => {
              if (!e.target.value) {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
                e.target.style.color = 'white';
                e.target.style.border = '2px solid rgba(255,255,255,0.4)';
                e.target.previousSibling.style.color = '#A78BFA';
              }
            }}
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Filters row */}
        <div className="flex flex-wrap gap-3 items-center justify-between mb-6">

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={
                  selectedCategory === cat
                    ? { background: 'linear-gradient(90deg,#7C3AED,#6D28D9)', color: 'white' }
                    : { backgroundColor: 'white', color: '#7C3AED', border: '1.5px solid #7C3AED' }
                }
                className="px-4 py-1.5 rounded-full text-sm font-semibold transition hover:opacity-90"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <MdFilterList style={{ color: '#7C3AED' }} className="text-lg" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-full px-3 py-1.5 text-sm text-gray-600 focus:outline-none bg-white"
            >
              <option value="date">Sort by Date</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-gray-400 text-sm mb-4">
            Showing <span className="font-bold" style={{ color: '#7C3AED' }}>{filtered.length}</span> events
            {search && ` for "${search}"`}
          </p>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-center text-red-500 mt-10">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-400 font-medium">No events found.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); }}
              style={{ color: '#7C3AED' }}
              className="mt-3 font-semibold hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(event => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EventCard = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="h-48 overflow-hidden relative" style={{ backgroundColor: '#EDE9FE' }}>
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🎉</div>
        )}
        <span
          style={{ background: 'linear-gradient(90deg,#7C3AED,#6D28D9)', color: 'white' }}
          className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full shadow"
        >
          {event.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-extrabold mb-1 line-clamp-1" style={{ color: '#1E1B4B' }}>
          {event.title}
        </h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description}</p>

        <div className="flex flex-col gap-1 text-sm text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <MdCalendarToday style={{ color: '#7C3AED' }} /> {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <MdAccessTime style={{ color: '#7C3AED' }} /> {event.time}
          </span>
          <span className="flex items-center gap-1">
            <MdLocationOn style={{ color: '#7C3AED' }} /> {event.venue}, {event.location}
          </span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="font-extrabold text-xl" style={{ color: '#22C55E' }}>
            ${event.price}
          </span>
          <div className="flex items-center gap-2">
            <Link
              to={`/events/${event._id}`}
              style={{ color: '#7C3AED', border: '1.5px solid #7C3AED' }}
              className="text-sm px-4 py-2 rounded-full hover:bg-violet-50 transition font-bold"
            >
              View Details
            </Link>
            <Link
              to={`/book/${event._id}`}
              style={{ backgroundColor: '#FF8A00' }}
              className="text-white text-sm px-4 py-2 rounded-full hover:opacity-90 transition font-bold shadow"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;