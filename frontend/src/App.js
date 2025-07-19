import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Play } from 'lucide-react';
import './App.css';
import {
  Header,
  HeroSection,
  CategoryRow,
  ContinueWatching,
  MovieDetailModal,
  VideoPlayerModal,
  SearchResults,
  AuthModal,
  SubscriptionModal,
  DownloadsModal,
  ProfileModal,
  WatchlistModal,
  ThemeProvider,
  Footer
} from './components';

// TMDB API Configuration
const TMDB_API_KEY = 'c8dea14dc917687ac631a52620e4f7ad';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// API Service Functions
const tmdbAPI = {
  getTrending: () => fetch(`${TMDB_BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}`).then(res => res.json()),
  getPopular: () => fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`).then(res => res.json()),
  getTopRated: () => fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`).then(res => res.json()),
  getUpcoming: () => fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}`).then(res => res.json()),
  getTVShows: () => fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}`).then(res => res.json()),
  getActionMovies: () => fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28`).then(res => res.json()),
  getComedyMovies: () => fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35`).then(res => res.json()),
  getHorrorMovies: () => fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27`).then(res => res.json()),
  getDocumentaries: () => fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=99`).then(res => res.json()),
  getRomanceMovies: () => fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749`).then(res => res.json()),
  getSciFiMovies: () => fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=878`).then(res => res.json()),
  search: (query) => fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`).then(res => res.json()),
  getMovieVideos: (movieId) => fetch(`${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`).then(res => res.json()),
  getTVVideos: (tvId) => fetch(`${TMDB_BASE_URL}/tv/${tvId}/videos?api_key=${TMDB_API_KEY}`).then(res => res.json()),
  getMovieDetails: (movieId) => fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`).then(res => res.json()),
  getTVDetails: (tvId) => fetch(`${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}`).then(res => res.json()),
  getSimilar: (movieId, isTV) => fetch(`${TMDB_BASE_URL}/${isTV ? 'tv' : 'movie'}/${movieId}/similar?api_key=${TMDB_API_KEY}`).then(res => res.json()),
  getRecommendations: (movieId, isTV) => fetch(`${TMDB_BASE_URL}/${isTV ? 'tv' : 'movie'}/${movieId}/recommendations?api_key=${TMDB_API_KEY}`).then(res => res.json())
};

// Mock user management with enhanced features
const getMockUser = () => {
  const savedUser = localStorage.getItem('streamflix_user');
  if (savedUser) {
    return JSON.parse(savedUser);
  }
  return null;
};

const saveUser = (user) => {
  localStorage.setItem('streamflix_user', JSON.stringify(user));
};

// Generate personalized recommendations
const generateRecommendations = (user, allMovies) => {
  if (!user || !user.watchHistory || user.watchHistory.length === 0) {
    // Return trending movies for new users
    return allMovies.slice(0, 20);
  }

  // Simple recommendation algorithm based on genres
  const watchedGenres = {};
  user.watchHistory.forEach(movie => {
    if (movie.genre_ids) {
      movie.genre_ids.forEach(genreId => {
        watchedGenres[genreId] = (watchedGenres[genreId] || 0) + 1;
      });
    }
  });

  const topGenres = Object.entries(watchedGenres)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([genreId]) => parseInt(genreId));

  return allMovies.filter(movie => 
    movie.genre_ids && movie.genre_ids.some(genreId => topGenres.includes(genreId))
  ).slice(0, 20);
};

