import React, { useState, useEffect, useContext, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Plus, ChevronDown, Star, X, Menu, User, Bell, Gift, Download, Check, Crown, Lock, CreditCard, Smartphone, Tv, Monitor, Heart, Clock, Filter, Calendar, TrendingUp, Award, Moon, Sun, Share2, BarChart3, Users, Zap, Palette, Eye, EyeOff, Settings, Film, Tv2, Bookmark } from 'lucide-react';

// TMDB API Configuration
const TMDB_API_KEY = 'c8dea14dc917687ac631a52620e4f7ad';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Theme Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('streamflix_theme');
    return saved ? JSON.parse(saved) : true;
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('streamflix_theme', JSON.stringify(!isDarkMode));
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div className={isDarkMode ? 'dark' : 'light'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

// Enhanced Subscription Plans with trials and annual options
const SUBSCRIPTION_PLANS = {
  FREE: { 
    name: 'Free', 
    price: 0, 
    annualPrice: 0,
    downloads: 0, 
    quality: '480p', 
    devices: 1, 
    ads: true,
    trial: false,
    profiles: 1,
    features: ['Basic content', 'Watch on 1 device', 'Ad-supported']
  },
  PREMIUM: { 
    name: 'Premium', 
    price: 12.99, 
    annualPrice: 119.99,
    downloads: 10, 
    quality: '1080p', 
    devices: 2, 
    ads: false,
    trial: true,
    trialDays: 7,
    profiles: 2,
    features: ['HD content', 'Watch on 2 devices', 'No ads', '10 downloads/month', 'Continue watching']
  },
  PRO: { 
    name: 'Pro', 
    price: 19.99, 
    annualPrice: 199.99,
    downloads: 50, 
    quality: '4K', 
    devices: 4, 
    ads: false,
    trial: true,
    trialDays: 14,
    profiles: 5,
    features: ['4K Ultra HD', 'Watch on 4 devices', 'No ads', '50 downloads/month', 'All premium features', 'Early access content']
  }
};

// User Badges System
const USER_BADGES = [
  { id: 'movie_buff', name: 'Movie Buff', description: 'Watched 50+ movies', icon: '🎬', requirement: 50 },
  { id: 'series_addict', name: 'Series Addict', description: 'Watched 20+ TV shows', icon: '📺', requirement: 20 },
  { id: 'early_bird', name: 'Early Bird', description: 'Premium subscriber for 6+ months', icon: '🌅', requirement: 180 },
  { id: 'binge_watcher', name: 'Binge Watcher', description: '100+ hours watched', icon: '⏰', requirement: 100 },
  { id: 'reviewer', name: 'Top Reviewer', description: 'Left 25+ reviews', icon: '⭐', requirement: 25 },
  { id: 'downloader', name: 'Offline Expert', description: '50+ downloads', icon: '📱', requirement: 50 }
];

// Mock user data with enhanced features
const createDefaultUser = () => ({
  id: Date.now(),
  name: 'John Doe',
  email: 'user@streamflix.com',
  subscription: 'FREE',
  subscriptionStartDate: new Date().toISOString(),
  trialActive: false,
  trialUsed: false,
  downloadsUsed: 0,
  downloadedMovies: [],
  watchlist: [],
  watchHistory: [],
  continueWatching: [],
  ratings: {},
  preferences: {
    genres: [],
    languages: ['en'],
    autoplay: true,
    subtitles: true
  },
  profiles: [
    {
      id: 1,
      name: 'John',
      avatar: '👨',
      isMain: true,
      isKid: false,
      watchHistory: [],
      watchlist: [],
      preferences: {}
    }
  ],
  currentProfile: 1,
  badges: [],
  watchTimeMinutes: 0,
  joinDate: new Date().toISOString(),
  settings: {
    notifications: true,
    autoplay: true,
    dataUsage: 'high'
  }
});

// Promo Codes
const PROMO_CODES = {
  'WELCOME25': { discount: 25, type: 'percentage', description: '25% off first month' },
  'STUDENT50': { discount: 50, type: 'percentage', description: '50% off for students' },
  'ANNUAL20': { discount: 20, type: 'percentage', description: '20% off annual plans' },
  'FREEMONTH': { discount: 100, type: 'percentage', description: 'First month free' }
};

// Utility functions
const truncateText = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

const getMockUser = () => {
  const savedUser = localStorage.getItem('streamflix_user');
  if (savedUser) {
    return { ...createDefaultUser(), ...JSON.parse(savedUser) };
  }
  return null;
};

const saveUser = (user) => {
  localStorage.setItem('streamflix_user', JSON.stringify(user));
};

// Enhanced Auth Modal with profile creation
export const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const user = {
        ...createDefaultUser(),
        name: isLogin ? 'John Doe' : formData.name,
        email: formData.email,
        id: Date.now(),
        joinDate: new Date().toISOString()
      };
      
      saveUser(user);
      onLogin(user);
      onClose();
      setIsLoading(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-900 dark:bg-gray-900 rounded-lg max-w-md w-full p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-white text-2xl font-bold mb-6 text-center">
            {isLogin ? 'Welcome Back to StreamFlix' : 'Join StreamFlix Today'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
          
          {!isLogin && (
            <div className="mt-4 p-3 bg-green-900/30 rounded-lg border border-green-500">
              <p className="text-green-400 text-sm text-center">
                🎉 Get 7 days free trial with Premium plan!
              </p>
            </div>
          )}
          
          <p className="text-gray-400 text-center mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-500 hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Enhanced Subscription Modal with trials, annual plans, and promo codes
export const SubscriptionModal = ({ isOpen, onClose, currentUser, onUpgrade }) => {
  const [selectedPlan, setSelectedPlan] = useState('PREMIUM');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isAnnual, setIsAnnual] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const applyPromoCode = () => {
    const promo = PROMO_CODES[promoCode.toUpperCase()];
    if (promo) {
      setAppliedPromo(promo);
    } else {
      alert('Invalid promo code');
    }
  };

  const calculatePrice = (plan) => {
    const basePrice = isAnnual ? plan.annualPrice : plan.price;
    if (appliedPromo) {
      return basePrice * (1 - appliedPromo.discount / 100);
    }
    return basePrice;
  };

  const handleUpgrade = () => {
    const updatedUser = {
      ...currentUser,
      subscription: selectedPlan,
      subscriptionStartDate: new Date().toISOString(),
      trialActive: !currentUser.trialUsed && SUBSCRIPTION_PLANS[selectedPlan].trial,
      trialUsed: currentUser.trialUsed || SUBSCRIPTION_PLANS[selectedPlan].trial
    };
    
    saveUser(updatedUser);
    onUpgrade(updatedUser);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-white text-3xl font-bold">Choose Your StreamFlix Plan</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Annual Toggle */}
            <div className="flex items-center justify-center mb-8">
              <span className="text-white mr-4">Monthly</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isAnnual ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-white ml-4">Annual</span>
              {isAnnual && (
                <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                  Save 20%
                </span>
              )}
            </div>

            {/* Plans */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
                <motion.div
                  key={key}
                  className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    selectedPlan === key
                      ? 'border-red-500 bg-red-500/10 scale-105'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedPlan(key)}
                  whileHover={{ scale: selectedPlan === key ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {key === 'PRO' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center">
                        <Crown className="w-3 h-3 mr-1" />
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  
                  {key !== 'FREE' && plan.trial && !currentUser?.trialUsed && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {plan.trialDays} Days Free
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="text-white text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-white mb-4">
                      ${calculatePrice(plan).toFixed(2)}
                      <span className="text-gray-400 text-base">
                        /{isAnnual ? 'year' : 'month'}
                      </span>
                    </div>
                    
                    <ul className="space-y-3 text-left mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-300">
                          <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="text-xs text-gray-400 space-y-1">
                      <p>👥 {plan.profiles} profile{plan.profiles > 1 ? 's' : ''}</p>
                      <p>📱 {plan.devices} device{plan.devices > 1 ? 's' : ''}</p>
                      <p>🎬 {plan.quality} quality</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="mb-6 bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">Have a promo code?</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={applyPromoCode}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium"
                >
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <div className="mt-2 text-green-400 text-sm">
                  ✅ {appliedPromo.description} applied!
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="text-white text-xl font-semibold mb-4">Payment Method</h3>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-white mr-2" />
                  <span className="text-white">Credit Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <span className="text-white font-bold">PayPal</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('gift')}
                  className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'gift'
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Gift className="w-5 h-5 text-white mr-2" />
                  <span className="text-white">Gift Card</span>
                </button>
              </div>
            </div>

            <motion.button
              onClick={handleUpgrade}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg text-lg transition-colors"
            >
              {SUBSCRIPTION_PLANS[selectedPlan].trial && !currentUser?.trialUsed
                ? `Start ${SUBSCRIPTION_PLANS[selectedPlan].trialDays}-Day Free Trial`
                : `Subscribe to ${SUBSCRIPTION_PLANS[selectedPlan].name} - $${calculatePrice(SUBSCRIPTION_PLANS[selectedPlan]).toFixed(2)}/${isAnnual ? 'year' : 'month'}`
              }
            </motion.button>

            <p className="text-gray-400 text-center mt-4 text-sm">
              Cancel anytime. No hidden fees. Terms and conditions apply.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Enhanced Downloads Modal with progress and management
export const DownloadsModal = ({ isOpen, onClose, currentUser, onRemoveDownload }) => {
  const [sortBy, setSortBy] = useState('recent');
  
  if (!isOpen) return null;

  const downloadedMovies = currentUser?.downloadedMovies || [];
  const plan = SUBSCRIPTION_PLANS[currentUser?.subscription || 'FREE'];
  const usagePercentage = plan.downloads > 0 ? (currentUser?.downloadsUsed || 0) / plan.downloads * 100 : 0;

  const sortedMovies = [...downloadedMovies].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return (a.title || a.name).localeCompare(b.title || b.name);
      case 'rating':
        return b.vote_average - a.vote_average;
      default:
        return new Date(b.downloadDate) - new Date(a.downloadDate);
    }
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-bold flex items-center">
                <Download className="w-6 h-6 mr-2" />
                My Downloads
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Storage Usage */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">Storage Usage</h3>
                  <p className="text-gray-400">
                    {currentUser?.downloadsUsed || 0} / {plan.downloads} downloads used
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{plan.quality} Quality</p>
                  <p className="text-gray-400">{plan.name} Plan</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
              <p className="text-gray-400 text-sm">{usagePercentage.toFixed(1)}% used</p>
            </div>

            {downloadedMovies.length > 0 && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-400">{downloadedMovies.length} downloaded item(s)</p>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-red-500"
                >
                  <option value="recent">Recently Downloaded</option>
                  <option value="title">Title A-Z</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            )}

            {downloadedMovies.length === 0 ? (
              <div className="text-center py-12">
                <Download className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">No Downloads Yet</h3>
                <p className="text-gray-400 mb-4">
                  Start downloading your favorite movies and shows for offline viewing
                </p>
                {plan.downloads === 0 && (
                  <p className="text-yellow-400 font-medium">
                    Upgrade to Premium or Pro to enable downloads
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedMovies.map((movie) => (
                  <motion.div 
                    key={movie.id} 
                    className="flex items-center bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <img
                      src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/api/placeholder/80/120'}
                      alt={movie.title || movie.name}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="text-white font-semibold">{movie.title || movie.name}</h4>
                      <p className="text-gray-400 text-sm">
                        Downloaded • {plan.quality} • {new Date(movie.downloadDate || Date.now()).toLocaleDateString()}
                      </p>
                      <div className="flex items-center mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-gray-300 text-sm">{movie.vote_average?.toFixed(1)}</span>
                        <span className="text-gray-500 mx-2">•</span>
                        <span className="text-gray-300 text-sm">
                          {new Date(movie.release_date || movie.first_air_date).getFullYear()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Play Offline
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onRemoveDownload(movie)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                      >
                        Remove
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// User Profile & Settings Modal
export const ProfileModal = ({ isOpen, onClose, currentUser, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState(currentUser || {});

  if (!isOpen) return null;

  const plan = SUBSCRIPTION_PLANS[currentUser?.subscription || 'FREE'];
  const earnedBadges = USER_BADGES.filter(badge => {
    switch (badge.id) {
      case 'movie_buff':
        return currentUser?.watchHistory?.filter(item => item.media_type !== 'tv').length >= badge.requirement;
      case 'series_addict':
        return currentUser?.watchHistory?.filter(item => item.media_type === 'tv').length >= badge.requirement;
      case 'early_bird':
        return (Date.now() - new Date(currentUser?.subscriptionStartDate || 0)) / (1000 * 60 * 60 * 24) >= badge.requirement;
      case 'binge_watcher':
        return (currentUser?.watchTimeMinutes || 0) >= badge.requirement * 60;
      case 'reviewer':
        return Object.keys(currentUser?.ratings || {}).length >= badge.requirement;
      case 'downloader':
        return (currentUser?.downloadedMovies?.length || 0) >= badge.requirement;
      default:
        return false;
    }
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-white text-2xl font-bold">Profile & Settings</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
              {[
                { key: 'profile', label: 'Profile', icon: User },
                { key: 'subscription', label: 'Subscription', icon: Crown },
                { key: 'badges', label: 'Badges', icon: Award },
                { key: 'settings', label: 'Settings', icon: Settings }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
                    activeTab === key
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-2xl">
                    👨
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-semibold">{currentUser?.name}</h3>
                    <p className="text-gray-400">{currentUser?.email}</p>
                    <p className="text-gray-400 text-sm">
                      Member since {new Date(currentUser?.joinDate || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Watch Statistics
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-300">Total Watch Time: {Math.floor((currentUser?.watchTimeMinutes || 0) / 60)}h {(currentUser?.watchTimeMinutes || 0) % 60}m</p>
                      <p className="text-gray-300">Movies Watched: {currentUser?.watchHistory?.filter(item => item.media_type !== 'tv').length || 0}</p>
                      <p className="text-gray-300">TV Shows Watched: {currentUser?.watchHistory?.filter(item => item.media_type === 'tv').length || 0}</p>
                      <p className="text-gray-300">Downloads: {currentUser?.downloadedMovies?.length || 0}</p>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Quick Stats
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-300">Watchlist Items: {currentUser?.watchlist?.length || 0}</p>
                      <p className="text-gray-300">Reviews Given: {Object.keys(currentUser?.ratings || {}).length}</p>
                      <p className="text-gray-300">Badges Earned: {earnedBadges.length}/{USER_BADGES.length}</p>
                      <p className="text-gray-300">Current Plan: {plan.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white text-xl font-semibold flex items-center">
                      <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                      {plan.name} Plan
                    </h3>
                    <span className="text-2xl font-bold text-white">
                      ${plan.price}/month
                    </span>
                  </div>
                  
                  {currentUser?.trialActive && (
                    <div className="bg-green-900/30 border border-green-500 rounded-lg p-3 mb-4">
                      <p className="text-green-400 font-medium">🎉 Free Trial Active</p>
                      <p className="text-green-300 text-sm">
                        Your trial ends in {Math.ceil((new Date(currentUser.subscriptionStartDate).getTime() + (SUBSCRIPTION_PLANS[currentUser.subscription].trialDays * 24 * 60 * 60 * 1000) - Date.now()) / (24 * 60 * 60 * 1000))} days
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <Tv className="w-8 h-8 text-red-500 mx-auto mb-1" />
                      <p className="text-gray-400 text-xs">Quality</p>
                      <p className="text-white font-semibold">{plan.quality}</p>
                    </div>
                    <div className="text-center">
                      <Monitor className="w-8 h-8 text-red-500 mx-auto mb-1" />
                      <p className="text-gray-400 text-xs">Devices</p>
                      <p className="text-white font-semibold">{plan.devices}</p>
                    </div>
                    <div className="text-center">
                      <Download className="w-8 h-8 text-red-500 mx-auto mb-1" />
                      <p className="text-gray-400 text-xs">Downloads</p>
                      <p className="text-white font-semibold">{plan.downloads || 'None'}</p>
                    </div>
                    <div className="text-center">
                      <Users className="w-8 h-8 text-red-500 mx-auto mb-1" />
                      <p className="text-gray-400 text-xs">Profiles</p>
                      <p className="text-white font-semibold">{plan.profiles}</p>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <Check className="w-4 h-4 text-green-500 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'badges' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-white text-xl font-semibold mb-2">Achievement Badges</h3>
                  <p className="text-gray-400">
                    You've earned {earnedBadges.length} out of {USER_BADGES.length} badges
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all"
                      style={{ width: `${(earnedBadges.length / USER_BADGES.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {USER_BADGES.map((badge) => {
                    const isEarned = earnedBadges.some(earned => earned.id === badge.id);
                    return (
                      <motion.div
                        key={badge.id}
                        className={`bg-gray-800 rounded-lg p-4 text-center transition-all ${
                          isEarned ? 'border-2 border-yellow-500' : 'opacity-60'
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-4xl mb-2">{badge.icon}</div>
                        <h4 className={`font-semibold ${isEarned ? 'text-yellow-400' : 'text-gray-400'}`}>
                          {badge.name}
                        </h4>
                        <p className="text-gray-500 text-sm">{badge.description}</p>
                        {isEarned && (
                          <div className="mt-2">
                            <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                              EARNED!
                            </span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="grid gap-6">
                  {/* Theme Settings */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-4 flex items-center">
                      <Palette className="w-4 h-4 mr-2" />
                      Appearance
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-gray-300">Dark Mode</label>
                        <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">
                          Always On
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Playback Settings */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-4 flex items-center">
                      <Play className="w-4 h-4 mr-2" />
                      Playback
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-gray-300">Autoplay</label>
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                          Enabled
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-gray-300">Subtitles</label>
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                          Enabled
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-4 flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Privacy
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-gray-300">Share Watch History</label>
                        <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm">
                          Disabled
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-gray-300">Recommendations</label>
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                          Enabled
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Continue Watching Component
export const ContinueWatching = ({ movies, onPlayTrailer, currentUser }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4 px-4 md:px-8 flex items-center">
        <Clock className="w-6 h-6 mr-2" />
        Continue Watching
      </h2>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4">
        {movies.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative flex-shrink-0 w-80 cursor-pointer group"
            onClick={() => onPlayTrailer(movie)}
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : '/api/placeholder/320/180'}
                alt={movie.title || movie.name}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                <div 
                  className="h-full bg-red-500 transition-all"
                  style={{ width: `${movie.watchProgress || 25}%` }}
                />
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center"
                >
                  <Play className="w-8 h-8 text-white fill-current" />
                </motion.div>
              </div>

              {/* Content Info */}
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white font-semibold text-sm mb-1">
                  {truncateText(movie.title || movie.name, 30)}
                </h3>
                <p className="text-gray-300 text-xs">
                  {movie.watchProgress || 25}% completed
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Header with theme toggle and advanced features
export const Header = ({ onSearch, searchQuery, setSearchQuery, currentUser, onShowAuth, onShowSubscription, onShowDownloads, onShowProfile, onLogout, onShowWatchlist }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const plan = SUBSCRIPTION_PLANS[currentUser?.subscription || 'FREE'];

  return (
    <motion.header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/90 dark:bg-black/90 backdrop-blur-md' 
          : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-8 bg-white rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-black fill-current" />
            </div>
            <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wider">STREAMFLIX</h1>
          </div>
          <nav className="hidden lg:flex space-x-6">
            <button className="text-white hover:text-gray-300 transition-colors">Home</button>
            <button className="text-white hover:text-gray-300 transition-colors">Movies</button>
            <button className="text-white hover:text-gray-300 transition-colors">TV Shows</button>
            <button className="text-white hover:text-gray-300 transition-colors">New & Popular</button>
            <button 
              onClick={onShowWatchlist}
              className="text-white hover:text-gray-300 transition-colors"
            >
              My List
            </button>
          </nav>
        </div>

        {/* Search and User Controls */}
        <div className="flex items-center space-x-4">
          {/* Advanced Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search movies, shows, actors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              className="bg-black/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 w-48 md:w-64"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-white hover:text-gray-300 p-2"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {currentUser ? (
            <>
              {/* Downloads */}
              <button 
                onClick={onShowDownloads}
                className="relative text-white hover:text-gray-300"
              >
                <Download className="w-6 h-6" />
                {currentUser.downloadsUsed > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {currentUser.downloadsUsed}
                  </span>
                )}
              </button>

              {/* Notifications */}
              <Bell className="text-white w-6 h-6 cursor-pointer hover:text-gray-300" />
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:text-gray-300"
                >
                  <div className="w-8 h-8 bg-red-500 rounded cursor-pointer hover:bg-red-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="hidden md:block">{currentUser.name}</span>
                  {currentUser.subscription !== 'FREE' && (
                    <Crown className="w-4 h-4 text-yellow-500" />
                  )}
                </button>

                {isUserMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 bg-gray-900 rounded-lg shadow-xl border border-gray-700 py-2 w-56"
                  >
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-white font-semibold">{currentUser.name}</p>
                      <p className="text-gray-400 text-sm">{plan.name} Plan</p>
                      {currentUser.trialActive && (
                        <p className="text-green-400 text-xs">Free Trial Active</p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => {
                        onShowProfile();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile & Settings
                    </button>
                    
                    <button
                      onClick={() => {
                        onShowWatchlist();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 flex items-center"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      My Watchlist ({currentUser.watchlist?.length || 0})
                    </button>
                    
                    <button
                      onClick={() => {
                        onShowSubscription();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 flex items-center"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </button>
                    
                    <button
                      onClick={() => {
                        onShowDownloads();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 flex items-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Downloads ({currentUser.downloadsUsed || 0})
                    </button>
                    
                    <div className="border-t border-gray-700 mt-2 pt-2">
                      <button
                        onClick={() => {
                          onLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-white hover:bg-gray-800"
                      >
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={onShowAuth}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

// Enhanced Hero Section with continue watching integration
export const HeroSection = ({ featuredMovie, onPlayTrailer, currentUser, onShowAuth, onShowSubscription, onAddToWatchlist }) => {
  if (!featuredMovie) return null;

  const plan = SUBSCRIPTION_PLANS[currentUser?.subscription || 'FREE'];
  const canWatch = currentUser && currentUser.subscription !== 'FREE';
  const isInWatchlist = currentUser?.watchlist?.some(item => item.id === featuredMovie.id);

  return (
    <section className="relative h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${IMAGE_BASE_URL}${featuredMovie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="px-4 md:px-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                FEATURED
              </span>
              {canWatch && (
                <span className="bg-yellow-600 text-black px-3 py-1 rounded-full text-sm font-semibold">
                  {plan.quality}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {featuredMovie.title || featuredMovie.name}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              {truncateText(featuredMovie.overview, 350)}
            </p>
            
            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <span className="text-white font-semibold text-lg">{featuredMovie.vote_average?.toFixed(1)}</span>
              </div>
              <span className="text-gray-300 text-lg">
                {new Date(featuredMovie.release_date || featuredMovie.first_air_date).getFullYear()}
              </span>
              {featuredMovie.adult && (
                <span className="bg-gray-600 text-white px-2 py-1 rounded text-sm">18+</span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4">
              {canWatch ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPlayTrailer(featuredMovie)}
                  className="flex items-center space-x-3 bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-200 transition-colors"
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span>Play Now</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={currentUser ? onShowSubscription : onShowAuth}
                  className="flex items-center space-x-3 bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors"
                >
                  <Crown className="w-6 h-6" />
                  <span>{currentUser ? 'Upgrade to Watch' : 'Sign Up to Watch'}</span>
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => currentUser ? onAddToWatchlist(featuredMovie) : onShowAuth()}
                className="flex items-center space-x-3 bg-gray-600/80 backdrop-blur text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-600 transition-colors"
              >
                {isInWatchlist ? (
                  <>
                    <Check className="w-6 h-6" />
                    <span>In My List</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-6 h-6" />
                    <span>My List</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 bg-gray-600/80 backdrop-blur text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-gray-600 transition-colors"
              >
                <Share2 className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Movie Card with ratings and advanced features
export const MovieCard = ({ movie, onPlayTrailer, onShowDetails, onDownload, onAddToWatchlist, onRate, currentUser, onShowAuth, onShowSubscription, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showRating, setShowRating] = useState(false);
  
  const plan = SUBSCRIPTION_PLANS[currentUser?.subscription || 'FREE'];
  const canDownload = currentUser && plan.downloads > 0 && (currentUser.downloadsUsed || 0) < plan.downloads;
  const isDownloaded = currentUser?.downloadedMovies?.some(d => d.id === movie.id);
  const isInWatchlist = currentUser?.watchlist?.some(item => item.id === movie.id);
  const userRating = currentUser?.ratings?.[movie.id];

  const handleRate = (rating) => {
    if (currentUser) {
      onRate(movie, rating);
      setShowRating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex-shrink-0 w-48 md:w-56 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowRating(false);
      }}
      onClick={() => onShowDetails(movie)}
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/api/placeholder/300/450'}
          alt={movie.title || movie.name}
          className="w-full h-72 md:h-80 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Quality Badge */}
        {currentUser?.subscription !== 'FREE' && (
          <div className="absolute top-2 right-2">
            <span className="bg-yellow-600 text-black px-2 py-1 rounded text-xs font-semibold">
              {plan.quality}
            </span>
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {isDownloaded && (
            <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
              <Download className="w-3 h-3 mr-1" />
              Downloaded
            </div>
          )}
          {isInWatchlist && (
            <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
              <Heart className="w-3 h-3 mr-1" />
              In List
            </div>
          )}
        </div>
        
        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-4"
            >
              <h3 className="text-white font-semibold text-sm mb-2">
                {truncateText(movie.title || movie.name, 25)}
              </h3>
              
              <div className="flex items-center space-x-2 mb-3">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white text-xs">{movie.vote_average?.toFixed(1)}</span>
                {userRating && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-blue-400 text-xs">Your rating: {userRating}★</span>
                  </>
                )}
              </div>

              {/* Rating Stars */}
              {showRating && (
                <div className="flex space-x-1 mb-3" onClick={(e) => e.stopPropagation()}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate(star)}
                      className="text-yellow-400 hover:scale-125 transition-transform"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between">
                <div className="flex space-x-1">
                  {/* Play Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentUser && currentUser.subscription !== 'FREE') {
                        onPlayTrailer(movie);
                      } else {
                        currentUser ? onShowSubscription() : onShowAuth();
                      }
                    }}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200"
                  >
                    {currentUser && currentUser.subscription !== 'FREE' ? (
                      <Play className="w-4 h-4 text-black fill-current" />
                    ) : (
                      <Lock className="w-4 h-4 text-black" />
                    )}
                  </motion.button>

                  {/* Download Button */}
                  {canDownload && !isDownloaded && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(movie);
                      }}
                      className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </motion.button>
                  )}

                  {/* Watchlist Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentUser) {
                        onAddToWatchlist(movie);
                      } else {
                        onShowAuth();
                      }
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isInWatchlist 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-gray-600/80 hover:bg-gray-600'
                    }`}
                  >
                    {isInWatchlist ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-white" />
                    )}
                  </motion.button>
                </div>

                {/* Rate Button */}
                {currentUser && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRating(!showRating);
                    }}
                    className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center hover:bg-yellow-700"
                  >
                    <Star className="w-4 h-4 text-white" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Enhanced Category Row with genre filtering
export const CategoryRow = ({ title, movies, onPlayTrailer, onShowDetails, onDownload, onAddToWatchlist, onRate, currentUser, onShowAuth, onShowSubscription, showFilter = false }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [filterGenre, setFilterGenre] = useState('all');
  const containerRef = React.useRef(null);

  const genres = ['all', 'action', 'comedy', 'drama', 'horror', 'romance', 'sci-fi'];
  
  const filteredMovies = filterGenre === 'all' 
    ? movies 
    : movies.filter(movie => movie.genre_ids?.includes(getGenreId(filterGenre)));

  function getGenreId(genreName) {
    const genreMap = { action: 28, comedy: 35, drama: 18, horror: 27, romance: 10749, 'sci-fi': 878 };
    return genreMap[genreName];
  }

  const scroll = (direction) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4 md:px-8">
        <h2 className="text-white text-xl md:text-2xl font-bold">{title}</h2>
        {showFilter && (
          <select 
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-red-500"
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre === 'all' ? 'All Genres' : genre.charAt(0).toUpperCase() + genre.slice(1)}
              </option>
            ))}
          </select>
        )}
      </div>
      
      <div className="relative group">
        <div
          ref={containerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {filteredMovies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlayTrailer={onPlayTrailer}
              onShowDetails={onShowDetails}
              onDownload={onDownload}
              onAddToWatchlist={onAddToWatchlist}
              onRate={onRate}
              currentUser={currentUser}
              onShowAuth={onShowAuth}
              onShowSubscription={onShowSubscription}
              index={index}
            />
          ))}
        </div>

        {/* Scroll Buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <ChevronDown className="w-6 h-6 rotate-90" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <ChevronDown className="w-6 h-6 -rotate-90" />
        </button>
      </div>
    </div>
  );
};

// Watchlist Modal
export const WatchlistModal = ({ isOpen, onClose, currentUser, onRemoveFromWatchlist, onShowDetails }) => {
  const [sortBy, setSortBy] = useState('recent');
  
  if (!isOpen) return null;

  const watchlist = currentUser?.watchlist || [];
  
  const sortedWatchlist = [...watchlist].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return (a.title || a.name).localeCompare(b.title || b.name);
      case 'rating':
        return b.vote_average - a.vote_average;
      case 'year':
        return new Date(b.release_date || b.first_air_date) - new Date(a.release_date || a.first_air_date);
      default:
        return new Date(b.addedDate || Date.now()) - new Date(a.addedDate || Date.now());
    }
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-bold flex items-center">
                <Heart className="w-6 h-6 mr-2" />
                My Watchlist
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {watchlist.length > 0 && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-400">{watchlist.length} item(s) in your list</p>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-red-500"
                >
                  <option value="recent">Recently Added</option>
                  <option value="title">Title A-Z</option>
                  <option value="rating">Highest Rated</option>
                  <option value="year">Release Year</option>
                </select>
              </div>
            )}

            {watchlist.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">Your watchlist is empty</h3>
                <p className="text-gray-400">
                  Add movies and shows to your list to watch them later
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {sortedWatchlist.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group cursor-pointer"
                    onClick={() => onShowDetails(movie)}
                  >
                    <img
                      src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/api/placeholder/300/450'}
                      alt={movie.title || movie.name}
                      className="w-full h-64 object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="text-white font-semibold text-sm mb-1">
                          {truncateText(movie.title || movie.name, 20)}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-white text-xs">{movie.vote_average?.toFixed(1)}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromWatchlist(movie);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Enhanced Movie Detail Modal
export const MovieDetailModal = ({ movie, isOpen, onClose, onPlayTrailer, onDownload, onAddToWatchlist, onRate, currentUser, onShowAuth, onShowSubscription }) => {
  const [userRating, setUserRating] = useState(currentUser?.ratings?.[movie?.id] || 0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  if (!isOpen || !movie) return null;

  const plan = SUBSCRIPTION_PLANS[currentUser?.subscription || 'FREE'];
  const canWatch = currentUser && currentUser.subscription !== 'FREE';
  const canDownload = currentUser && plan.downloads > 0 && (currentUser.downloadsUsed || 0) < plan.downloads;
  const isDownloaded = currentUser?.downloadedMovies?.some(d => d.id === movie.id);
  const isInWatchlist = currentUser?.watchlist?.some(item => item.id === movie.id);

  const handleRate = (rating) => {
    setUserRating(rating);
    onRate(movie, rating);
  };

  const shareMovie = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out "${movie.title || movie.name}" on StreamFlix!`);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      whatsapp: `https://wa.me/?text=${text} ${url}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900 rounded-lg max-w-5xl w-full max-h-[95vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero Image */}
          <div className="relative">
            <img
              src={movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : '/api/placeholder/800/450'}
              alt={movie.title || movie.name}
              className="w-full h-64 md:h-96 object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            
            {!canWatch && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  <Lock className="w-16 h-16 text-white mx-auto mb-4" />
                  <h3 className="text-white text-xl font-bold mb-2">Premium Content</h3>
                  <p className="text-gray-300 mb-4">
                    Upgrade to watch in {SUBSCRIPTION_PLANS.PRO.quality} quality
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Main Info */}
              <div className="flex-1">
                <h1 className="text-white text-2xl md:text-4xl font-bold mb-4">
                  {movie.title || movie.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">{movie.vote_average?.toFixed(1)}</span>
                    <span className="text-gray-400">({movie.vote_count?.toLocaleString()} votes)</span>
                  </div>
                  <span className="text-gray-300">
                    {new Date(movie.release_date || movie.first_air_date).getFullYear()}
                  </span>
                  {movie.runtime && (
                    <span className="text-gray-300">{movie.runtime} min</span>
                  )}
                  {canWatch && (
                    <span className="bg-yellow-600 text-black px-2 py-1 rounded text-sm font-semibold">
                      {plan.quality}
                    </span>
                  )}
                  {movie.adult && (
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold">
                      18+
                    </span>
                  )}
                </div>

                {/* User Rating */}
                {currentUser && (
                  <div className="mb-6">
                    <p className="text-white font-semibold mb-2">Your Rating:</p>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRate(star)}
                          className={`text-2xl transition-colors ${
                            star <= userRating ? 'text-yellow-400' : 'text-gray-600'
                          } hover:text-yellow-400`}
                        >
                          <Star className="w-6 h-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {canWatch ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onPlayTrailer(movie)}
                      className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      <span>Play Now</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={currentUser ? onShowSubscription : onShowAuth}
                      className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      <Crown className="w-5 h-5" />
                      <span>{currentUser ? `Upgrade to ${plan.name}` : 'Sign Up to Watch'}</span>
                    </motion.button>
                  )}

                  {canDownload && !isDownloaded && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDownload(movie)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download</span>
                    </motion.button>
                  )}

                  {isDownloaded && (
                    <div className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold">
                      <Check className="w-5 h-5" />
                      <span>Downloaded</span>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => currentUser ? onAddToWatchlist(movie) : onShowAuth()}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                      isInWatchlist 
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-600/80 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {isInWatchlist ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>In My List</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Add to List</span>
                      </>
                    )}
                  </motion.button>

                  {/* Share Button */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center space-x-2 bg-gray-600/80 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </motion.button>

                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-600 py-2 w-40"
                      >
                        <button
                          onClick={() => shareMovie('twitter')}
                          className="w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                        >
                          Twitter
                        </button>
                        <button
                          onClick={() => shareMovie('facebook')}
                          className="w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                        >
                          Facebook
                        </button>
                        <button
                          onClick={() => shareMovie('whatsapp')}
                          className="w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                        >
                          WhatsApp
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {movie.overview}
                </p>

                {/* Additional Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  {movie.genres && (
                    <div>
                      <h3 className="text-white font-semibold mb-2">Genres:</h3>
                      <div className="flex flex-wrap gap-2">
                        {movie.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {movie.production_companies && (
                    <div>
                      <h3 className="text-white font-semibold mb-2">Production:</h3>
                      <p className="text-gray-300 text-sm">
                        {movie.production_companies.slice(0, 3).map(company => company.name).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="w-full md:w-80">
                <img
                  src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/api/placeholder/300/450'}
                  alt={movie.title || movie.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Enhanced Video Player Modal
export const VideoPlayerModal = ({ videoKey, isOpen, onClose }) => {
  if (!isOpen || !videoKey) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center z-10 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&controls=1`}
            title="Movie Trailer"
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Enhanced Search Results with advanced filtering
export const SearchResults = ({ searchResults, isSearching, onPlayTrailer, onShowDetails, onDownload, onAddToWatchlist, onRate, currentUser, onShowAuth, onShowSubscription }) => {
  const [sortBy, setSortBy] = useState('relevance');
  const [filterType, setFilterType] = useState('all');

  if (!isSearching) return null;

  const filteredResults = searchResults.filter(item => {
    if (filterType === 'all') return true;
    if (filterType === 'movie') return !item.first_air_date;
    if (filterType === 'tv') return item.first_air_date;
    return true;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return (a.title || a.name).localeCompare(b.title || b.name);
      case 'rating':
        return b.vote_average - a.vote_average;
      case 'year':
        return new Date(b.release_date || b.first_air_date) - new Date(a.release_date || a.first_air_date);
      default:
        return b.popularity - a.popularity;
    }
  });

  return (
    <div className="min-h-screen bg-black dark:bg-black pt-24 pb-8">
      <div className="px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-4 md:mb-0">
            Search Results ({filteredResults.length} found)
          </h2>
          
          <div className="flex space-x-4">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-red-500"
            >
              <option value="all">All Content</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-red-500"
            >
              <option value="relevance">Most Relevant</option>
              <option value="title">Title A-Z</option>
              <option value="rating">Highest Rated</option>
              <option value="year">Release Year</option>
            </select>
          </div>
        </div>

        {sortedResults.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">No results found</h3>
            <p className="text-gray-400">Try different search terms or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sortedResults.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onPlayTrailer={onPlayTrailer}
                onShowDetails={onShowDetails}
                onDownload={onDownload}
                onAddToWatchlist={onAddToWatchlist}
                onRate={onRate}
                currentUser={currentUser}
                onShowAuth={onShowAuth}
                onShowSubscription={onShowSubscription}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Footer with social links
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black dark:bg-black text-gray-400 py-16 mt-20">
      <div className="px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-6 bg-red-500 rounded flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-current" />
              </div>
              <h3 className="text-white text-xl font-bold tracking-wider">STREAMFLIX</h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              The ultimate streaming platform with thousands of movies and TV shows. 
              Watch anywhere, anytime with our premium quality streaming service.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
              >
                📘
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
              >
                🐦
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
              >
                📷
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Browse</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Movies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">TV Shows</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentaries</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kids</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p>&copy; {currentYear} StreamFlix. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-sm">Available on:</span>
            <div className="flex space-x-2">
              <Smartphone className="w-5 h-5" />
              <Tv className="w-5 h-5" />
              <Monitor className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};