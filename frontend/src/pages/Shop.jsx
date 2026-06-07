import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { FaRupeeSign, FaThLarge, FaRuler, FaSort, FaHeart, FaShoppingCart, FaStar, FaStarHalfAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import api from '../api';

const Shop = () => {
  const [filters, setFilters] = useState({
    price: [],
    category: [],
    size: [],
    sort: 'popularity'
  });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMenu, setShowMenu] = useState('');
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch products
        const productsResponse = await api.getProducts();
        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data);
        
        // Fetch wishlist items only if logged in
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const wishlistResponse = await api.getWishlistItems();
            setWishlistItems(wishlistResponse.data);
          } catch (err) {
            console.log('Wishlist fetch skipped - login required');
          }
          
          try {
            const cartResponse = await api.getCartItems();
            setCartItems(cartResponse.data);
          } catch (err) {
            console.log('Cart fetch skipped - login required');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [filters, products]);

  const toggleMenu = (menu) => {
    setShowMenu(showMenu === menu ? '' : menu);
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      const newFilters = { ...prev }
      if (type === 'sort') {
        newFilters[type] = value
      } else {
        if (newFilters[type].includes(value)) {
          newFilters[type] = newFilters[type].filter(item => item !== value)
        } else {
          newFilters[type] = [...newFilters[type], value]
        }
      }
      return newFilters
    })
    setCurrentPage(1)
    setShowMenu('')
  };

  const filterProducts = () => {
    let filtered = [...products]

    // Price filter
    if (filters.price.length > 0) {
      filtered = filtered.filter(product => {
        return filters.price.some(filter => {
          switch(filter) {
            case 'under-1000': return product.price < 1000
            case '1000-2000': return product.price >= 1000 && product.price <= 2000
            case '2000-3000': return product.price >= 2000 && product.price <= 3000
            case 'above-3000': return product.price > 3000
            default: return true
          }
        })
      })
    }

    // Category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(product => 
        filters.category.includes(product.category)
      )
    }

    // Size filter - FIXED
    if (filters.size.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.sizes || product.sizes.length === 0) return false;
        const productSizes = product.sizes.map(s => typeof s === 'object' ? s.size : s);
        return productSizes.some(size => filters.size.includes(size));
      })
    }

    // Sort products
    filtered.sort((a, b) => {
      switch(filters.sort) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'newest':
          return b.isNew - a.isNew
        case 'popularity':
        default:
          return b.rating - a.rating
      }
    })

    setFilteredProducts(filtered)
  };

  const clearAllFilters = () => {
    setFilters({
      price: [],
      category: [],
      size: [],
      sort: 'popularity'
    })
    setCurrentPage(1)
  };

  const removeFilter = (type, value) => {
    handleFilterChange(type, value)
  };

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} />)
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} />)
      } else {
        stars.push(<FaStar key={i} style={{ color: '#ddd' }} />)
      }
    }
    return stars
  };

  const getRandomColor = () => {
    const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Orange', 'Pink', 'Purple', 'Yellow'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Get size string from size object
  const getSizeString = (size) => {
    return typeof size === 'object' ? size.size : size;
  };

  const addToWishlist = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
      alert('Please login first to add items to wishlist!');
      return;
    }
    
    try {
      const isAlreadyInWishlist = wishlistItems.some(item => item.name === product.title);
      
      if (!isAlreadyInWishlist) {
        const firstSize = product.sizes && product.sizes.length > 0 ? getSizeString(product.sizes[0]) : 'M';
        
        const wishlistItem = {
          productId: product.id,
          name: product.title,
          image: typeof product.image === 'object' ? product.image.url : product.image,
          color: getRandomColor(),
          size: firstSize,
          unitPrice: product.price,
          price: product.price,
          quantity: 1,
          inStock: true
        };
        
        const response = await api.addToWishlist(wishlistItem);
        setWishlistItems(prev => [...prev, response.data]);
        alert(`✓ "${product.title}" has been added to your wishlist!`);
      } else {
        alert(`"${product.title}" is already in your wishlist!`);
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert(`Failed to add "${product.title}" to wishlist. Please try again.`);
    }
  };

  const removeFromWishlist = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const wishlistItem = wishlistItems.find(item => item.name === product.title);
      if (wishlistItem) {
        await api.deleteWishlistItem(wishlistItem.id);
        setWishlistItems(prev => prev.filter(item => item.id !== wishlistItem.id));
        alert(`✓ "${product.title}" has been removed from your wishlist!`);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert(`Failed to remove "${product.title}" from wishlist. Please try again.`);
    }
  };

  const addToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
      alert('Please login first to add items to cart!');
      return;
    }
    
    
    
    try {
      const isAlreadyInCart = cartItems.some(item => item.name === product.title);
      
      if (!isAlreadyInCart) {
        const firstSize = product.sizes && product.sizes.length > 0 ? getSizeString(product.sizes[0]) : 'M';
        
        const cartItem = {
          productId: product.id,
          name: product.title,
          image: typeof product.image === 'object' ? product.image.url : product.image,
          color: getRandomColor(),
          size: firstSize,
          price: product.price,
          quantity: 1,
          inStock: true,
        };
        
        const response = await api.addToCart(cartItem);
        setCartItems(prev => [...prev, response.data]);
        alert(`✓ "${product.title}" has been added to your cart!`);
      } else {
        alert(`"${product.title}" is already in your cart!`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(`Failed to add "${product.title}" to cart. Please try again.`);
    }
  };

  const removeFromCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const cartItem = cartItems.find(item => item.name === product.title);
      if (cartItem) {
        await api.deleteCartItem(cartItem.id);
        setCartItems(prev => prev.filter(item => item.id !== cartItem.id));
        alert(`✓ "${product.title}" has been removed from your cart!`);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert(`Failed to remove "${product.title}" from cart. Please try again.`);
    }
  };

  const isInWishlist = (product) => {
    return wishlistItems.some(item => item.name === product.title);
  };

  const isInCart = (product) => {
    return cartItems.some(item => item.name === product.title);
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  if (loading) {
    return null;
  }

  return (
    <>
      <HeroSection pageName="shop" isShopPage={true} />

      <section className="filter-section">
        <Container>
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Browse and filter our exclusive collection</p>
          
          <div className="filter-container">
            <div className="filter-dropdown price-filter">
              <button className="filter-btn" onClick={() => toggleMenu('price')}>
                <span><FaRupeeSign /> Price</span>
                {showMenu === 'price' ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {showMenu === 'price' && (
                <div className="filter-menu show">
                  {['under-1000', '1000-2000', '2000-3000', 'above-3000'].map(option => (
                    <div className="filter-option" key={option}>
                      <input type="checkbox" id={option} checked={filters.price.includes(option)} onChange={() => handleFilterChange('price', option)} />
                      <label htmlFor={option}>
                        {option === 'under-1000' ? 'Under ₹1000' :
                         option === '1000-2000' ? '₹1000 - ₹2000' :
                         option === '2000-3000' ? '₹2000 - ₹3000' : 'Above ₹3000'}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-dropdown">
              <button className="filter-btn" onClick={() => toggleMenu('category')}>
                <span><FaThLarge /> Categories</span>
                {showMenu === 'category' ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {showMenu === 'category' && (
                <div className="filter-menu show">
                  {['Female', 'Kids', 'Male', 'Jewellery'].map(category => (
                    <div className="filter-option" key={category}>
                      <input type="checkbox" id={`cat-${category}`} checked={filters.category.includes(category)} onChange={() => handleFilterChange('category', category)} />
                      <label htmlFor={`cat-${category}`}>{category}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-dropdown">
              <button className="filter-btn" onClick={() => toggleMenu('size')}>
                <span><FaRuler /> Sizes</span>
                {showMenu === 'size' ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {showMenu === 'size' && (
                <div className="filter-menu show">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <div className="filter-option" key={size}>
                      <input type="checkbox" id={`size-${size}`} checked={filters.size.includes(size)} onChange={() => handleFilterChange('size', size)} />
                      <label htmlFor={`size-${size}`}>{size}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-dropdown">
              <button className="filter-btn" onClick={() => toggleMenu('sort')}>
                <span><FaSort /> Sort Order</span>
                {showMenu === 'sort' ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {showMenu === 'sort' && (
                <div className="filter-menu show">
                  {[
                    { value: 'popularity', label: 'Popularity' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                    { value: 'newest', label: 'Newest First' }
                  ].map(sortOption => (
                    <div className="filter-option" key={sortOption.value}>
                      <input type="radio" name="sort" id={`sort-${sortOption.value}`} checked={filters.sort === sortOption.value} onChange={() => handleFilterChange('sort', sortOption.value)} />
                      <label htmlFor={`sort-${sortOption.value}`}>{sortOption.label}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {(filters.price.length > 0 || filters.category.length > 0 || filters.size.length > 0) && (
            <div className="filter-status active" id="filterStatus">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted">Active Filters:</small>
                <button className="btn btn-sm btn-link text-danger p-0" onClick={clearAllFilters}>Clear All</button>
              </div>
              <div className="active-filters" id="activeFilters">
                {filters.price.map(filter => (
                  <div className="active-filter" key={`price-${filter}`}>
                    {filter === 'under-1000' ? 'Under ₹1000' : filter === '1000-2000' ? '₹1000 - ₹2000' : filter === '2000-3000' ? '₹2000 - ₹3000' : 'Above ₹3000'}
                    <span className="remove-filter" onClick={() => removeFilter('price', filter)}>&times;</span>
                  </div>
                ))}
                {filters.category.map(category => (
                  <div className="active-filter" key={`category-${category}`}>
                    {category}
                    <span className="remove-filter" onClick={() => removeFilter('category', category)}>&times;</span>
                  </div>
                ))}
                {filters.size.map(size => (
                  <div className="active-filter" key={`size-${size}`}>
                    {size}
                    <span className="remove-filter" onClick={() => removeFilter('size', size)}>&times;</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      <section className="products-section">
        <Container>
          {currentProducts.length > 0 ? (
            <>
              <Row id="productsContainer">
                {currentProducts.map(product => {
                  const inWishlist = isInWishlist(product);
                  const inCart = isInCart(product);
                  
                  const imageUrl = typeof product.image === 'object' ? product.image.url : product.image;
                  
                  return (
                    <Col lg={4} md={6} key={product.id}>
                      <Link to={`/product/${product.id}`} className="product-link">
                        <div className="product-card">
                          <div className="product-image" style={{ backgroundImage: `url(${imageUrl})` }} loading="lazy">
                            {product.isNew && <div className="badge-new">NEW</div>}
                            <div className="product-actions">
                              <button className="action-btn-shop" onClick={(e) => {
                                if (inWishlist) removeFromWishlist(product, e);
                                else addToWishlist(product, e);
                              }} style={{ color: inWishlist ? '#FF7E00' : 'inherit' }} title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                                <FaHeart />
                              </button>
                              <button className="action-btn-shop" onClick={(e) => {
                                if (inCart) removeFromCart(product, e);
                                else addToCart(product, e);
                              }} style={{ color: inCart ? '#FF7E00' : 'inherit' }} title={inCart ? 'Remove from Cart' : 'Add to Cart'}>
                                <FaShoppingCart />
                              </button>
                            </div>
                          </div>
                          <div className="product-info">
                            <h3 className="product-title">{product.title}</h3>
                            <div className="size-options">
                              {product.sizes && product.sizes.map((size, idx) => (
                                <span className="size-option" key={idx}>{typeof size === 'object' ? size.size : size}</span>
                              ))}
                            </div>
                            <div className="product-footer">
                              <div className="product-price">
                                <span className="price-tag">₹ {product.price}</span>
                              </div>
                              <div className="product-rating" style={{marginBottom: '5px'}}>
                                <span className="rating-value" style={{marginTop: '5px'}}>{product.rating}</span>
                                <div className="stars">{renderStars(product.rating)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Col>
                  );
                })}
              </Row>
              
              {totalPages > 1 && (
                <div className="products-pagination" id="productsPagination">
                  {[...Array(totalPages)].map((_, index) => (
                    <div key={index} className={`page-number ${currentPage === index + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(index + 1)}>
                      {index + 1}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="no-results show" id="noResults">
              <i className="fas fa-search fa-3x text-muted mb-3"></i>
              <h4>No products found</h4>
              <p className="text-muted">Try adjusting your filters to find what you're looking for.</p>
              <button className="btn-read-more mt-3" onClick={clearAllFilters}>Clear All Filters</button>
            </div>
          )}
        </Container>
      </section>
    </>
  );
};

export default Shop;