const Home = () => {
  // State Management
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [continueWatchingMovies, setContinueWatchingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentVideoKey, setCurrentVideoKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Modal states
  const [currentUser, setCurrentUser] = useState(getMockUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isDownloadsModalOpen, setIsDownloadsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWatchlistModalOpen, setIsWatchlistModalOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadMovieData = async () => {
      try {
        setLoading(true);
        
        // Fetch all categories in parallel
        const [
          trendingData,
          popularData,
          topRatedData,
          upcomingData,
          tvShowsData,
          actionData,
          comedyData,
          horrorData,
          documentariesData,
          romanceData,
          sciFiData
        ] = await Promise.all([
          tmdbAPI.getTrending(),
          tmdbAPI.getPopular(),
          tmdbAPI.getTopRated(),
          tmdbAPI.getUpcoming(),
          tmdbAPI.getTVShows(),
          tmdbAPI.getActionMovies(),
          tmdbAPI.getComedyMovies(),
          tmdbAPI.getHorrorMovies(),
          tmdbAPI.getDocumentaries(),
          tmdbAPI.getRomanceMovies(),
          tmdbAPI.getSciFiMovies()
        ]);

        // Set featured movie from trending
        if (trendingData.results && trendingData.results.length > 0) {
          const featuredIndex = Math.floor(Math.random() * Math.min(10, trendingData.results.length));
          setFeaturedMovie(trendingData.results[featuredIndex]);
        }

        // Generate continue watching (mock data for demo)
        if (currentUser && currentUser.watchHistory) {
          const continueWatching = currentUser.watchHistory
            .filter(movie => (movie.watchProgress || 0) > 10 && (movie.watchProgress || 0) < 90)
            .slice(0, 10);
          setContinueWatchingMovies(continueWatching);
        }

        // Generate recommendations
        const allMovies = [
          ...trendingData.results || [],
          ...popularData.results || [],
          ...topRatedData.results || []
        ];
        const userRecommendations = generateRecommendations(currentUser, allMovies);
        setRecommendations(userRecommendations);

        // Organize categories
        const categoryList = [
          { title: 'Trending Now', movies: trendingData.results || [], showFilter: false },
          { title: 'Popular Movies', movies: popularData.results || [], showFilter: true },
          { title: 'Top Rated', movies: topRatedData.results || [], showFilter: false },
          { title: 'Popular TV Shows', movies: tvShowsData.results || [], showFilter: false },
          ...(currentUser ? [{ title: 'Recommended For You', movies: userRecommendations, showFilter: false }] : []),
          { title: 'Action Movies', movies: actionData.results || [], showFilter: true },
          { title: 'Comedy Movies', movies: comedyData.results || [], showFilter: false },
          { title: 'Horror Movies', movies: horrorData.results || [], showFilter: false },
          { title: 'Romance Movies', movies: romanceData.results || [], showFilter: false },
          { title: 'Sci-Fi Movies', movies: sciFiData.results || [], showFilter: false },
          { title: 'Documentaries', movies: documentariesData.results || [], showFilter: false },
          { title: 'Coming Soon', movies: upcomingData.results || [], showFilter: false }
        ];

        setCategories(categoryList);
        setLoading(false);
      } catch (error) {
        console.error('Error loading movie data:', error);
        setLoading(false);
      }
    };

    loadMovieData();
  }, [currentUser]);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      const searchData = await tmdbAPI.search(searchQuery);
      setSearchResults(searchData.results || []);
      
      // Update user search history
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          searchHistory: [
            ...(currentUser.searchHistory || []).slice(0, 9),
            { query: searchQuery, date: new Date().toISOString() }
          ]
        };
        setCurrentUser(updatedUser);
        saveUser(updatedUser);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  // Handle movie detail modal
  const handleShowDetails = async (movie) => {
    try {
      let detailedMovie;
      const isTV = movie.media_type === 'tv' || movie.first_air_date;
      
      if (isTV) {
        detailedMovie = await tmdbAPI.getTVDetails(movie.id);
      } else {
        detailedMovie = await tmdbAPI.getMovieDetails(movie.id);
      }
      
      setSelectedMovie({ ...movie, ...detailedMovie });
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setSelectedMovie(movie);
      setIsDetailModalOpen(true);
    }
  };

  // Handle trailer playback
  const handlePlayTrailer = async (movie) => {
    try {
      let videosData;
      const isTV = movie.media_type === 'tv' || movie.first_air_date;
      
      if (isTV) {
        videosData = await tmdbAPI.getTVVideos(movie.id);
      } else {
        videosData = await tmdbAPI.getMovieVideos(movie.id);
      }

      const trailer = videosData.results?.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      ) || videosData.results?.[0];

      if (trailer) {
        setCurrentVideoKey(trailer.key);
        setIsVideoPlayerOpen(true);
        
        // Add to watch history
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            watchHistory: [
              movie,
              ...(currentUser.watchHistory || []).filter(item => item.id !== movie.id).slice(0, 49)
            ],
            watchTimeMinutes: (currentUser.watchTimeMinutes || 0) + 3 // Approximate trailer time
          };
          setCurrentUser(updatedUser);
          saveUser(updatedUser);
        }
      } else {
        // Fallback: search for a generic trailer on YouTube
        const searchTerm = movie.title || movie.name;
        const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm + ' trailer')}`;
        window.open(youtubeSearchUrl, '_blank');
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      const searchTerm = movie.title || movie.name;
      const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm + ' trailer')}`;
      window.open(youtubeSearchUrl, '_blank');
    }
  };

  // Handle download
  const handleDownload = (movie) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const plans = {
      FREE: { downloads: 0 },
      PREMIUM: { downloads: 10 },
      PRO: { downloads: 50 }
    };
    const plan = plans[currentUser.subscription];

    if (plan.downloads === 0) {
      setIsSubscriptionModalOpen(true);
      return;
    }

    if ((currentUser.downloadsUsed || 0) >= plan.downloads) {
      alert('Download limit reached. Please upgrade your plan or remove some downloads.');
      return;
    }

    // Check if already downloaded
    const isAlreadyDownloaded = currentUser.downloadedMovies?.some(d => d.id === movie.id);
    if (isAlreadyDownloaded) {
      alert('This title is already downloaded!');
      return;
    }

    // Mock download process
    const movieWithDownloadInfo = {
      ...movie,
      downloadDate: new Date().toISOString(),
      downloadQuality: plans[currentUser.subscription]?.quality || '480p'
    };

    const updatedUser = {
      ...currentUser,
      downloadsUsed: (currentUser.downloadsUsed || 0) + 1,
      downloadedMovies: [...(currentUser.downloadedMovies || []), movieWithDownloadInfo]
    };

    setCurrentUser(updatedUser);
    saveUser(updatedUser);
    alert(`"${movie.title || movie.name}" has been downloaded successfully!`);
  };

  // Handle remove download
  const handleRemoveDownload = (movie) => {
    const updatedUser = {
      ...currentUser,
      downloadsUsed: Math.max(0, (currentUser.downloadsUsed || 0) - 1),
      downloadedMovies: (currentUser.downloadedMovies || []).filter(d => d.id !== movie.id)
    };
    
    setCurrentUser(updatedUser);
    saveUser(updatedUser);
  };

  // Handle watchlist operations
  const handleAddToWatchlist = (movie) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const isInWatchlist = currentUser.watchlist?.some(item => item.id === movie.id);
    
    let updatedWatchlist;
    if (isInWatchlist) {
      updatedWatchlist = currentUser.watchlist.filter(item => item.id !== movie.id);
    } else {
      const movieWithAddedDate = {
        ...movie,
        addedDate: new Date().toISOString()
      };
      updatedWatchlist = [movieWithAddedDate, ...(currentUser.watchlist || [])];
    }

    const updatedUser = {
      ...currentUser,
      watchlist: updatedWatchlist
    };

    setCurrentUser(updatedUser);
    saveUser(updatedUser);
  };

  const handleRemoveFromWatchlist = (movie) => {
    const updatedUser = {
      ...currentUser,
      watchlist: (currentUser.watchlist || []).filter(item => item.id !== movie.id)
    };
    
    setCurrentUser(updatedUser);
    saveUser(updatedUser);
  };

  // Handle ratings
  const handleRate = (movie, rating) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const updatedUser = {
      ...currentUser,
      ratings: {
        ...currentUser.ratings || {},
        [movie.id]: rating
      }
    };

    setCurrentUser(updatedUser);
    saveUser(updatedUser);
  };

  // Handle login
  const handleLogin = (user) => {
    setCurrentUser(user);
    saveUser(user);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('streamflix_user');
    setCurrentUser(null);
  };

  // Handle subscription upgrade
  const handleUpgrade = (updatedUser) => {
    setCurrentUser(updatedUser);
    saveUser(updatedUser);
    alert('Subscription updated successfully!');
  };

  // Handle profile update
  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
    saveUser(updatedUser);
  };

  // Handle escape key for modals
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        setIsDetailModalOpen(false);
        setIsVideoPlayerOpen(false);
        setIsAuthModalOpen(false);
        setIsSubscriptionModalOpen(false);
        setIsDownloadsModalOpen(false);
        setIsProfileModalOpen(false);
        setIsWatchlistModalOpen(false);
        setCurrentVideoKey(null);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

  // Clear search when query is empty
  useEffect(() => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Play className="w-8 h-8 text-black fill-current" />
          </div>
          <h2 className="text-white text-xl font-bold tracking-wider mb-2">STREAMFLIX</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading amazing content...</p>
          <div className="mt-4 text-gray-400 text-sm">
            <p>✨ Preparing personalized recommendations</p>
            <p>📡 Fetching latest movies & shows</p>
            <p>🎬 Setting up your experience</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-black dark:bg-black">
        <Header 
          onSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
          onShowAuth={() => setIsAuthModalOpen(true)}
          onShowSubscription={() => setIsSubscriptionModalOpen(true)}
          onShowDownloads={() => setIsDownloadsModalOpen(true)}
          onShowProfile={() => setIsProfileModalOpen(true)}
          onShowWatchlist={() => setIsWatchlistModalOpen(true)}
          onLogout={handleLogout}
        />
        
        {isSearching ? (
          <SearchResults 
            searchResults={searchResults}
            isSearching={isSearching}
            onPlayTrailer={handlePlayTrailer}
            onShowDetails={handleShowDetails}
            onDownload={handleDownload}
            onAddToWatchlist={handleAddToWatchlist}
            onRate={handleRate}
            currentUser={currentUser}
            onShowAuth={() => setIsAuthModalOpen(true)}
            onShowSubscription={() => setIsSubscriptionModalOpen(true)}
          />
        ) : (
          <>
            <HeroSection 
              featuredMovie={featuredMovie}
              onPlayTrailer={handlePlayTrailer}
              currentUser={currentUser}
              onShowAuth={() => setIsAuthModalOpen(true)}
              onShowSubscription={() => setIsSubscriptionModalOpen(true)}
              onAddToWatchlist={handleAddToWatchlist}
            />
            
            <div className="relative z-10 -mt-32 pb-20">
              {/* Continue Watching */}
              {continueWatchingMovies.length > 0 && (
                <ContinueWatching 
                  movies={continueWatchingMovies}
                  onPlayTrailer={handlePlayTrailer}
                  currentUser={currentUser}
                />
              )}

              {/* Categories */}
              {categories.map((category, index) => (
                <CategoryRow
                  key={index}
                  title={category.title}
                  movies={category.movies}
                  onPlayTrailer={handlePlayTrailer}
                  onShowDetails={handleShowDetails}
                  onDownload={handleDownload}
                  onAddToWatchlist={handleAddToWatchlist}
                  onRate={handleRate}
                  currentUser={currentUser}
                  onShowAuth={() => setIsAuthModalOpen(true)}
                  onShowSubscription={() => setIsSubscriptionModalOpen(true)}
                  showFilter={category.showFilter}
                />
              ))}
            </div>
            
            <Footer />
          </>
        )}

        {/* All Modals */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
        />

        <SubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
          currentUser={currentUser}
          onUpgrade={handleUpgrade}
        />

        <DownloadsModal
          isOpen={isDownloadsModalOpen}
          onClose={() => setIsDownloadsModalOpen(false)}
          currentUser={currentUser}
          onRemoveDownload={handleRemoveDownload}
        />

        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          onUpdateProfile={handleUpdateProfile}
        />

        <WatchlistModal
          isOpen={isWatchlistModalOpen}
          onClose={() => setIsWatchlistModalOpen(false)}
          currentUser={currentUser}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
          onShowDetails={handleShowDetails}
        />

        <MovieDetailModal
          movie={selectedMovie}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedMovie(null);
          }}
          onPlayTrailer={handlePlayTrailer}
          onDownload={handleDownload}
          onAddToWatchlist={handleAddToWatchlist}
          onRate={handleRate}
          currentUser={currentUser}
          onShowAuth={() => setIsAuthModalOpen(true)}
          onShowSubscription={() => setIsSubscriptionModalOpen(true)}
        />

        <VideoPlayerModal
          videoKey={currentVideoKey}
          isOpen={isVideoPlayerOpen}
          onClose={() => {
            setIsVideoPlayerOpen(false);
            setCurrentVideoKey(null);
          }}
        />
      </div>
    </ThemeProvider>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;