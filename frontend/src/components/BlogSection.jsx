import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../api'

// Helper function to format date - remove time
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Helper to get image URL from upload object
const getImageUrl = (image) => {
  if (!image) return '/img/default-blog.jpg'
  if (typeof image === 'string') return image
  if (image.url) return image.url
  if (image.thumbnail?.url) return image.thumbnail.url
  return '/img/default-blog.jpg'
}

const BlogSection = () => {
  const [blogData, setBlogData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await api.getBlogHome();
        console.log('Blog Home Response:', response.data);
        setBlogData(response.data);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  if (loading) {
    return null;
  }

  if (!blogData || !blogData.mainBlog) {
    return null;
  }

  const { mainBlog, smallBlogs = [] } = blogData;

  if (!mainBlog || !mainBlog.id) {
    return null;
  }

  return (
    <section className="blog-section">
      <Container>
        <h2><span>The latest news.</span> <strong>From Our Blog</strong></h2>
        
        <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '25px' }}>
          <Col lg={6}>
            <Link to={`/blog/${mainBlog.id}`} className="blog-post-link">
              <div className="blog-post-card">
                <div 
                  className="blog-post-image" 
                  style={{ backgroundImage: `url(${getImageUrl(mainBlog.image)})` }}
                  loading="lazy"
                ></div>
                <div className="blog-post-content">
                  <h3>{mainBlog.title}</h3>
                  <div className="blog-post-meta">
                    <div 
                      className="author-avatar" 
                      style={{ backgroundImage: `url(${getImageUrl(mainBlog.authorImage)})` }}
                      loading="lazy"
                    ></div>
                    <div className="author-info">
                      <span className="author-name">{mainBlog.author}</span>
                      <span className="post-date">{formatDate(mainBlog.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </Col>

          <Col lg={6} style={{ height: '100%' }}>
            {smallBlogs && smallBlogs.length > 0 ? smallBlogs.map(blog => (
              <Link to={`/blog/${blog.id}`} className="small-blog-link" key={blog.id}>
                <div className="small-blog-card">
                  <div 
                    className="small-blog-image" 
                    style={{ backgroundImage: `url(${getImageUrl(blog.image)})` }}
                    loading="lazy"
                  ></div>
                  <div className="small-blog-content">
                    <h4>{blog.title}</h4>
                    <p>{blog.excerpt}</p>
                    <div className="blog-post-meta">
                      <div 
                        className="author-avatar" 
                        style={{ backgroundImage: `url(${getImageUrl(blog.authorImage)})` }}
                        loading="lazy"
                      ></div>
                      <div className="author-info">
                        <span className="author-name">{blog.author}</span>
                        <span className="post-date">{formatDate(blog.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )) : null}
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default BlogSection