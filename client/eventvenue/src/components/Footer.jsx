import { Link } from 'react-router-dom';
import { MdEventNote } from 'react-icons/md';

const Footer = () => (
  <footer style={{ backgroundColor: '#1E293B' }} className="text-gray-400 pt-14 pb-6 px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

      <div className="md:col-span-2">
        <div className="flex items-center gap-2 font-extrabold text-xl mb-3 text-white">
          <MdEventNote style={{ color: '#8B5CF6' }} className="text-2xl" />
          Event<span style={{ color: '#FCD34D' }}>Venue</span>
        </div>
        <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
          Your go-to platform for discovering and booking amazing events. Thousands of experiences waiting for you.
        </p>
        <div className="flex gap-3 mt-4">
          {['🐦', '📘', '📸'].map((icon, i) => (
            <span key={i} style={{ backgroundColor: '#334155' }} className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
              {icon}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-white font-bold mb-4">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          {[
            { label: 'Home', to: '/' },
            { label: 'Events', to: '/events' },
            { label: 'Login', to: '/login' },
            { label: 'Register', to: '/register' },
          ].map(l => (
            <li key={l.label}>
              <Link to={l.to} className="hover:text-white transition flex items-center gap-1">
                <span style={{ color: '#8B5CF6' }}>›</span> {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-white font-bold mb-4">Contact</h4>
        <ul className="space-y-3 text-sm">
          <li>📧 support@eventvenue.com</li>
          <li>📞 +1 (800) 123-4567</li>
          <li>📍 New York, USA</li>
        </ul>
      </div>
    </div>

    <div style={{ borderTop: '1px solid #334155' }} className="pt-6 text-center text-sm text-gray-500">
      © {new Date().getFullYear()}{' '}
      <span style={{ color: '#8B5CF6' }} className="font-semibold">EventVenue</span>
      . All rights reserved.
    </div>
  </footer>
);

export default Footer;
