import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_LOCAL || 'http://localhost:5000/api';

const api = {
  // Helper to get auth token
  getAuthToken: () => {
    return localStorage.getItem('token');
  },
  
  // Helper to get user ID
  getUserId: () => {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).id;
    }
    return null;
  },
  
  // Auth endpoints
  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/users`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  
  login: async (credentials) => {
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
    } catch (error) {
      api.logout();
      return null;
    }
  },
  
  sendOTP: (email) => axios.post(`${API_BASE_URL}/auth/send-otp`, { email }),
  verifyOTP: (email, otp) => axios.post(`${API_BASE_URL}/auth/verify-otp`, { email, otp }),
  resetPassword: (email, otp, newPassword) => axios.post(`${API_BASE_URL}/auth/reset-password`, { email, otp, newPassword }),
  
  // ==================== COMMON ====================
  getHomeBanner: (pageName) => axios.get(`${API_BASE_URL}/homeBanners?where[pageName][equals]=${pageName}`).then(res => ({ data: res.data.docs[0] })),
  
  // ==================== HOME PAGE COMPONENTS ====================
  getDiscoverProducts: () => axios.get(`${API_BASE_URL}/discoverProducts`).then(res => ({ data: res.data.docs })),
  getCategories: () => axios.get(`${API_BASE_URL}/categories`).then(res => ({ data: res.data.docs })),
  getTopRatingProducts: async (category) => {
    const response = await axios.get(`${API_BASE_URL}/topRatingProducts?where[category][equals]=${category}`);
    const item = response.data.docs[0];
    return { data: item ? item.products : [] };
  },
  getTestimonials: () => axios.get(`${API_BASE_URL}/testimonials`).then(res => ({ data: res.data.docs })),
  getBlogHome: () => axios.get(`${API_BASE_URL}/blogs?where[isMainBlog][equals]=true&limit=1`).then(async (res) => {
    const mainBlog = res.data.docs[0];
    const smallBlogs = await axios.get(`${API_BASE_URL}/blogs?where[isMainBlog][equals]=false&limit=2`);
    return { data: { mainBlog, smallBlogs: smallBlogs.data.docs } };
  }),
  getAboutContent: () => axios.get(`${API_BASE_URL}/aboutContent`).then(res => ({ data: res.data.docs[0] })),
  
  // ==================== ABOUT PAGE ====================
  getAboutData: () => axios.get(`${API_BASE_URL}/aboutContent`).then(res => ({ data: res.data.docs[0] })),
  getTeam: () => axios.get(`${API_BASE_URL}/team`).then(res => ({ data: res.data.docs })),
  
  // ==================== BLOG PAGE ====================
  getBlogPages: async () => {
    const response = await axios.get(`${API_BASE_URL}/blogs`);
    const blogs = response.data.docs;
    const pages = {};
    blogs.forEach(blog => {
      if (!pages[blog.pageNumber]) pages[blog.pageNumber] = { mainBlogs: [], smallBlogs: [] };
      if (blog.blogType === 'main') pages[blog.pageNumber].mainBlogs.push(blog);
      else pages[blog.pageNumber].smallBlogs.push(blog);
    });
    return { data: Object.keys(pages).map(page => ({ page: parseInt(page), ...pages[page] })) };
  },
  
  // ==================== INNER BLOG PAGE ====================
  getInnerBlog: (id) => axios.get(`${API_BASE_URL}/blogs/${id}`),
  
  // ==================== BLOG COMMENTS ====================
  addBlogComment: async (blogId, commentData) => {
    const blog = await axios.get(`${API_BASE_URL}/blogs/${blogId}`);
    const existingComments = blog.data.comments || [];
    const newComment = {
      id: existingComments.length + 1,
      ...commentData,
      date: new Date().toISOString()
    };
    const updatedComments = [...existingComments, newComment];
    return axios.patch(`${API_BASE_URL}/blogs/${blogId}`, { comments: updatedComments });
  },
  
  // ==================== SHOP PAGE ====================
  getProducts: () => axios.get(`${API_BASE_URL}/products`).then(res => ({ data: res.data.docs })),
  searchProducts: (filters) => {
    let query = `${API_BASE_URL}/products?`;
    if (filters.category) query += `category[equals]=${filters.category}&`;
    if (filters.search) query += `title[contains]=${filters.search}&`;
    return axios.get(query).then(res => ({ data: res.data.docs }));
  },
  
  // ==================== CART PAGE ====================
  getCartItems: async () => {
    const userId = api.getUserId();
    if (!userId) return { data: [] };
    const response = await axios.get(`${API_BASE_URL}/cartItems/user/${userId}`);
    return response;
  },
  updateCartItem: (id, data) => axios.patch(`${API_BASE_URL}/cartItems/${id}`, data),
  deleteCartItem: (id) => axios.delete(`${API_BASE_URL}/cartItems/${id}`),
  addToCart: async (data) => {
    const userId = api.getUserId();
    if (!userId) throw new Error('User not logged in');
    return axios.post(`${API_BASE_URL}/cartItems`, { ...data, user: userId });
  },
  
  // ==================== WISHLIST PAGE ====================
  getWishlistItems: async () => {
    const userId = api.getUserId();
    if (!userId) return { data: [] };
    const response = await axios.get(`${API_BASE_URL}/wishlistItems/user/${userId}`);
    return response;
  },
  addToWishlist: async (data) => {
    const userId = api.getUserId();
    if (!userId) throw new Error('User not logged in');
    return axios.post(`${API_BASE_URL}/wishlistItems`, { ...data, user: userId });
  },
  updateWishlistItem: (id, data) => axios.patch(`${API_BASE_URL}/wishlistItems/${id}`, data),
  deleteWishlistItem: (id) => axios.delete(`${API_BASE_URL}/wishlistItems/${id}`),
  
  // ==================== PRODUCT DETAILS ====================
  getProductDetails: (id) => axios.get(`${API_BASE_URL}/products/${id}`),
  
  // ==================== REVIEWS ====================
  addProductReview: async (reviewData) => {
    const product = await axios.get(`${API_BASE_URL}/products/${reviewData.productId}`);
    const existingReviews = product.data.reviews || [];
    const newReview = {
      id: existingReviews.length + 1,
      name: reviewData.name,
      rating: reviewData.rating,
      text: reviewData.comment,
      avatar: reviewData.avatar
    };
    const updatedReviews = [...existingReviews, newReview];
    const newRating = (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1);
    return axios.patch(`${API_BASE_URL}/products/${reviewData.productId}`, {
      reviews: updatedReviews,
      rating: parseFloat(newRating)
    });
  },
};

export default api;