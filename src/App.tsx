// Music Release Tracker - Clean, Beautiful React App
import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Music, Users, BarChart3, Bell, RefreshCcw, Menu, X, RefreshCw, Search, Wifi, WifiOff, Calendar, Clock, Heart, Plus, UserPlus, Loader2 } from 'lucide-react';
import api from './api/client';
import './App.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Navigation configuration
const navigation = [
  { id: 'releases', name: 'New Releases', icon: Music, description: 'Latest releases from your followed artists' },
  { id: 'artists', name: 'Artists', icon: Users, description: 'Manage your followed artists' },
  { id: 'stats', name: 'Statistics', icon: BarChart3, description: 'Your music discovery insights' },
  { id: 'notifications', name: 'Notifications', icon: Bell, description: 'Notification history and settings' },
  { id: 'sync', name: 'Sync Status', icon: RefreshCcw, description: 'Release sync status and history' }
];

function App() {
  const [currentView, setCurrentView] = useState('releases');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Test API connection on startup
  useEffect(() => {
    const testConnection = async () => {
      try {
        await api.health();
        setApiConnected(true);
        console.log('✅ Successfully connected to API');
      } catch (error) {
        setApiConnected(false);
        console.log('❌ Failed to connect to API:', error);
      }
    };
    
    testConnection();
  }, []);

  const currentNavItem = navigation.find(item => item.id === currentView);

  const handleViewChange = (viewId: string) => {
    setCurrentView(viewId);
    setSidebarOpen(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries();
      // Test API connection again
      await api.health();
      setApiConnected(true);
    } catch (error) {
      setApiConnected(false);
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="sidebar-header">
            <div className="logo">
              <Music className="logo-icon" />
              <div className="logo-text">
                <h1>Music Tracker</h1>
                <p>Release Discovery</p>
              </div>
            </div>
            <button 
              className="close-btn mobile-only"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <nav className="nav">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === currentView;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                  {isActive && <div className="nav-indicator" />}
                </button>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <p>🎵 Personal Music Discovery</p>
            <p>Built with React + Express</p>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {sidebarOpen && <div className="backdrop" onClick={() => setSidebarOpen(false)} />}

        {/* Main content */}
        <main className="main">
          {/* Header */}
          <header className="header">
            <div className="header-left">
              <button 
                className="menu-btn mobile-only"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
              
              <div className="page-info">
                {currentNavItem?.icon && (
                  <div className="page-icon">
                    <currentNavItem.icon size={20} />
                  </div>
                )}
                <div>
                  <h2>{currentNavItem?.name || 'Music Release Tracker'}</h2>
                  <p>{currentNavItem?.description}</p>
                </div>
              </div>
            </div>

            <div className="header-right">
              {/* Connection status */}
              <div className="connection-status">
                {apiConnected === null ? (
                  <>
                    <div className="status-indicator connecting" />
                    <span className="desktop-only">Connecting...</span>
                  </>
                ) : apiConnected ? (
                  <>
                    <Wifi size={16} className="status-icon connected" />
                    <span className="desktop-only">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={16} className="status-icon disconnected" />
                    <span className="desktop-only">Disconnected</span>
                  </>
                )}
              </div>

              {/* Action buttons */}
              <button 
                className="icon-btn"
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Refresh data"
              >
                <RefreshCw size={20} className={isRefreshing ? 'spinning' : ''} />
              </button>

              <button 
                className="icon-btn desktop-only"
                title="Search (coming soon)"
                disabled
              >
                <Search size={20} />
              </button>
            </div>
          </header>

          {/* Content area */}
          <div className="content">
            <MainContent 
              currentView={currentView} 
              apiConnected={apiConnected}
            />
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

// Main content component
function MainContent({ currentView, apiConnected }: { 
  currentView: string; 
  apiConnected: boolean | null; 
}) {
  if (!apiConnected) {
    return <ConnectionHelp />;
  }

  switch (currentView) {
    case 'releases':
      return <ReleasesView />;
    case 'artists':
      return <ArtistsView />;
    case 'stats':
      return <StatsView />;
    case 'notifications':
      return <NotificationsView />;
    case 'sync':
      return <SyncView />;
    default:
      return <ComingSoonView />;
  }
}

// Connection help component
function ConnectionHelp() {
  return (
    <div className="page-content">
      <div className="empty-state">
        <div className="empty-icon">
          <WifiOff size={48} />
        </div>
        <h3>API Connection Required</h3>
        <p>Connect to your backend API to access your music collection.</p>
        <div className="connection-help">
          <p><strong>To connect your backend:</strong></p>
          <ol>
            <li>Make sure your API is running on <code>http://localhost:3001</code></li>
            <li>Check the console for connection errors</li>
            <li>Verify CORS is configured for <code>http://localhost:3000</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// Releases view component
function ReleasesView() {
  const { data: releases, isLoading, error } = useQuery({
    queryKey: ['releases', 'new'],
    queryFn: () => api.releases.getNew(20)
  });

  if (isLoading) return <LoadingSpinner message="Loading new releases..." />;
  if (error) return <ErrorMessage message="Failed to load releases" />;

  // Group releases by type and sort by date
  const groupReleasesByType = (releases: any[]) => {
    const grouped: { [key: string]: any[] } = {};
    releases.forEach(release => {
      const type = release.release_type || 'Other';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(release);
    });
    
    // Sort each group by release date (newest first)
    Object.keys(grouped).forEach(type => {
      grouped[type].sort((a, b) => {
        const dateA = new Date(a.release_date);
        const dateB = new Date(b.release_date);
        return dateB.getTime() - dateA.getTime(); // Newest first
      });
    });
    
    return grouped;
  };

  // Define preferred order for release types
  const typeOrder = ['Album', 'EP', 'Single', 'Compilation', 'Soundtrack', 'Other'];

  return (
    <div className="page-content">
      {releases?.releases && releases.releases.length > 0 ? (
        <div className="releases-by-type">
          {(() => {
            const groupedReleases = groupReleasesByType(releases.releases);
            const sortedTypes = typeOrder.filter(type => groupedReleases[type]);
            
            // Add any types not in our predefined order
            Object.keys(groupedReleases).forEach(type => {
              if (!typeOrder.includes(type)) {
                sortedTypes.push(type);
              }
            });

            return sortedTypes.map(type => (
              <div key={type} className="release-type-section">
                <div className="release-type-header">
                  <h3 className="release-type-title">{type}s</h3>
                  <span className="release-type-count">
                    {groupedReleases[type].length} release{groupedReleases[type].length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="releases-grid">
                  {groupedReleases[type].map((release) => (
                    <div key={release.id} className="release-card">
                      <div className="release-header">
                        <Music size={20} className="release-icon" />
                        <div className="release-meta">
                          <span className="release-type">{release.release_type}</span>
                          <span className="release-date">
                            <Calendar size={14} />
                            {new Date(release.release_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <h3 className="release-title">{release.title}</h3>
                      <p className="release-artist">{release.artist_name}</p>
                      <div className="release-info">
                        <span className="track-count">{release.track_count} tracks</span>
                        {release.is_new && <span className="new-badge">New</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ));
          })()}
        </div>
      ) : (
        <EmptyState 
          icon={Music}
          title="No new releases"
          message="All caught up! No new releases from your followed artists."
        />
      )}
    </div>
  );
}

// Artists view component
function ArtistsView() {
  const [showSearch, setShowSearch] = useState(false);

  const { data: artistsData, isLoading, error, refetch } = useQuery({
    queryKey: ['artists'],
    queryFn: () => api.artists.getAll()
  });

  if (isLoading) return <LoadingSpinner message="Loading artists..." />;
  if (error) return <ErrorMessage message="Failed to load artists" />;

  return (
    <div className="page-content">
      {/* Search Section */}
      <div className="artists-header">
        <div className="artists-title">
          <h2>Your Followed Artists</h2>
          <p>Manage and discover new artists to follow</p>
        </div>
        <button 
          className="add-artist-btn"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Plus size={20} />
          Add Artist
        </button>
      </div>

      {/* Search Interface */}
      {showSearch && (
        <ArtistSearchSection 
          onArtistAdded={() => {
            refetch();
            setShowSearch(false);
          }} 
        />
      )}

      {/* Artists Grid */}
      {artistsData?.artists && artistsData.artists.length > 0 ? (
        <div className="artists-grid">
          {artistsData.artists.map((artist) => (
            <div key={artist.id} className="artist-card">
              <div className="artist-header">
                <Users size={20} className="artist-icon" />
                <div className="artist-meta">
                  <span className="follow-date">
                    <Clock size={14} />
                    Followed {new Date(artist.followed_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <h3 className="artist-name">{artist.name}</h3>
              <div className="artist-stats">
                <span className="stat">
                  <strong>{artist.total_releases}</strong> releases
                </span>
                {Number(artist.new_releases) > 0 && (
                  <span className="stat new">
                    <strong>{artist.new_releases}</strong> new
                  </span>
                )}
              </div>
              {artist.latest_release_date && (
                <p className="last-release">
                  Latest: {new Date(artist.latest_release_date).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={Users}
          title="No artists found"
          message="Click 'Add Artist' to search and follow new artists."
        />
      )}
    </div>
  );
}

// Artist search section component
function ArtistSearchSection({ onArtistAdded }: { onArtistAdded: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingArtistId, setAddingArtistId] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await api.artists.search(query, 8);
      setSearchResults(results.artists || []);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddArtist = async (artist: any) => {
    setAddingArtistId(artist.mbid);
    try {
      await api.artists.add({
        name: artist.name,
        mbid: artist.mbid
      });
      
      // Clear search and notify parent
      setSearchQuery('');
      setSearchResults([]);
      onArtistAdded();
    } catch (error: any) {
      console.error('Failed to add artist:', error);
      // Handle duplicate artist error gracefully
      if (error.response?.status === 409) {
        alert('This artist is already in your follow list!');
      } else {
        alert('Failed to add artist. Please try again.');
      }
    } finally {
      setAddingArtistId(null);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="search-section">
      <div className="search-header">
        <h3>Search for Artists</h3>
        <p>Search MusicBrainz to find new artists to follow</p>
      </div>
      
      <div className="search-input-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search for artists (e.g., 'The Beatles', 'Drake', 'Taylor Swift')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {isSearching && <Loader2 size={20} className="search-loading" />}
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          <h4>Search Results ({searchResults.length})</h4>
          <div className="search-results-grid">
            {searchResults.map((artist) => (
              <div key={artist.mbid} className="search-result-card">
                <div className="search-result-info">
                  <h5 className="search-result-name">{artist.name}</h5>
                  <div className="search-result-meta">
                    {artist.disambiguation && (
                      <span className="disambiguation">{artist.disambiguation}</span>
                    )}
                    {artist.country && (
                      <span className="country">{artist.country}</span>
                    )}
                    {artist.begin_date && (
                      <span className="date">Since {new Date(artist.begin_date).getFullYear()}</span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleAddArtist(artist)}
                  disabled={artist.is_followed || addingArtistId === artist.mbid}
                  className={`follow-btn ${artist.is_followed ? 'followed' : ''}`}
                >
                  {addingArtistId === artist.mbid ? (
                    <Loader2 size={16} className="spinning" />
                  ) : artist.is_followed ? (
                    <>
                      <Users size={16} />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Follow
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
        <div className="no-results">
          <Search size={24} />
          <p>No artists found for "{searchQuery}"</p>
          <p className="hint">Try different search terms or check spelling</p>
        </div>
      )}
    </div>
  );
}

// Stats view component
function StatsView() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['releases', 'stats'],
    queryFn: () => api.releases.getStats()
  });

  if (isLoading) return <LoadingSpinner message="Loading statistics..." />;
  if (error) return <ErrorMessage message="Failed to load statistics" />;

  return (
    <div className="page-content">
      {stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <Music size={24} className="stat-icon" />
              <h3>Total Releases</h3>
            </div>
            <div className="stat-value">{stats.total_releases}</div>
            <div className="stat-detail">{stats.new_releases} new</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <Heart size={24} className="stat-icon" />
              <h3>Listened</h3>
            </div>
            <div className="stat-value">{stats.listened}</div>
            <div className="stat-detail">releases enjoyed</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <Calendar size={24} className="stat-icon" />
              <h3>This Month</h3>
            </div>
            <div className="stat-value">{stats.this_month}</div>
            <div className="stat-detail">releases discovered</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <BarChart3 size={24} className="stat-icon" />
              <h3>Release Types</h3>
            </div>
            <div className="stat-breakdown">
              <div className="breakdown-item">
                <span>Albums</span>
                <strong>{stats.albums}</strong>
              </div>
              <div className="breakdown-item">
                <span>Singles</span>
                <strong>{stats.singles}</strong>
              </div>
              <div className="breakdown-item">
                <span>EPs</span>
                <strong>{stats.eps}</strong>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState 
          icon={BarChart3}
          title="No statistics available"
          message="Statistics will appear once you start tracking releases."
        />
      )}
    </div>
  );
}

// Notifications view (placeholder)
function NotificationsView() {
  return (
    <div className="page-content">
      <EmptyState 
        icon={Bell}
        title="No notifications"
        message="You will receive notifications when new releases are available."
      />
    </div>
  );
}

// Sync view (placeholder)
function SyncView() {
  return (
    <div className="page-content">
      <EmptyState 
        icon={RefreshCcw}
        title="Sync Status"
        message="Sync is running in the background to discover new releases."
      />
    </div>
  );
}

// Coming soon view
function ComingSoonView() {
  return (
    <div className="page-content">
      <EmptyState 
        icon={Music}
        title="Coming soon"
        message="This feature is under development."
      />
    </div>
  );
}

// Utility components
function LoadingSpinner({ message }: { message: string }) {
  return (
    <div className="page-content">
      <div className="loading-state">
        <div className="spinner">
          <RefreshCw size={32} className="spinning" />
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="page-content">
      <div className="error-state">
        <div className="error-icon">
          <WifiOff size={32} />
        </div>
        <h3>Something went wrong</h3>
        <p>{message}</p>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, message }: { 
  icon: React.ComponentType<any>; 
  title: string; 
  message: string; 
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon size={48} />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

export default App;