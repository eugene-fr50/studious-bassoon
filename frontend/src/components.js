import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Plus, ChevronDown, Star, X, Menu, User, Bell, Gift } from 'lucide-react';

// TMDB API Configuration
const TMDB_API_KEY = 'c8dea14dc917687ac631a52620e4f7ad';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Utility function to truncate text
const truncateText = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

// Header Component
export const Header = ({ onSearch, searchQuery, setSearchQuery }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <Bell className="text-white w-6 h-6 cursor-pointer hover:text-gray-300" />
          <div className="w-8 h-8 bg-red-500 rounded cursor-pointer hover:bg-red-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

// Hero Section Component
export const HeroSection = ({ featuredMovie, onPlayTrailer }) => {
  if (!featuredMovie) return null;

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
            </div>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPlayTrailer(featuredMovie)}
                className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Play</span>
              </motion.button>
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
export const MovieCard = ({ movie, onPlayTrailer, onShowDetails, index }) => {
  const [isHovered, setIsHovered] = useState(false);

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
                    onPlayTrailer(movie);
                  }}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200"
                >
                  <Play className="w-4 h-4 text-black fill-current" />
                </motion.button>
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
export const CategoryRow = ({ title, movies, onPlayTrailer, onShowDetails }) => {
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
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Movie Detail Modal Component
export const MovieDetailModal = ({ movie, isOpen, onClose, onPlayTrailer }) => {
  if (!isOpen || !movie) return null;

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
            </div>

            <div className="flex space-x-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPlayTrailer(movie)}
                className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Play Trailer</span>
              </motion.button>
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
export const SearchResults = ({ searchResults, isSearching, onPlayTrailer, onShowDetails }) => {
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
          <p>&copy; 2025 MovieFlix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};