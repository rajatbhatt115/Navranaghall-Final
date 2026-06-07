import { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import HeroSection from '../components/HeroSection'
import api from '../api'
import { FaTrashAlt, FaShoppingCart, FaMinus, FaPlus, FaCheckCircle, FaTimesCircle, FaHeartBroken } from 'react-icons/fa'

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [wishlistRes, cartRes] = await Promise.all([
        api.getWishlistItems(),
        api.getCartItems()
      ])
      setWishlistItems(wishlistRes.data || [])
      setCartItems(cartRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (id, change) => {
    const item = wishlistItems.find(item => item.id === id)
    if (!item) return

    const newQuantity = Math.max(1, item.quantity + change)

    try {
      await api.updateWishlistItem(id, { quantity: newQuantity })
      setWishlistItems(prevItems =>
        prevItems.map(item =>
          item.id === id
            ? { ...item, quantity: newQuantity }
            : item
        )
      )
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const calculatePrice = (item) => {
    return item.unitPrice * item.quantity
  }

  const openDeleteModal = (id) => {
    setItemToDelete(id)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setItemToDelete(null)
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await api.deleteWishlistItem(itemToDelete)
        setWishlistItems(prevItems => prevItems.filter(item => item.id !== itemToDelete))
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    }
    closeDeleteModal()
  }

  // ✅ Check if item is in cart
  const isInCart = (item) => {
    return cartItems.some(cartItem =>
      cartItem.productId === item.productId ||
      cartItem.name === item.name
    )
  }

  // ✅ Add to cart function
  const addToCart = async (item) => {
    if (!item.inStock) return

    const token = localStorage.getItem('token')
    if (!token || token === 'undefined' || token === 'null') {
      alert('Please login first to add items to cart!')
      return
    }

    try {
      const isAlreadyInCart = cartItems.some(cartItem =>
        cartItem.productId === item.productId ||
        cartItem.name === item.name
      )

      if (!isAlreadyInCart) {
        const cartItemData = {
          productId: item.productId,
          name: item.name,
          image: item.image,
          color: item.color,
          size: item.size,
          price: item.unitPrice,
          quantity: item.quantity,
          inStock: item.inStock
        }

        const response = await api.addToCart(cartItemData)
        setCartItems(prev => [...prev, response.data])
        alert(`✓ "${item.name}" has been added to your cart!`)

        window.dispatchEvent(new CustomEvent('cartUpdated'))
      } else {
        alert(`"${item.name}" is already in your cart!`)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert(`Failed to add "${item.name}" to cart. Please try again.`)
    }
  }

  // ✅ Remove from cart function
  const removeFromCart = async (item) => {
    try {
      const cartItem = cartItems.find(cartItem =>
        cartItem.productId === item.productId ||
        cartItem.name === item.name
      )

      if (cartItem) {
        await api.deleteCartItem(cartItem.id)
        setCartItems(prev => prev.filter(i => i.id !== cartItem.id))
        alert(`✓ "${item.name}" has been removed from your cart!`)

        window.dispatchEvent(new CustomEvent('cartUpdated'))
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      alert(`Failed to remove "${item.name}" from cart. Please try again.`)
    }
  }

  // ✅ Toggle cart action
  const toggleCart = async (item) => {
    if (!item.inStock) {
      alert(`${item.name} is out of stock!`)
      return
    }

    if (isInCart(item)) {
      await removeFromCart(item)
    } else {
      await addToCart(item)
    }
  }

  useEffect(() => {
    const wishlistLinks = document.querySelectorAll('a[href*="wishlist"], a[href="/wishlist"]');

    wishlistLinks.forEach(link => {
      link.style.color = '#FF7E00';

      const icon = link.querySelector('i, svg, .heart-icon');
      if (icon) {
        icon.style.color = '#FF7E00';
      }

      const heartIcon = link.querySelector('.heart-icon');
      if (heartIcon) {
        heartIcon.style.color = '#FF7E00';
      }
    });

    return () => {
      wishlistLinks.forEach(link => {
        link.style.color = '';
        const icon = link.querySelector('i, svg, .heart-icon');
        if (icon) {
          icon.style.color = '';
        }

        const heartIcon = link.querySelector('.heart-icon');
        if (heartIcon) {
          heartIcon.style.color = '';
        }
      });
    };
  }, []);

  if (loading) {
    return null
  }

  return (
    <>
      <HeroSection pageName="wishlist" />

      <section className="wishlist-section">
        <Container>
          {wishlistItems.length === 0 ? (
            <div className="empty-wishlist show" id="emptyWishlist">
              <FaHeartBroken size={80} style={{ color: '#FF7E00', marginBottom: '20px' }} />
              <h3>Your Wishlist is Empty</h3>
              <p>Looks like you haven't added any items to your wishlist yet.</p>
              <a href="/shop" className="btn-shop-now">Start Shopping</a>
            </div>
          ) : (
            <div id="wishlistContainer">
              {wishlistItems.map(item => {
                const itemInCart = isInCart(item)

                return (
                  <div className="wishlist-item d-flex" key={item.id}>
                    <div className="wishlist-image">
                      <img src={item.image} alt={item.name} loading="lazy" />
                    </div>
                    <div className="wishlist-details">
                      <h5>{item.name}</h5>
                      <div className="detail-row">
                        <span className="detail-label">Color :</span>
                        <span className="detail-value">{item.color}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Size :</span>
                        <span className="detail-value">{item.size}</span>
                      </div>
                      <div className="stock-status">
                        <span className={`status-badge ${item.inStock ? 'in-stock' : 'sold-out'}`}>
                          {item.inStock ? <FaCheckCircle /> : <FaTimesCircle />}
                          {item.inStock ? 'In Stock' : 'Sold Out'}
                        </span>
                      </div>
                    </div>
                    <div className="wishlist-actions">
                      <div className="action-buttons">
                        <button
                          className="action-btn delete-btn"
                          onClick={() => openDeleteModal(item.id)}
                          title="Delete item from wishlist"
                        >
                          <FaTrashAlt />
                        </button>
                        <button
                          className="action-btn cart-btn"
                          onClick={() => toggleCart(item)}
                          title={itemInCart ? "Remove from cart" : "Add to cart"}
                          disabled={!item.inStock}
                          style={{
                            opacity: !item.inStock ? 0.5 : 1,
                            cursor: !item.inStock ? 'not-allowed' : 'pointer',

                            // ✅ Added styles
                            backgroundColor: itemInCart ? '#FF7E00' : '#fff',
                            color: itemInCart ? '#fff' : '#000',
                            border: '1px solid #ddd',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <FaShoppingCart />
                        </button>
                      </div>
                      <div className="quantity-section">
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={!item.inStock}
                          style={!item.inStock ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >
                          <FaMinus />
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={!item.inStock}
                          style={!item.inStock ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <div className="price-tag" data-unit-price={item.unitPrice}>
                        ₹ {calculatePrice(item)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Container>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="confirmation-modal show" id="deleteConfirmationModal">
          <div className="modal-content-custom">
            <FaTrashAlt size={60} style={{ color: '#FF7E00', marginBottom: '20px' }} />
            <h4>Delete Item?</h4>
            <p>Are you sure you want to delete this item from your wishlist? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button className="modal-btn cancel" onClick={closeDeleteModal}>Cancel</button>
              <button className="modal-btn confirm" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Wishlist