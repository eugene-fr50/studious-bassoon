import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Plus, ChevronDown, Star, X, Menu, User, Bell, Gift, Download, Check, Crown, Lock, CreditCard, Smartphone, Tv, Monitor } from 'lucide-react';

// TMDB API Configuration
const TMDB_API_KEY = 'c8dea14dc917687ac631a52620e4f7ad';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Subscription Plans
const SUBSCRIPTION_PLANS = {
  FREE: { name: 'Free', price: 0, downloads: 0, quality: '480p', devices: 1, ads: true },
  PREMIUM: { name: 'Premium', price: 12.99, downloads: 10, quality: '1080p', devices: 2, ads: false },
  PRO: { name: 'Pro', price: 19.99, downloads: 50, quality: '4K', devices: 4, ads: false }
};

// Mock user data
const getMockUser = () => {
  const savedUser = localStorage.getItem('streamflix_user');
  if (savedUser) {
    return JSON.parse(savedUser);
  }
  const defaultUser = {
    id: 1,
    name: 'John Doe',
    email: 'user@streamflix.com',
    subscription: 'FREE',
    downloadsUsed: 0,
    downloadedMovies: [],
    watchlist: []
  };
  localStorage.setItem('streamflix_user', JSON.stringify(defaultUser));
  return defaultUser;
};

// Utility function to truncate text
const truncateText = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

// Auth Modal Component
export const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock authentication
    const user = {
      id: Date.now(),
      name: isLogin ? 'John Doe' : formData.name,
      email: formData.email,
      subscription: 'FREE',
      downloadsUsed: 0,
      downloadedMovies: [],
      watchlist: []
    };
    localStorage.setItem('streamflix_user', JSON.stringify(user));
    onLogin(user);
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
          className="bg-gray-900 rounded-lg max-w-md w-full p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-white text-2xl font-bold mb-6 text-center">
            {isLogin ? 'Welcome Back' : 'Join StreamFlix'}
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
              placeholder="Email"
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
            
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          
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

