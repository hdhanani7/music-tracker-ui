// API client for Music Release Tracker backend
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'Network Error'}`);
    return Promise.reject(error);
  }
);

// Type definitions matching your backend
export interface Artist {
  id: string;
  name: string;
  mbid: string | null;
  followed_at: string;
  latest_release_date: string | null;
  total_releases: number;
  new_releases: number;
}

export interface Release {
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

export interface ApiResponse<T> {
  data: T;
  total?: number;
  message?: string;
}

// API methods matching your backend routes
export const api = {
  // Health check
  health: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  // Artists endpoints
  artists: {
    getAll: async (params?: { sort?: string; order?: string }) => {
      const response = await apiClient.get<{
        artists: Artist[];
        total: number;
        sort: string;
        order: string;
      }>('/api/artists', { params });
      return response.data;
    },

    search: async (query: string, limit = 10) => {
      const response = await apiClient.get('/api/artists/search', {
        params: { q: query, limit }
      });
      return response.data;
    },

    add: async (artistData: { name: string; mbid?: string }) => {
      const response = await apiClient.post('/api/artists', artistData);
      return response.data;
    },

    remove: async (id: string) => {
      const response = await apiClient.delete(`/api/artists/${id}`);
      return response.data;
    },

    bulkAdd: async (artists: Array<{ name: string; mbid?: string }>) => {
      const response = await apiClient.post('/api/artists/bulk', { artists });
      return response.data;
    }
  },

  // Releases endpoints
  releases: {
    getAll: async (params?: {
      days?: number;
      type?: string;
      status?: string;
      page?: number;
      limit?: number;
      artist_id?: string;
    }) => {
      const response = await apiClient.get<{
        releases: Release[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
        };
      }>('/api/releases', { params });
      return response.data;
    },

    getNew: async (limit = 50) => {
      const response = await apiClient.get<{
        releases: Release[];
        total: number;
      }>('/api/releases/new', { params: { limit } });
      return response.data;
    },

    getStats: async () => {
      const response = await apiClient.get('/api/releases/stats');
      return response.data;
    },

    getById: async (id: string) => {
      const response = await apiClient.get<Release>(`/api/releases/${id}`);
      return response.data;
    },

    markAsListened: async (id: string) => {
      const response = await apiClient.put(`/api/releases/${id}/listened`);
      return response.data;
    },

    markAsRead: async (id: string) => {
      const response = await apiClient.put(`/api/releases/${id}/read`);
      return response.data;
    }
  },

  // Sync endpoints
  sync: {
    triggerManual: async () => {
      const response = await apiClient.post('/api/sync/manual');
      return response.data;
    },

    getStatus: async () => {
      const response = await apiClient.get('/api/sync/status');
      return response.data;
    },

    getHistory: async (params?: { page?: number; limit?: number }) => {
      const response = await apiClient.get('/api/sync/history', { params });
      return response.data;
    },

    getStats: async () => {
      const response = await apiClient.get('/api/sync/stats');
      return response.data;
    }
  },

  // Notifications endpoints
  notifications: {
    getAll: async (params?: { page?: number; limit?: number; status?: string }) => {
      const response = await apiClient.get('/api/notifications', { params });
      return response.data;
    },

    getUnread: async () => {
      const response = await apiClient.get('/api/notifications/unread');
      return response.data;
    },

    markAsRead: async (id: string) => {
      const response = await apiClient.put(`/api/notifications/${id}/read`);
      return response.data;
    },

    markAllAsRead: async () => {
      const response = await apiClient.put('/api/notifications/read-all');
      return response.data;
    },

    getStats: async () => {
      const response = await apiClient.get('/api/notifications/stats');
      return response.data;
    }
  }
};

export default api;