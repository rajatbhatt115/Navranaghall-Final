import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import api from '../api'
import LoginRequiredModal from './LoginRequiredModal'

const RatingSection = () => {
  const [activeCategory, setActiveCategory] = useState('kids')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [activeCategory])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await api.getTopRatingProducts(activeCategory)
      let productsData = response.data || []
      
      // ✅ Transform products to handle image URLs
      productsData = productsData.map(product => {
        // Handle products array inside each category document
        if (product.products && Array.isArray(product.products)) {
          return product.products.map(p => ({
            ...p,
            imageUrl: p.image?.url || p.image,
            price: p.price,
            rating: p.rating,
            title: p.title,
            id: p.id
          }))
        }
        return product
      }).flat() // Flatten the array
        
      setProducts(productsData)
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleBuyNow = (product) => {
    if (!api.isAuthenticated()) {
      setSelectedProduct(product)
      setShowLoginModal(true)
      return
    }
    
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh the page.")
      return
    }

    const totalPrice = parseInt(product.price.replace('₹', '').replace(',', '')) || 1000

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: totalPrice * 100,
      currency: "INR",
      name: "Navrang Hall",
      description: `Product: ${product.title}`,
      image: "/img/logo.png",
      handler: function (response) {
        console.log("Payment Successful:", response)
        alert(`Payment Successful! Order ID: ${response.razorpay_payment_id}`)
      },
      prefill: { name: "Test Customer", email: "test@example.com", contact: "9999999999" },
      notes: { product: product.title, category: activeCategory, amount: totalPrice },
      theme: { color: "#FF7E00" },
    }

    try {
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error("Error initializing Razorpay:", error)
      alert("Error initializing payment. Please try again.")
    }
  }

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  if (loading) {
    return (
      <section className="rating-section">
        <Container>
          <h2>Top Rating Cloths.</h2>
          <div className="text-center py-5">Loading...</div>
        </Container>
      </section>
    )
  }

  const categories = [
    { id: 'kids', name: 'Kids' },
    { id: 'women', name: 'Women' },
    { id: 'jewellery', name: 'Jewellery' }
  ]

  return (
    <>
      <LoginRequiredModal 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)} 
        message="Please login to make a purchase!"
      />
      
      <section className="rating-section">
        <Container>
          <h2>Top Rating Cloths.</h2>
          
          <div className="rating-tabs">
            {categories.map(category => (
              <div key={category.id} className={`rating-tab ${activeCategory === category.id ? 'active' : ''}`} onClick={() => setActiveCategory(category.id)}>
                {category.name}
              </div>
            ))}
          </div>

          {products.length > 0 ? (
            <Row className="product-category active">
              {products.map(product => (
                <Col md={4} key={product.id}>
                  <div className="rating-card">
                    {/* ✅ Fixed: Use imageUrl instead of image */}
                    <div className="rating-image" style={{ backgroundImage: `url(${product.imageUrl})` }}></div>
                    <div className="rating-top-row">
                      <div className="left-group">
                        <h5 className="item-title">{product.title}</h5>
                        <div className="stars">{renderStars(product.rating)}</div>
                      </div>
                      <div className="price">{product.price}</div>
                    </div>
                    <div className="rating-action-buttons" style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                      <button className="btn-buy-now" style={{ width: '100%', background: '#FF7E00', color: 'white', padding: '10px 20px', borderRadius: '25px', border: 'none', fontWeight: '600', cursor: 'pointer' }} onClick={() => handleBuyNow(product)}>
                        Buy Now
                      </button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-4">
              <p>No products found for this category.</p>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}

export default RatingSection