# Music Release Tracker - Frontend Application

## 🎵 Project Overview

This is a **complete music release tracker application** with a React TypeScript frontend and Express.js backend. The system helps users follow artists and automatically discover new music releases using the MusicBrainz API.

### Architecture
- **Frontend**: React 19 + TypeScript + React Query (deployed on Railway)
- **Backend**: Express.js + PostgreSQL + MusicBrainz API integration (deployed on Railway)
- **Real-time Integration**: Frontend connects to backend API for live data

## 📁 Project Structure

```
music-tracker-ui/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── api/
│   │   └── client.ts          # API client with all backend endpoints
│   ├── App.tsx                # Main application with navigation & components
│   ├── App.css                # Complete styling for all components
│   ├── index.tsx              # React app entry point
│   └── index.css              # Global styles
├── Dockerfile                 # Railway deployment configuration
├── railway.json               # Railway-specific settings
├── .dockerignore              # Docker build exclusions
├── package.json               # Dependencies and scripts
└── CLAUDE.md                  # This documentation
```

## 🚀 Tech Stack

### Frontend Dependencies
- **React 19.1.1** - Latest React with concurrent features
- **TypeScript 4.9.5** - Type safety and developer experience
- **@tanstack/react-query 5.85.9** - Server state management and caching
- **axios 1.11.0** - HTTP client for API requests
- **lucide-react 0.542.0** - Beautiful icon library
- **date-fns 4.1.0** - Date manipulation utilities

### Core Features
- ✅ **Real-time API Integration** - Live data from backend
- ✅ **Responsive Design** - Mobile and desktop optimized
- ✅ **Navigation System** - 5 main sections with sidebar navigation
- ✅ **Loading States** - Proper loading indicators and error handling
- ✅ **Data Caching** - React Query for efficient data fetching
- ✅ **Professional UI** - Clean, modern design with hover effects
- ✅ **Connection Status** - Live API connection monitoring

## 🎯 Application Sections

### 1. New Releases (`/releases`)
- **Purpose**: Display recent releases from followed artists
- **API Endpoint**: `GET /api/releases/new`
- **Features**:
  - Card-based layout showing release info
  - Release type badges (album, single, EP)
  - Release dates and track counts
  - "New" indicators for unread releases
  - Artist name and metadata

### 2. Artists (`/artists`) 
- **Purpose**: Manage followed artists
- **API Endpoint**: `GET /api/artists`
- **Features**:
  - Grid of artist cards
  - Follow dates and statistics
  - Total releases and new release counts
  - Latest release information
  - Release statistics per artist

### 3. Statistics (`/stats`)
- **Purpose**: Music discovery insights and analytics
- **API Endpoint**: `GET /api/releases/stats`
- **Features**:
  - Total releases tracked
  - Listened vs unlistened counts
  - Monthly discovery metrics
  - Breakdown by release type (albums, singles, EPs)
  - Beautiful stat cards with icons

### 4. Notifications (`/notifications`)
- **Purpose**: Notification history and settings
- **Status**: Placeholder for future implementation
- **Planned Features**: Release notifications, settings management

### 5. Sync Status (`/sync`)
- **Purpose**: Release synchronization monitoring
- **Status**: Placeholder for future implementation  
- **Planned Features**: Sync history, manual sync triggers, sync settings

## 🔌 API Integration

### API Client (`src/api/client.ts`)
Complete TypeScript client matching backend endpoints:

```typescript
// Base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Available methods
api.health()                    // Health check
api.artists.getAll()           // All followed artists
api.artists.search(query)      // Search artists to follow
api.artists.add(artistData)    // Follow new artist
api.releases.getNew()          // New releases
api.releases.getStats()        // Release statistics
api.releases.getAll()          // All releases with filtering
// ... and more
```

### Environment Variables
- **`REACT_APP_API_URL`**: Backend API URL (set in Railway deployment)
  - Local: `http://localhost:3001`
  - Production: Your Railway backend URL

## 🎨 UI Components

### Navigation
- **Sidebar Navigation**: Collapsible sidebar with sections
- **Mobile Responsive**: Hamburger menu for mobile devices
- **Active States**: Visual indicators for current section
- **Connection Status**: Live API connection indicator

