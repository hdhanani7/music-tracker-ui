// Music Release Tracker - Clean, Beautiful React App
import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Music, Users, BarChart3, Bell, RefreshCcw, Menu, X, RefreshCw, Search, Wifi, WifiOff, Calendar, Clock, Heart } from 'lucide-react';
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

  return (
    <div className="page-content">
      {releases?.releases && releases.releases.length > 0 ? (
        <div className="releases-grid">
          {releases.releases.map((release) => (
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
  const { data: artistsData, isLoading, error } = useQuery({
    queryKey: ['artists'],
    queryFn: () => api.artists.getAll()
  });

  if (isLoading) return <LoadingSpinner message="Loading artists..." />;
  if (error) return <ErrorMessage message="Failed to load artists" />;

  return (
    <div className="page-content">
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
          message="Add some artists to follow and discover their latest releases."
        />
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