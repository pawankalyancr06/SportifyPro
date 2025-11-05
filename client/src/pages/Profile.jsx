import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Star, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getBookings } from '../api/bookings';
import BookingCard from '../components/ui/BookingCard';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const stats = {
    matchesBooked: bookings.length,
    hoursPlayed: bookings.reduce((sum, b) => sum + (b.duration || 1), 0),
    favoriteVenues: 3,
  };

  const tabs = [
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-secondary pt-20 md:pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 md:py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl md:rounded-2xl p-6 md:p-8 mb-6 md:mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-primary flex items-center justify-center">
                <User className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-secondary" />
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-primary rounded-full border-2 sm:border-4 border-secondary"></div>
            </div>
            <div className="flex-1 text-center md:text-left w-full">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black gradient-text mb-2">
                {user?.name || 'User'}
              </h1>
              <p className="text-neutral mb-4 md:mb-6 text-sm sm:text-base">{user?.email || 'user@example.com'}</p>
              <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start">
                <div className="glass rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 md:px-6">
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-1">{stats.matchesBooked}</div>
                  <div className="text-xs sm:text-sm text-neutral">Matches Booked</div>
                </div>
                <div className="glass rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 md:px-6">
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-1">{stats.hoursPlayed}</div>
                  <div className="text-xs sm:text-sm text-neutral">Hours Played</div>
                </div>
                <div className="glass rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 md:px-6">
                  <div className="text-xl sm:text-2xl font-bold text-primary mb-1">{stats.favoriteVenues}</div>
                  <div className="text-xs sm:text-sm text-neutral">Favorites</div>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="btn-glow glass border border-accent1/50 text-accent1 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-bold flex items-center gap-2 hover:border-accent1 transition text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              Logout
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 rounded-xl font-bold transition whitespace-nowrap text-sm sm:text-base ${
                activeTab === tab.id
                  ? 'bg-gradient-primary text-secondary'
                  : 'glass text-neutral hover:text-primary'
              }`}
            >
              <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8">
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-2xl font-heading font-bold mb-6">My Bookings</h2>
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-neutral mx-auto mb-4 opacity-50" />
                  <p className="text-neutral text-lg">No bookings yet</p>
                  <p className="text-neutral text-sm mt-2">Start booking venues to see them here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-2xl font-heading font-bold mb-6">Favorite Venues</h2>
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-neutral mx-auto mb-4 opacity-50" />
                <p className="text-neutral text-lg">No favorites yet</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-heading font-bold mb-6">Settings</h2>
              <div className="space-y-4">
                <div className="glass rounded-xl p-4">
                  <label className="block text-sm font-bold text-neutral mb-2">Notification Preferences</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" defaultChecked />
                      <span className="text-neutral">Email notifications</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" defaultChecked />
                      <span className="text-neutral">Booking reminders</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
