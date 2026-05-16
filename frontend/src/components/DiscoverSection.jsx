import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import api from '../api';

const DiscoverSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.getDiscoverProducts();
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching discover products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="discover-section">
        <Container>
          <h2><span>Discover more.</span> <strong>Good things are waiting for you</strong></h2>
          <div className="text-center py-5">Loading...</div>
        </Container>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="discover-section">
        <Container>
          <h2><span>Discover more.</span> <strong>Good things are waiting for you</strong></h2>
          <div className="text-center py-5">
            <p>No products found.</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="discover-section">
      <Container>
        <h2><span>Discover more.</span> <strong>Good things are waiting for you</strong></h2>
        <Row>
          {products.map((product) => (
            <Col md={3} key={product.id}>
              <div className="product-card" style={{ backgroundColor: product.bgColor, cursor: 'default' }}>
                <span className="badge-new">{product.badge}</span>
                <div 
                  className="product-image1" 
                  style={{ backgroundImage: `url(${product.image})` }}
                  loading="lazy"
                ></div>
                <h5 className="mt-3">{product.title}</h5>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default DiscoverSection;