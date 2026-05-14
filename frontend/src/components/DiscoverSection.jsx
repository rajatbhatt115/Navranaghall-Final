import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api';

const DiscoverSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.getDiscoverProducts();
        console.log('===== DISCOVER PRODUCTS DEBUG =====');
        console.log('Full response:', response);
        console.log('response.data:', response.data);
        console.log('Is array?', Array.isArray(response.data));
        console.log('Length:', response.data?.length);
        console.log('===================================');
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
          <div>Loading...</div>
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
            <p>No products found. Products count: {products.length}</p>
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