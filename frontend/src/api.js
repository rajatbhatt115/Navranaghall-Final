import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_LOCAL || 'http://localhost:5000/api';

const api = {

  getAuthToken: () => localStorage.getItem('payload-token'),
  
  getUserId: () => {

    const user = localStorage.getItem('user')

    if (!user) return null

    const parsedUser = JSON.parse(user)

    return parsedUser.id || parsedUser._id
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('payload-token')
  },
  
  // Auth endpoints
  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
    if (response.data.token) {
      localStorage.setItem('payload-token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  
  login: async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/users/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('payload-token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  
  logout: () => {
    localStorage.removeItem('payload-token');
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
    } catch (error) {
      api.logout();
      return null;
    }
  },
  
  sendOTP: (email) => axios.post(`${API_BASE_URL}/auth/send-otp`, { email }),
  verifyOTP: (email, otp) => axios.post(`${API_BASE_URL}/auth/verify-otp`, { email, otp }),
  resetPassword: (email, otp, newPassword) => axios.post(`${API_BASE_URL}/auth/reset-password`, { email, otp, newPassword }),
  
  // ==================== PUBLIC ROUTES ====================
  getHomeBanner: (pageName) => axios.get(`${API_BASE_URL}/homeBanners/page/${pageName}`),
  getDiscoverProducts: () => axios.get(`${API_BASE_URL}/discoverProducts`).then(res => ({ data: res.data.docs || [] })),
  getCategories: () => axios.get(`${API_BASE_URL}/categories`).then(res => ({ data: res.data.docs || [] })),
  getTopRatingProducts: async (category) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/topRatingProducts?category=${category}`);
      // Handle both formats: direct array or { docs: [...] }
      if (response.data.docs && response.data.docs[0]?.products) {
        return { data: response.data.docs[0].products };
      }
      return { data: response.data || [] };
    } catch (error) {
      console.error('Error fetching top rating products:', error);
      return { data: [] };
    }
  },
  getTestimonials: () => axios.get(`${API_BASE_URL}/testimonials`).then(res => ({ data: res.data.docs || [] })),
  getBlogHome: () => axios.get(`${API_BASE_URL}/blogHome`).then(res => ({ data: res.data })),
  getAboutContent: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/aboutContent`);
      // Handle both formats: { docs: [...] } or direct object
      if (response.data.docs && response.data.docs[0]) {
        return { data: response.data.docs[0] };
      }
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching about content:', error);
      return { data: null };
    }
  },
  getAboutData: () => api.getAboutContent(),
  getTeam: () => axios.get(`${API_BASE_URL}/team`).then(res => ({ data: res.data.docs || [] })),
  getProducts: () => axios.get(`${API_BASE_URL}/products`).then(res => ({ data: res.data.docs || [] })),
  getProductDetails: (id) => axios.get(`${API_BASE_URL}/products/${id}`),
  getBlogPages: async () => {
    const response = await axios.get(`${API_BASE_URL}/blogs`);
    const blogs = response.data.docs || [];
    const pages = {};
    blogs.forEach(blog => {
      if (!pages[blog.pageNumber]) pages[blog.pageNumber] = { mainBlogs: [], smallBlogs: [] };
      if (blog.blogType === 'main') pages[blog.pageNumber].mainBlogs.push(blog);
      else pages[blog.pageNumber].smallBlogs.push(blog);
    });
    return { data: Object.keys(pages).map(page => ({ page: parseInt(page), ...pages[page] })) };
  },
  getInnerBlog: (id) => axios.get(`${API_BASE_URL}/blogs/${id}`),
  addBlogComment: async (blogId, commentData) => {
    const response = await axios.post(`${API_BASE_URL}/blogs/${blogId}/comments`, commentData);
    return response;
  },
  
  // ==================== PROTECTED ROUTES (Require Auth) ====================
  getCartItems: async () => {
    const userId = api.getUserId();
    if (!userId) throw new Error('Please login first');
    const response = await axios.get(`${API_BASE_URL}/cartItems/user/${userId}`, {
      headers: { Authorization: `Bearer ${api.getAuthToken()}` }
    });
    return response;
  },
  addToCart: async (data) => {
    const userId = api.getUserId();
    if (!userId) throw new Error('Please login first');
    const response = await axios.post(`${API_BASE_URL}/cartItems`, data, {
      headers: { Authorization: `Bearer ${api.getAuthToken()}` }
    });
    return response;
  },
  updateCartItem: (id, data) => axios.patch(`${API_BASE_URL}/cartItems/${id}`, data, {
    headers: { Authorization: `Bearer ${api.getAuthToken()}` }
  }),
  deleteCartItem: (id) => axios.delete(`${API_BASE_URL}/cartItems/${id}`, {
    headers: { Authorization: `Bearer ${api.getAuthToken()}` }
  }),
  
  getWishlistItems: async () => {
    const userId = api.getUserId();
    if (!userId) throw new Error('Please login first');
    const response = await axios.get(`${API_BASE_URL}/wishlistItems/user/${userId}`, {
      headers: { Authorization: `Bearer ${api.getAuthToken()}` }
    });
    return response;
  },
  addToWishlist: async (data) => {
    const userId = api.getUserId();
    if (!userId) throw new Error('Please login first');
    const response = await axios.post(`${API_BASE_URL}/wishlistItems`, data, {
      headers: { Authorization: `Bearer ${api.getAuthToken()}` }
    });
    return response;
  },
  // ✅ ADD THIS
updateWishlistItem: (id, data) => axios.patch(
  `${API_BASE_URL}/wishlistItems/${id}`,
  data,
  {
    headers: {
      Authorization: `Bearer ${api.getAuthToken()}`
    }
  }
),

deleteWishlistItem: (id) => axios.delete(`${API_BASE_URL}/wishlistItems/${id}`, {
  headers: { Authorization: `Bearer ${api.getAuthToken()}` }
}),
  deleteWishlistItem: (id) => axios.delete(`${API_BASE_URL}/wishlistItems/${id}`, {
    headers: { Authorization: `Bearer ${api.getAuthToken()}` }
  }),
  
  createOrder: async (data) => {
    const userId = api.getUserId();
    if (!userId) throw new Error('Please login first');
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
  
  addProductReview: async (reviewData) => {
    const response = await axios.post(`${API_BASE_URL}/productReviews`, reviewData);
    return response;
  },
};

export default api;