// Subscription Modal Component
export const SubscriptionModal = ({ isOpen, onClose, currentUser, onUpgrade }) => {
  const [selectedPlan, setSelectedPlan] = useState('PREMIUM');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleUpgrade = () => {
    // Mock payment processing
    const updatedUser = {
      ...currentUser,
      subscription: selectedPlan
    };
    localStorage.setItem('streamflix_user', JSON.stringify(updatedUser));
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
          className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-white text-3xl font-bold">Choose Your Plan</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Plans */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
                <motion.div
                  key={key}
                  className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    selectedPlan === key
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedPlan(key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {key === 'PRO' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center">
                        <Crown className="w-3 h-3 mr-1" />
                        POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="text-white text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-white mb-4">
                      ${plan.price}
                      <span className="text-gray-400 text-base">/month</span>
                    </div>
                    
                    <ul className="space-y-3 text-left">
                      <li className="flex items-center text-gray-300">
                        <Check className="w-4 h-4 text-green-500 mr-3" />
                        {plan.downloads === 0 ? 'No downloads' : `${plan.downloads} downloads/month`}
                      </li>
                      <li className="flex items-center text-gray-300">
                        <Check className="w-4 h-4 text-green-500 mr-3" />
                        {plan.quality} video quality
                      </li>
                      <li className="flex items-center text-gray-300">
                        <Check className="w-4 h-4 text-green-500 mr-3" />
                        {plan.devices} device{plan.devices > 1 ? 's' : ''}
                      </li>
                      <li className="flex items-center text-gray-300">
                        <Check className="w-4 h-4 text-green-500 mr-3" />
                        {plan.ads ? 'With ads' : 'No ads'}
                      </li>
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="text-white text-xl font-semibold mb-4">Payment Method</h3>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
            </div>

            <button
              onClick={handleUpgrade}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg text-lg transition-colors"
            >
              Subscribe to {SUBSCRIPTION_PLANS[selectedPlan].name} - ${SUBSCRIPTION_PLANS[selectedPlan].price}/month
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Downloads Modal Component
export const DownloadsModal = ({ isOpen, onClose, currentUser }) => {
  if (!isOpen) return null;

  const downloadedMovies = currentUser?.downloadedMovies || [];
  const plan = SUBSCRIPTION_PLANS[currentUser?.subscription || 'FREE'];

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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-bold">My Downloads</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4 mb-6">
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

            {downloadedMovies.length === 0 ? (
              <div className="text-center py-12">
                <Download className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">No Downloads Yet</h3>
                <p className="text-gray-400">Start downloading your favorite movies and shows for offline viewing</p>
              </div>
            ) : (
              <div className="space-y-4">
                {downloadedMovies.map((movie) => (
                  <div key={movie.id} className="flex items-center bg-gray-800 rounded-lg p-4">
                    <img
                      src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/api/placeholder/80/120'}
                      alt={movie.title || movie.name}
                      className="w-16 h-24 object-cover rounded"
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="text-white font-semibold">{movie.title || movie.name}</h4>
                      <p className="text-gray-400 text-sm">Downloaded • {plan.quality}</p>
                      <div className="flex items-center mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-gray-300 text-sm">{movie.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center">
                        <Play className="w-4 h-4 mr-1" />
                        Play
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Header Component
export const Header = ({ onSearch, searchQuery, setSearchQuery, currentUser, onShowAuth, onShowSubscription, onShowDownloads, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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
        isScrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-gradient-to-b from-black/70 to-transparent'
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
          <nav className="hidden md:flex space-x-6">
            <button className="text-white hover:text-gray-300 transition-colors">Home</button>
            <button className="text-white hover:text-gray-300 transition-colors">TV Shows</button>
            <button className="text-white hover:text-gray-300 transition-colors">Movies</button>
            <button className="text-white hover:text-gray-300 transition-colors">New & Popular</button>
            <button className="text-white hover:text-gray-300 transition-colors">My List</button>
          </nav>
        </div>

        {/* Search and User Controls */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              className="bg-black/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 w-48 md:w-64"
            />
          </div>

          {currentUser ? (
            <>
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
              
              <Bell className="text-white w-6 h-6 cursor-pointer hover:text-gray-300" />
              
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
                  <div className="absolute right-0 top-full mt-2 bg-gray-900 rounded-lg shadow-xl border border-gray-700 py-2 w-48">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-white font-semibold">{currentUser.name}</p>
                      <p className="text-gray-400 text-sm">{plan.name} Plan</p>
                    </div>
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
                      Downloads ({currentUser.downloadsUsed})
                    </button>
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
                )}
              </div>
            </>
          ) : (
            <button
              onClick={onShowAuth}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

// Hero Section Component
export const HeroSection = ({ featuredMovie, onPlayTrailer, currentUser, onShowAuth, onShowSubscription }) => {
  if (!featuredMovie) return null;

  const plan = SUBSCRIPTION_PLANS[currentUser?.subscription || 'FREE'];
  const canWatch = currentUser && (currentUser.subscription !== 'FREE' || plan.ads);

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
        <div className="px-4 md:px-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {featuredMovie.title || featuredMovie.name}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
              {truncateText(featuredMovie.overview, 300)}
            </p>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-white font-semibold">{featuredMovie.vote_average?.toFixed(1)}</span>
              </div>
              <span className="text-gray-300">
                {new Date(featuredMovie.release_date || featuredMovie.first_air_date).getFullYear()}
              </span>
              {currentUser && currentUser.subscription !== 'FREE' && (
                <span className="bg-yellow-600 text-black px-2 py-1 rounded text-sm font-semibold">
                  {plan.quality}
                </span>
              )}
            </div>
            <div className="flex space-x-4">
              {canWatch ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPlayTrailer(featuredMovie)}
                  className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Play</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={currentUser ? onShowSubscription : onShowAuth}
                  className="flex items-center space-x-2 bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  <Crown className="w-5 h-5" />
                  <span>{currentUser ? 'Upgrade to Watch' : 'Sign Up to Watch'}</span>
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-gray-600/80 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>My List</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Movie Card Component
export const MovieCard = ({ movie, onPlayTrailer, onShowDetails, onDownload, currentUser, onShowAuth, onShowSubscription, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const plan = SUBSCRIPTION_PLANS[currentUser?.subscription || 'FREE'];
  const canDownload = currentUser && plan.downloads > 0 && (currentUser.downloadsUsed || 0) < plan.downloads;
  const isDownloaded = currentUser?.downloadedMovies?.some(d => d.id === movie.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex-shrink-0 w-48 md:w-56 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onShowDetails(movie)}
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/api/placeholder/300/450'}
          alt={movie.title || movie.name}
          className="w-full h-72 md:h-80 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {currentUser?.subscription !== 'FREE' && (
          <div className="absolute top-2 right-2">
            <span className="bg-yellow-600 text-black px-2 py-1 rounded text-xs font-semibold">
              {plan.quality}
            </span>
          </div>
        )}

        {isDownloaded && (
          <div className="absolute top-2 left-2">
            <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
              <Download className="w-3 h-3 mr-1" />
              Downloaded
            </div>
          </div>
        )}
        
        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-4"
            >
              <h3 className="text-white font-semibold text-sm mb-2">
                {truncateText(movie.title || movie.name, 20)}
              </h3>
              <div className="flex items-center space-x-2 mb-3">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white text-xs">{movie.vote_average?.toFixed(1)}</span>
              </div>
              <div className="flex space-x-2">
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

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 bg-gray-600/80 rounded-full flex items-center justify-center hover:bg-gray-600"
                >
                  <Plus className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Category Row Component
export const CategoryRow = ({ title, movies, onPlayTrailer, onShowDetails, onDownload, currentUser, onShowAuth, onShowSubscription }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = React.useRef(null);

  const scroll = (direction) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4 px-4 md:px-8">{title}</h2>
      <div className="relative group">
        <div
          ref={containerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlayTrailer={onPlayTrailer}
              onShowDetails={onShowDetails}
              onDownload={onDownload}
              currentUser={currentUser}
              onShowAuth={onShowAuth}
              onShowSubscription={onShowSubscription}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Movie Detail Modal Component
export const MovieDetailModal = ({ movie, isOpen, onClose, onPlayTrailer, onDownload, currentUser, onShowAuth, onShowSubscription }) => {
  if (!isOpen || !movie) return null;

  const plan = SUBSCRIPTION_PLANS[currentUser?.subscription || 'FREE'];
  const canWatch = currentUser && currentUser.subscription !== 'FREE';
  const canDownload = currentUser && plan.downloads > 0 && (currentUser.downloadsUsed || 0) < plan.downloads;
  const isDownloaded = currentUser?.downloadedMovies?.some(d => d.id === movie.id);

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
          transition={{ duration: 0.3 }}
          className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
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
                  <p className="text-gray-300 mb-4">Upgrade to watch in {plan.quality || '4K'} quality</p>
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
            <h1 className="text-white text-2xl md:text-4xl font-bold mb-4">
              {movie.title || movie.name}
            </h1>
            
            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-white font-semibold">{movie.vote_average?.toFixed(1)}</span>
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
            </div>

            <div className="flex space-x-4 mb-6">
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
                className="flex items-center space-x-2 bg-gray-600/80 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add to List</span>
              </motion.button>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              {movie.overview}
            </p>

            {movie.genres && (
              <div className="mb-4">
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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Video Player Modal Component
export const VideoPlayerModal = ({ videoKey, isOpen, onClose }) => {
  if (!isOpen || !videoKey) return null;

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
          className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
            title="Movie Trailer"
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Search Results Component
export const SearchResults = ({ searchResults, isSearching, onPlayTrailer, onShowDetails, onDownload, currentUser, onShowAuth, onShowSubscription }) => {
  if (!isSearching) return null;

  return (
    <div className="min-h-screen bg-black pt-24 pb-8">
      <div className="px-4 md:px-8">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-8">Search Results</h2>
        {searchResults.length === 0 ? (
          <p className="text-gray-400 text-lg">No results found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {searchResults.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onPlayTrailer={onPlayTrailer}
                onShowDetails={onShowDetails}
                onDownload={onDownload}
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

// Footer Component
export const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-12">
      <div className="px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center">
          <p>&copy; 2025 StreamFlix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};