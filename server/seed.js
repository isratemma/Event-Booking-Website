const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Event = require('./models/Event');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    await User.deleteMany();
    await Event.deleteMany();
    console.log('🗑️  Existing data cleared');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      { name: 'Admin User', email: 'admin@eventvenue.com', password: hashedPassword, role: 'admin', isVerified: true },
      { name: 'Emma Johnson', email: 'emma@example.com', password: hashedPassword, role: 'user', isVerified: true },
      { name: 'James Smith', email: 'james@example.com', password: hashedPassword, role: 'user', isVerified: true },
      { name: 'Sophia Lee', email: 'sophia@example.com', password: hashedPassword, role: 'user', isVerified: true },
      { name: 'Daniel Brown', email: 'daniel@example.com', password: hashedPassword, role: 'user', isVerified: true },
    ]);
    console.log(`👤 ${users.length} users inserted`);

    const admin = users[0];

    const events = await Event.insertMany([

      // ── GALA ──
      {
        title: 'Summer Gala Night',
        description: 'An elegant evening of music, dining, and entertainment under the stars. Dress to impress.',
        date: new Date('2026-08-15'), time: '7:00 PM', venue: 'Grand Ballroom', location: 'New York',
        price: 120, ticketPrice: 120, availableSeats: 150, totalSeats: 150, bookedSeats: 0, ticketsSold: 0,
        category: 'Gala', imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Black Tie Charity Gala',
        description: "A glamorous charity event supporting children's education with fine dining and live music.",
        date: new Date('2026-09-20'), time: '8:00 PM', venue: 'The Ritz Ballroom', location: 'Los Angeles',
        price: 250, ticketPrice: 250, availableSeats: 100, totalSeats: 100, bookedSeats: 0, ticketsSold: 0,
        category: 'Gala', imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: "New Year's Eve Gala 2027",
        description: 'Ring in the new year with live music, gourmet dining, and a midnight champagne toast.',
        date: new Date('2026-12-31'), time: '9:00 PM', venue: 'Sky Lounge Penthouse', location: 'Miami',
        price: 300, ticketPrice: 300, availableSeats: 80, totalSeats: 80, bookedSeats: 0, ticketsSold: 0,
        category: 'Gala', imageUrl: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Autumn Masquerade Gala',
        description: 'A mysterious and glamorous masquerade ball with themed cocktails and dancing.',
        date: new Date('2026-10-30'), time: '8:00 PM', venue: 'Heritage Manor', location: 'Boston',
        price: 175, ticketPrice: 175, availableSeats: 120, totalSeats: 120, bookedSeats: 0, ticketsSold: 0,
        category: 'Gala', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        organizer: admin._id, isActive: true,
      },

      // ── CONFERENCE ──
      {
        title: 'Tech Conference 2026',
        description: 'Join the biggest tech minds for talks on AI, Web3, and the future of software development.',
        date: new Date('2026-09-10'), time: '9:00 AM', venue: 'Convention Center Hall A', location: 'San Francisco',
        price: 80, ticketPrice: 80, availableSeats: 500, totalSeats: 500, bookedSeats: 0, ticketsSold: 0,
        category: 'Conference', imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Global Marketing Summit',
        description: 'Premier event for marketing professionals with keynotes, workshops and networking.',
        date: new Date('2026-10-12'), time: '8:30 AM', venue: 'Marriott Conference Center', location: 'Chicago',
        price: 60, ticketPrice: 60, availableSeats: 400, totalSeats: 400, bookedSeats: 0, ticketsSold: 0,
        category: 'Conference', imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Healthcare Innovation Forum',
        description: 'Bringing together doctors, researchers, and entrepreneurs to shape the future of healthcare.',
        date: new Date('2026-11-05'), time: '9:00 AM', venue: 'Medical Research Center', location: 'Boston',
        price: 90, ticketPrice: 90, availableSeats: 300, totalSeats: 300, bookedSeats: 0, ticketsSold: 0,
        category: 'Conference', imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Design & UX World Summit',
        description: 'A must-attend for designers, product managers, and creatives focused on user experience.',
        date: new Date('2026-08-22'), time: '9:00 AM', venue: 'Design Hub Center', location: 'Austin',
        price: 70, ticketPrice: 70, availableSeats: 350, totalSeats: 350, bookedSeats: 0, ticketsSold: 0,
        category: 'Conference', imageUrl: 'https://images.unsplash.com/photo-1560439513-74b037a25d84?w=800',
        organizer: admin._id, isActive: true,
      },

      // ── ENTERTAINMENT ──
      {
        title: 'Jazz & Wine Evening',
        description: 'A relaxed evening with live jazz performances paired with premium wine tasting.',
        date: new Date('2026-07-20'), time: '6:30 PM', venue: 'Rooftop Lounge', location: 'Chicago',
        price: 65, ticketPrice: 65, availableSeats: 80, totalSeats: 80, bookedSeats: 0, ticketsSold: 0,
        category: 'Entertainment', imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Stand-Up Comedy Night',
        description: 'A hilarious night featuring top comedians. Guaranteed laughs, great drinks.',
        date: new Date('2026-08-02'), time: '8:00 PM', venue: 'Laugh Factory Club', location: 'Las Vegas',
        price: 35, ticketPrice: 35, availableSeats: 200, totalSeats: 200, bookedSeats: 0, ticketsSold: 0,
        category: 'Entertainment', imageUrl: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Live Orchestra: Beethoven Night',
        description: 'Timeless masterpieces of Beethoven performed live by the City Philharmonic Orchestra.',
        date: new Date('2026-09-25'), time: '7:30 PM', venue: 'Symphony Hall', location: 'New York',
        price: 75, ticketPrice: 75, availableSeats: 600, totalSeats: 600, bookedSeats: 0, ticketsSold: 0,
        category: 'Entertainment', imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Rooftop Movie Night',
        description: 'Watch classic films under the stars with popcorn, blankets, and city views.',
        date: new Date('2026-07-12'), time: '8:30 PM', venue: 'Skyline Rooftop', location: 'Los Angeles',
        price: 25, ticketPrice: 25, availableSeats: 150, totalSeats: 150, bookedSeats: 0, ticketsSold: 0,
        category: 'Entertainment', imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
        organizer: admin._id, isActive: true,
      },

      // ── EXPO ──
      {
        title: 'Wedding Expo 2026',
        description: 'Discover top vendors, venues, and inspiration for your perfect wedding day.',
        date: new Date('2026-10-05'), time: '10:00 AM', venue: 'City Exhibition Hall', location: 'Los Angeles',
        price: 20, ticketPrice: 20, availableSeats: 300, totalSeats: 300, bookedSeats: 0, ticketsSold: 0,
        category: 'Expo', imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Food & Beverage Expo',
        description: 'Taste, discover, and connect with hundreds of food brands, chefs, and culinary innovators.',
        date: new Date('2026-08-28'), time: '11:00 AM', venue: 'National Exhibition Center', location: 'Houston',
        price: 25, ticketPrice: 25, availableSeats: 1000, totalSeats: 1000, bookedSeats: 0, ticketsSold: 0,
        category: 'Expo', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Startup World Expo',
        description: "The world's largest startup showcase — pitch competitions, investor meetups, and live demos.",
        date: new Date('2026-11-15'), time: '9:00 AM', venue: 'Tech Innovation Hub', location: 'San Francisco',
        price: 45, ticketPrice: 45, availableSeats: 800, totalSeats: 800, bookedSeats: 0, ticketsSold: 0,
        category: 'Expo', imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
        organizer: admin._id, isActive: true,
      },

      // ── CORPORATE ──
      {
        title: 'Corporate Awards Dinner',
        description: 'Annual recognition dinner celebrating excellence and achievements across industries.',
        date: new Date('2026-11-18'), time: '6:00 PM', venue: 'The Grand Hotel Ballroom', location: 'Miami',
        price: 200, ticketPrice: 200, availableSeats: 200, totalSeats: 200, bookedSeats: 0, ticketsSold: 0,
        category: 'Corporate', imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Leadership & Strategy Summit',
        description: 'Full-day summit for C-suite executives exploring growth strategies and leadership.',
        date: new Date('2026-10-22'), time: '8:00 AM', venue: 'Hilton Business Center', location: 'Dallas',
        price: 150, ticketPrice: 150, availableSeats: 250, totalSeats: 250, bookedSeats: 0, ticketsSold: 0,
        category: 'Corporate', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Annual Team Building Retreat',
        description: 'Two-day retreat focused on team building, creative workshops, and outdoor activities.',
        date: new Date('2026-09-05'), time: '8:00 AM', venue: 'Mountain View Resort', location: 'Denver',
        price: 180, ticketPrice: 180, availableSeats: 120, totalSeats: 120, bookedSeats: 0, ticketsSold: 0,
        category: 'Corporate', imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800',
        organizer: admin._id, isActive: true,
      },

      // ── WEDDING ──
      {
        title: 'Elegant Garden Wedding Showcase',
        description: 'Experience a stunning garden wedding setup with floral arrangements, catering demos, and live string quartet.',
        date: new Date('2026-07-25'), time: '4:00 PM', venue: 'Rosewood Gardens', location: 'Charleston',
        price: 0, ticketPrice: 0, availableSeats: 200, totalSeats: 200, bookedSeats: 0, ticketsSold: 0,
        category: 'Wedding', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Grand Ballroom Wedding Package',
        description: 'A luxurious ballroom wedding experience with gourmet dining, dance floor, and premium décor.',
        date: new Date('2026-09-14'), time: '5:00 PM', venue: 'The Imperial Ballroom', location: 'New York',
        price: 150, ticketPrice: 150, availableSeats: 300, totalSeats: 300, bookedSeats: 0, ticketsSold: 0,
        category: 'Wedding', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Beachside Wedding Ceremony',
        description: 'An intimate beachside wedding ceremony with sunset views, barefoot cocktails, and ocean breeze.',
        date: new Date('2026-11-08'), time: '5:30 PM', venue: 'Malibu Beach Club', location: 'Malibu',
        price: 200, ticketPrice: 200, availableSeats: 100, totalSeats: 100, bookedSeats: 0, ticketsSold: 0,
        category: 'Wedding', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Rustic Barn Wedding Experience',
        description: 'A charming rustic barn wedding with fairy lights, wood décor, country music, and farm-to-table dining.',
        date: new Date('2026-08-30'), time: '3:00 PM', venue: 'Sunflower Barn Estate', location: 'Nashville',
        price: 120, ticketPrice: 120, availableSeats: 150, totalSeats: 150, bookedSeats: 0, ticketsSold: 0,
        category: 'Wedding', imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Rooftop Sunset Wedding',
        description: 'Say I do above the city skyline. A stunning rooftop ceremony with panoramic views and champagne reception.',
        date: new Date('2026-10-18'), time: '6:00 PM', venue: 'Sky High Events Rooftop', location: 'Chicago',
        price: 175, ticketPrice: 175, availableSeats: 80, totalSeats: 80, bookedSeats: 0, ticketsSold: 0,
        category: 'Wedding', imageUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Vintage Wedding Fair',
        description: 'Explore vintage themes, antique decorations, retro catering, and classic wedding photography styles.',
        date: new Date('2026-07-05'), time: '11:00 AM', venue: 'Old Town Hall', location: 'Savannah',
        price: 15, ticketPrice: 15, availableSeats: 250, totalSeats: 250, bookedSeats: 0, ticketsSold: 0,
        category: 'Wedding', imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800',
        organizer: admin._id, isActive: true,
      },

      // ── BIRTHDAY ──
      {
        title: 'Luxury Birthday Bash',
        description: 'Celebrate your special day in style with premium catering, a DJ, personalized cake, and VIP lounge.',
        date: new Date('2026-08-10'), time: '7:00 PM', venue: 'Prestige Events Hall', location: 'Las Vegas',
        price: 85, ticketPrice: 85, availableSeats: 100, totalSeats: 100, bookedSeats: 0, ticketsSold: 0,
        category: 'Birthday', imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Kids Birthday Party Extravaganza',
        description: 'The ultimate kids party with clowns, magic shows, face painting, bouncy castles, and unlimited fun.',
        date: new Date('2026-07-18'), time: '2:00 PM', venue: 'FunZone Party Center', location: 'Orlando',
        price: 40, ticketPrice: 40, availableSeats: 80, totalSeats: 80, bookedSeats: 0, ticketsSold: 0,
        category: 'Birthday', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Rooftop Birthday Celebration',
        description: 'Celebrate your birthday with panoramic city views, cocktails, and a live DJ.',
        date: new Date('2026-09-03'), time: '8:00 PM', venue: 'Skyline Rooftop Bar', location: 'New York',
        price: 60, ticketPrice: 60, availableSeats: 120, totalSeats: 120, bookedSeats: 0, ticketsSold: 0,
        category: 'Birthday', imageUrl: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Garden Birthday Brunch',
        description: 'A beautiful outdoor birthday brunch with floral décor, bottomless mimosas, and brunch favorites.',
        date: new Date('2026-08-16'), time: '11:00 AM', venue: 'Bloom Garden Venue', location: 'San Diego',
        price: 55, ticketPrice: 55, availableSeats: 60, totalSeats: 60, bookedSeats: 0, ticketsSold: 0,
        category: 'Birthday', imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Retro 80s Birthday Party',
        description: 'Step back in time with neon lights, retro hits, vintage arcade games, and 80s themed cocktails.',
        date: new Date('2026-10-10'), time: '7:30 PM', venue: 'Neon Nights Venue', location: 'Miami',
        price: 50, ticketPrice: 50, availableSeats: 150, totalSeats: 150, bookedSeats: 0, ticketsSold: 0,
        category: 'Birthday', imageUrl: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Pool Party Birthday Bash',
        description: 'Splash into your birthday with a luxurious pool party featuring live music, BBQ, and cocktails.',
        date: new Date('2026-07-28'), time: '1:00 PM', venue: 'Paradise Pool Club', location: 'Phoenix',
        price: 45, ticketPrice: 45, availableSeats: 200, totalSeats: 200, bookedSeats: 0, ticketsSold: 0,
        category: 'Birthday', imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800',
        organizer: admin._id, isActive: true,
      },
      {
        title: 'Elegant 50th Birthday Dinner',
        description: 'A refined dinner celebration with gourmet menu, live pianist, floral centrepieces, and speeches.',
        date: new Date('2026-11-22'), time: '7:00 PM', venue: 'The Marquee Dining Room', location: 'Boston',
        price: 95, ticketPrice: 95, availableSeats: 60, totalSeats: 60, bookedSeats: 0, ticketsSold: 0,
        category: 'Birthday', imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
        organizer: admin._id, isActive: true,
      },
    ]);

    console.log(`🎉 ${events.length} events inserted`);
    console.log('\n✅ Seed complete!');
    console.log('─────────────────────────────');
    console.log('Admin:  admin@eventvenue.com / password123');
    console.log('User:   emma@example.com / password123');
    console.log('─────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
