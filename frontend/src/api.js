import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = {
  // Helper functions
  getAuthToken: () => localStorage.getItem('token'),

  getUserId: () => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.id || parsedUser._id;
    } catch {
      return null;
    }
  },

  isAuthenticated: () => !!localStorage.getItem('token'),

  // ==================== AUTH ENDPOINTS ====================

  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  login: async (credentials) => {
    console.log('API login called with:', credentials.email);
    const response = await axios.post(`${API_BASE_URL}/users/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const token = api.getAuthToken();
    if (!token) return null;
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response;
    } catch {
      api.logout();
      return null;
    }
  },

  // ==================== PUBLIC ENDPOINTS ====================

  getHomeBanner: (pageName) => axios.get(`${API_BASE_URL}/home-banners/page/${pageName}`),

  getDiscoverProducts: async () => {
    const response = await axios.get(`${API_BASE_URL}/discover-products?limit=100&depth=2&sort=createdAt`);
    if (response.data && response.data.docs) {
      const transformedDocs = response.data.docs.map(doc => ({
        ...doc,
        image: doc.image?.url || '/placeholder-image.jpg',
      }));
      return { ...response, data: transformedDocs };
    }
    return response;
  },

  getCategories: async () => {
    const response = await axios.get(`${API_BASE_URL}/categories?limit=100&sort=createdAt`);
    if (response.data && response.data.docs) {
      return { ...response, data: response.data.docs };
    }
    return response;
  },

  getTopRatingProducts: async (category) => {
    const url = category
      ? `${API_BASE_URL}/top-rating-products?where[category][equals]=${encodeURIComponent(category)}&limit=100&sort=createdAt`
      : `${API_BASE_URL}/top-rating-products?limit=100&sort=createdAt`;
    const response = await axios.get(url);
    if (response.data && response.data.docs) {
      return { ...response, data: response.data.docs };
    }
    return response;
  },

  getTestimonials: async () => {
    const response = await axios.get(`${API_BASE_URL}/testimonials?limit=100&sort=createdAt`);
    if (response.data && response.data.docs) {
      return { ...response, data: response.data.docs };
    }
    return response;
  },

  getAboutContent: () => axios.get(`${API_BASE_URL}/about-content`),

  getTeam: async () => {
    const response = await axios.get(`${API_BASE_URL}/team?limit=100&sort=createdAt`);
    if (response.data && response.data.docs) {
      return { ...response, data: response.data.docs };
    }
    return response;
  },

  getProducts: async () => {
    const response = await axios.get(`${API_BASE_URL}/products?limit=100&sort=createdAt`);
    if (response.data && response.data.docs) {
      return { ...response, data: response.data.docs };
    }
    return response;
  },

  getProductDetails: (id) => axios.get(`${API_BASE_URL}/products/${id}`),

  getBlogs: async () => {
    const response = await axios.get(`${API_BASE_URL}/blogs?limit=100&sort=createdAt`);
    if (response.data && response.data.docs) {
      return { ...response, data: response.data.docs };
    }
    return response;
  },

  getBlogById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/blogs/${id}`);
    return response;
  },

  // ✅ FIXED: Added token header for authentication
  addBlogComment: async (blogId, commentData) => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
      throw new Error('Please login first to post a comment');
    }
    
    const response = await axios.post(`${API_BASE_URL}/blogs/${blogId}/comments`, commentData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  },

  getBlogHome: async () => {
    const response = await api.getBlogs();
    const blogs = Array.isArray(response.data) ? response.data : [];

    const homeBlogs = blogs.filter(blog => blog.showOnHome === true);
    const mainBlog = homeBlogs[0] || null;
    const smallBlogs = homeBlogs.slice(1, 4);

    return { data: { mainBlog, smallBlogs } };
  },

  getBlogPages: async () => {
    try {
      const response = await api.getBlogs();
      const blogs = Array.isArray(response.data) ? response.data : [];

      if (!blogs || blogs.length === 0) {
        return { data: [] };
      }

      const blogPageBlogs = blogs.filter(blog => blog.showOnBlog === true);

      if (blogPageBlogs.length === 0) {
        return { data: [] };
      }

      const pages = {};
      blogPageBlogs.forEach(blog => {
        const pageNum = blog.pageNumber || 1;
        if (!pages[pageNum]) {
          pages[pageNum] = { mainBlogs: [], smallBlogs: [] };
        }
        if (blog.blogType === 'main') {
          pages[pageNum].mainBlogs.push(blog);
        } else {
          pages[pageNum].smallBlogs.push(blog);
        }
      });

      const result = Object.keys(pages).map(page => ({
        page: parseInt(page),
        ...pages[page]
      }));

      return { data: result };
    } catch (error) {
      console.error('Error in getBlogPages:', error);
      return { data: [] };
    }
  },

  // ==================== CART ENDPOINTS ====================

  getCartItems: async () => {
    const userId = api.getUserId();
    if (!userId) throw new Error('Please login first');
    const response = await axios.get(`${API_BASE_URL}/cart/user/${userId}`, {
      headers: { Authorization: `Bearer ${api.getAuthToken()}` }
    });
    return response;
  },

  addToCart: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/cart`, data, {
      headers: { Authorization: `Bearer ${api.getAuthToken()}` }
    });
    return response;
  },

  updateCartItem: (id, data) => axios.patch(`${API_BASE_URL}/cart/${id}`, data, {
    headers: { Authorization: `Bearer ${api.getAuthToken()}` }
  }),

  deleteCartItem: (id) => axios.delete(`${API_BASE_URL}/cart/${id}`, {
    headers: { Authorization: `Bearer ${api.getAuthToken()}` }
  }),

  // ==================== WISHLIST ENDPOINTS ====================

  getWishlistItems: async () => {
    const userId = api.getUserId();
    if (!userId) throw new Error('Please login first');
    const response = await axios.get(`${API_BASE_URL}/wishlist/user/${userId}`, {
      headers: { Authorization: `Bearer ${api.getAuthToken()}` }
    });
    return response;
  },

  addToWishlist: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/wishlist`, data, {
      headers: { Authorization: `Bearer ${api.getAuthToken()}` }
    });
    return response;
  },

  updateWishlistItem: (id, data) => axios.patch(`${API_BASE_URL}/wishlist/${id}`, data, {
    headers: { Authorization: `Bearer ${api.getAuthToken()}` }
  }),

  deleteWishlistItem: (id) => axios.delete(`${API_BASE_URL}/wishlist/${id}`, {
    headers: { Authorization: `Bearer ${api.getAuthToken()}` }
  }),

  // ==================== ORDER ENDPOINTS ====================

  createOrder: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/orders`, data, {
      headers: { Authorization: `Bearer ${api.getAuthToken()}` }
    });
    return response;
  },

  getOrders: async () => {
    const userId = api.getUserId();
    if (!userId) throw new Error('Please login first');
    const response = await axios.get(`${API_BASE_URL}/orders/user/${userId}`, {
      headers: { Authorization: `Bearer ${api.getAuthToken()}` }
    });
    return response;
  },

  // ==================== REVIEWS ENDPOINTS ====================

  addProductReview: async (reviewData) => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
      throw new Error('Please login first to submit a review');
    }

    const response = await axios.post(`${API_BASE_URL}/products/${reviewData.productId}/reviews`, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  },
};

export default api;