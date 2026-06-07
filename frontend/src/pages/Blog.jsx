import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import api from '../api'

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// ✅ Helper to get image URL from upload object
const getImageUrl = (image) => {
  if (!image) return '/img/default-blog.jpg'
  if (typeof image === 'string') return image
  if (image.url) return image.url
  if (image.thumbnail?.url) return image.thumbnail.url
  return '/img/default-blog.jpg'
}

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [allBlogs, setAllBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await api.getBlogs();
        // ✅ Handle both { docs: [...] } and direct array
        let blogs = response.data;
        if (blogs && blogs.docs) {
          blogs = blogs.docs;
        }
        if (!Array.isArray(blogs)) {
          blogs = [];
        }
        
        // ✅ Filter out main blog (home page wala) from blog listing
        const filteredBlogs = blogs.filter(blog => blog.isMainBlog !== true);
        
        // ✅ Group by pageNumber
        const pages = {};
        filteredBlogs.forEach(blog => {
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
        
        const blogPagesArray = Object.keys(pages).map(page => ({
          page: parseInt(page),
          ...pages[page]
        }));
        
        setAllBlogs(blogPagesArray);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setAllBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBlogs();
  }, []);

  const currentBlogData = allBlogs.find(page => page.page === currentPage)

  if (loading) {
    return null;
  }

  const hasNoBlogs = allBlogs.length === 0 || !currentBlogData || 
    (currentBlogData.mainBlogs?.length === 0 && currentBlogData.smallBlogs?.length === 0);

  if (hasNoBlogs) {
    return (
      <>
        <HeroSection pageName="blog" />
        <section className="blog-content-section">
          <Container>
            <div className="text-center py-5" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <h3 style={{ color: '#FF7E00', marginBottom: '20px' }}>No Blogs Yet</h3>
              <p style={{ color: '#666', marginBottom: '30px' }}>Stay tuned for our latest fashion updates and news!</p>
              <a href="/" className="btn-read-more">Back to Home</a>
            </div>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <HeroSection pageName="blog" />

      <section className="blog-content-section">
        <Container>
          <div className="blog-page">
            <Row>
              <Col lg={6} className="mb-4">
                {currentBlogData.mainBlogs?.map(blog => (
                  <Link to={`/blog/${blog.id}`} className="blog-post-link" key={blog.id}>
                    <div className="blog-post-card">
                      <div 
                        className="blog-post-image" 
                        style={{ backgroundImage: `url(${getImageUrl(blog.image)})` }}
                        loading="lazy"
                      ></div>
                      <div className="blog-post-content">
                        <h3>{blog.title}</h3>
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
                ))}
              </Col>

              <Col lg={6} style={{ height: '100%' }}>
                {currentBlogData.smallBlogs?.map(blog => (
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
                ))}
              </Col>
            </Row>
          </div>

          {allBlogs.length > 1 && (
            <div className="blog-pagination">
              {allBlogs.map(page => (
                <div
                  key={page.page}
                  className={`page-number ${currentPage === page.page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page.page)}
                >
                  {page.page}
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}

export default Blog