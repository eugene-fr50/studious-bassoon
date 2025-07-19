import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Play } from 'lucide-react';
import './App.css';
import {
  Header,
  HeroSection,
  CategoryRow,
  MovieDetailModal,
  VideoPlayerModal,
  SearchResults,
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
  search: (query) => fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`).then(res => res.json()),
  getMovieVideos: (movieId) => fetch(`${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`).then(res => res.json()),
  getTVVideos: (tvId) => fetch(`${TMDB_BASE_URL}/tv/${tvId}/videos?api_key=${TMDB_API_KEY}`).then(res => res.json()),
  getMovieDetails: (movieId) => fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`).then(res => res.json()),
  getTVDetails: (tvId) => fetch(`${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}`).then(res => res.json())
};

const Home = () => {
  // State Management
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [currentVideoKey, setCurrentVideoKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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
          documentariesData
        ] = await Promise.all([
          tmdbAPI.getTrending(),
          tmdbAPI.getPopular(),
          tmdbAPI.getTopRated(),
          tmdbAPI.getUpcoming(),
          tmdbAPI.getTVShows(),
          tmdbAPI.getActionMovies(),
          tmdbAPI.getComedyMovies(),
          tmdbAPI.getHorrorMovies(),
          tmdbAPI.getDocumentaries()
        ]);

        // Set featured movie from trending
        if (trendingData.results && trendingData.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(5, trendingData.results.length));
          setFeaturedMovie(trendingData.results[randomIndex]);
        }

        // Organize categories
        const categoryList = [
          { title: 'Trending Now', movies: trendingData.results || [] },
          { title: 'Popular Movies', movies: popularData.results || [] },
          { title: 'Top Rated', movies: topRatedData.results || [] },
          { title: 'Popular TV Shows', movies: tvShowsData.results || [] },
          { title: 'Action Movies', movies: actionData.results || [] },
          { title: 'Comedy Movies', movies: comedyData.results || [] },
          { title: 'Horror Movies', movies: horrorData.results || [] },
          { title: 'Documentaries', movies: documentariesData.results || [] },
          { title: 'Coming Soon', movies: upcomingData.results || [] }
        ];

        setCategories(categoryList);
        setLoading(false);
      } catch (error) {
        console.error('Error loading movie data:', error);
        setLoading(false);
      }
    };

    loadMovieData();
  }, []);

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
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  // Handle movie detail modal
  const handleShowDetails = async (movie) => {
    try {
      let detailedMovie;
      if (movie.media_type === 'tv' || movie.first_air_date) {
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
      if (movie.media_type === 'tv' || movie.first_air_date) {
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
      } else {
        // Fallback: search for a generic trailer on YouTube
        const searchTerm = movie.title || movie.name;
        const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm + ' trailer')}`;
        window.open(youtubeSearchUrl, '_blank');
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      // Fallback to YouTube search
      const searchTerm = movie.title || movie.name;
      const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm + ' trailer')}`;
      window.open(youtubeSearchUrl, '_blank');
    }
  };

  // Handle escape key for modals
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        setIsDetailModalOpen(false);
        setIsVideoPlayerOpen(false);
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
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      {isSearching ? (
        <SearchResults 
          searchResults={searchResults}
          isSearching={isSearching}
          onPlayTrailer={handlePlayTrailer}
          onShowDetails={handleShowDetails}
        />
      ) : (
        <>
          <HeroSection 
            featuredMovie={featuredMovie}
            onPlayTrailer={handlePlayTrailer}
          />
          
          <div className="relative z-10 -mt-32 pb-20">
            {categories.map((category, index) => (
              <CategoryRow
                key={index}
                title={category.title}
                movies={category.movies}
                onPlayTrailer={handlePlayTrailer}
                onShowDetails={handleShowDetails}
              />
            ))}
          </div>
          
          <Footer />
        </>
      )}

      {/* Modals */}
      <MovieDetailModal
        movie={selectedMovie}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedMovie(null);
        }}
        onPlayTrailer={handlePlayTrailer}
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