### Data Display Components
- **Release Cards**: Beautiful cards showing release information
- **Artist Cards**: Artist information with statistics
- **Stat Cards**: Metric displays with icons and values
- **Loading Spinners**: Animated loading states
- **Error Messages**: User-friendly error handling
- **Empty States**: Helpful messages when no data available

### Responsive Design
- **Desktop**: Full sidebar with detailed information
- **Tablet**: Collapsible sidebar with essential info
- **Mobile**: Hamburger menu with optimized card layouts

## 🛠 Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Backend Integration
The frontend expects the backend API to be running on:
- **Local**: `http://localhost:3001`
- **Production**: Set via `REACT_APP_API_URL` environment variable

## 🚀 Deployment (Railway)

### Frontend Deployment Files
- **`Dockerfile`**: Multi-stage build with Node.js 18 Alpine
- **`railway.json`**: Railway configuration for Docker builds
- **`.dockerignore`**: Excludes unnecessary files from build

### Deployment Process
1. **Git Repository**: Committed and ready for deployment
2. **Railway Integration**: Deploy via CLI or GitHub integration
3. **Environment Variables**: Set `REACT_APP_API_URL` in Railway
4. **CORS Configuration**: Backend updated to allow Railway domain

### Production URLs
- **Frontend**: `https://music-tracker-ui-production.up.railway.app`
- **Backend**: Your Railway backend URL (set as environment variable)

## 🔒 Security & Performance

### CORS Configuration
Backend updated to allow frontend domains:
- `http://localhost:3000` (development)
- `https://music-tracker-ui-production.up.railway.app` (production)
- Custom domains via environment variables

### Performance Optimizations
- **React Query Caching**: 5-minute stale time, 10-minute garbage collection
- **Code Splitting**: Automatic with React build process
- **Compression**: Gzip compression in production
- **Optimized Images**: Lazy loading and proper sizing

## 🗂 Data Models

### Artist Interface
```typescript
interface Artist {
  id: string;
  name: string;
  mbid: string | null;
  followed_at: string;
  latest_release_date: string | null;
  total_releases: number;
  new_releases: number;
}
```

### Release Interface
```typescript
interface Release {
  id: string;
  artist_id: string;
  artist_name: string;
  title: string;
  mbid: string | null;
  release_date: string;
  release_type: string;
  track_count: number;
  is_new: boolean;
  discovered_at: string;
}
```

## 🎯 Future Enhancements

### Planned Features
- **Search Functionality**: Global search across artists and releases
- **Notifications System**: Real-time notifications for new releases
- **User Preferences**: Customizable notification settings
- **Release Actions**: Mark as listened, rate releases, add notes
- **Playlist Integration**: Export to streaming services
- **Advanced Filtering**: Filter by genre, year, type, etc.
- **Dark Mode**: Theme switching capability

### Technical Improvements
- **PWA Support**: Service workers and offline capability
- **Real-time Updates**: WebSocket integration for live updates
- **Advanced Analytics**: More detailed statistics and insights
- **Export Features**: Data export capabilities
- **Accessibility**: Enhanced screen reader support

## 🤝 Backend Integration Details

### Related Repository
- **Backend API**: `/Users/hussaindhanani/Projects/music-release-tracker/music-release-tracker-api`
- **Database**: PostgreSQL with artists, releases, tracks tables
- **External APIs**: MusicBrainz for music data
- **Background Jobs**: Scheduled release discovery

### CORS Configuration Updated
The backend has been configured to accept requests from the Railway frontend domain with proper security measures and logging.

## 📋 Development Notes

### Code Quality
- **TypeScript**: Full type safety throughout the application
- **ESLint**: Linting configured with React best practices
- **Component Architecture**: Clean separation of concerns
- **Error Boundaries**: Proper error handling and user feedback
- **Loading States**: Comprehensive loading and error states

### Best Practices Implemented
- **Environment-based Configuration**: Proper environment variable usage
- **Responsive Design**: Mobile-first approach
- **Performance**: Optimized rendering and data fetching
- **User Experience**: Intuitive navigation and feedback
- **Security**: CORS properly configured, no exposed secrets

## 🎵 Generated with Claude Code

This complete music release tracker application was built collaboratively with Claude Code, featuring:
- Beautiful, responsive React frontend
- Full TypeScript implementation
- Complete API integration
- Railway deployment ready
- Professional UI/UX design
- Comprehensive error handling
- Real-time data connectivity

**Co-Authored-By: Claude <noreply@anthropic.com>**