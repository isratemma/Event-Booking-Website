import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiMenuAlt3, HiX, HiTicket } from 'react-icons/hi';
import { MdHome, MdEvent, MdDashboard } from 'react-icons/md';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Re-read user from localStorage on every route change
  useEffect(() => {
    const stored = localStorage.getItem('user');
    setUser(stored ? JSON.parse(stored) : null);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ background: 'linear-gradient(90deg, #7C3AED 0%, #6D28D9 100%)' }} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white font-extrabold text-xl tracking-tight">
            {/* Custom Event icon */}
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FF8A00, #FCD34D)' }}>
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <rect x="3" y="4" width="18" height="17" rx="2" stroke="white" strokeWidth="2" fill="none"/>
                  <path d="M3 9h18" stroke="white" strokeWidth="2"/>
                  <path d="M8 2v4M16 2v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="8.5" cy="14" r="1.5" fill="white"/>
                  <circle cx="12" cy="14" r="1.5" fill="white"/>
                  <circle cx="15.5" cy="14" r="1.5" fill="white"/>
                </svg>
              </div>
              {/* notification dot */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-violet-700"
                style={{ backgroundColor: '#FF8A00' }} />
            </div>
            <span>
              Event<span style={{ color: '#FCD34D' }}>Venue</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { to: '/', label: 'Home', icon: <MdHome className="text-base" /> },
              { to: '/events', label: 'Events', icon: <MdEvent className="text-base" /> },
              ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Dashboard', icon: <MdDashboard className="text-base" /> }] : []),
              ...(user?.role === 'user' ? [{ to: '/dashboard', label: 'My Bookings', icon: <HiTicket className="text-base" /> }] : []),
            ].map(({ to, label, icon }) => (
              <Link key={to} to={to}
                className="flex items-center gap-1.5 text-sm font-semibold transition-all relative pb-0.5"
                style={{ color: isActive(to) ? '#FCD34D' : '#E9D5FF' }}>
                {icon}
                {label}
                {isActive(to) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: '#FCD34D' }} />
                )}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#FF8A00,#e67a00)' }}>
                    {user.avatar
                      ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                      : user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-white">{user.name} 👋</span>
                </div>
                <button onClick={handleLogout}
                  className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-white hover:bg-red-50 transition"
                  style={{ color: '#DC2626' }}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login"
                  className="text-sm font-semibold px-4 py-1.5 rounded-lg border border-white/40 text-white hover:bg-white/10 transition">
                  Login
                </Link>
                <Link to="/register"
                  className="text-sm font-semibold px-4 py-1.5 rounded-lg text-white hover:opacity-90 transition"
                  style={{ background: 'linear-gradient(90deg,#FF8A00,#e67a00)' }}>
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: '#6D28D9', borderTop: '1px solid rgba(255,255,255,0.15)' }}
          className="md:hidden px-4 py-4 flex flex-col gap-3">
          {[
            { to: '/', label: 'Home', icon: <MdHome /> },
            { to: '/events', label: 'Events', icon: <MdEvent /> },
            ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Dashboard', icon: <MdDashboard /> }] : []),
            ...(user?.role === 'user' ? [{ to: '/dashboard', label: 'My Bookings', icon: <HiTicket /> }] : []),
          ].map(({ to, label, icon }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 font-semibold py-2 px-3 rounded-lg text-sm transition"
              style={{
                color: isActive(to) ? '#FCD34D' : '#E9D5FF',
                backgroundColor: isActive(to) ? 'rgba(255,255,255,0.1)' : 'transparent',
              }}>
              {icon}
              {label}
            </Link>
          ))}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }} className="pt-3 mt-1 flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold text-white"
                    style={{ background: 'linear-gradient(135deg,#FF8A00,#e67a00)' }}>
                    {user.avatar
                      ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                      : user.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs" style={{ color: '#C4B5FD' }}>{user.email}</p>
                  </div>
                </div>
                <button onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="text-sm font-semibold px-4 py-2 rounded-lg bg-white text-left"
                  style={{ color: '#DC2626' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold px-4 py-2 rounded-lg border text-center text-white"
                  style={{ borderColor: 'rgba(255,255,255,0.4)' }}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold px-4 py-2 rounded-lg text-white text-center hover:opacity-90"
                  style={{ background: 'linear-gradient(90deg,#FF8A00,#e67a00)' }}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
