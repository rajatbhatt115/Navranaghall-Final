import { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import HeroSection from '../components/HeroSection'
import api from '../api'
import { useParams } from 'react-router-dom'

// Helper function to format date
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

const InnerBlog = () => {
  const { id } = useParams()
  const [blogData, setBlogData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    contact: '',
    message: ''
  })
  const [comments, setComments] = useState([])

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true)
        const response = await api.getBlogById(id)
        if (response.data) {
          setBlogData(response.data)
          setComments(response.data.comments || [])
        } else {
          setBlogData(null)
        }
      } catch (error) {
        console.error('Error fetching blog data:', error)
        setBlogData(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBlogData()
    }
  }, [id])

  const handleCommentChange = (e) => {
    setCommentForm({
      ...commentForm,
      [e.target.name]: e.target.value
    })
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()

    // ✅ Check if user is logged in first
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
      alert('Please login first to post a comment!');
      return;
    }

    // ✅ Validation
    if (!commentForm.name || !commentForm.email || !commentForm.contact || !commentForm.message) {
      alert('Please fill in all fields!')
      return
    }

    try {
      const newCommentData = {
        name: commentForm.name,
        email: commentForm.email,
        contact: commentForm.contact,
        text: commentForm.message,
      }

      const response = await api.addBlogComment(id, newCommentData);

      if (response.data) {
        setComments([response.data, ...comments]);
        alert('Your comment has been posted successfully!');
        setCommentForm({
          name: '',
          email: '',
          contact: '',
          message: ''
        });
      } else {
        alert('Failed to post comment. Please try again.');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    }
  };

  if (loading) {
    return null
  }

  if (!blogData) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '50px',
        color: '#FF7E00',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h3>Blog Post Not Found</h3>
        <p>The blog post you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <>
      <HeroSection pageName="blog" />

      <section className="blog-content-section">
        <Container>
          <Row>
            <Col xs={12}>
              <div
                className="blog-post-image"
                style={{
                  backgroundImage: `url(${getImageUrl(blogData.image)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '400px',
                  borderRadius: '15px',
                  marginBottom: '30px'
                }}
                loading="lazy"
              ></div>

              <div className="blog-post-content">
                <h3>{blogData.title}</h3>
                <p>{blogData.content}</p>

                <div className="blog-post-meta">
                  <div
                    className="author-avatar"
                    style={{
                      backgroundImage: `url(${getImageUrl(blogData.authorImage)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%'
                    }}
                    loading="lazy"
                  ></div>
                  <div className="author-info">
                    <div className="author-name">{blogData.author}</div>
                    <div className="post-date">{formatDate(blogData.date)}</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="comment-section">
        <Container>
          <Row>
            <Col lg={6} className="mb-4 mb-lg-0 comment-column">
              <h3 className="section-title">Leave A Comment</h3>
              <div className="comment-form-container">
                <div className="comment-form">
                  <Form id="commentForm" onSubmit={handleCommentSubmit}>

                    {/* ✅ Name Field */}
                    <div className="mb-3">
                      <Form.Control
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Full Name *"
                        value={commentForm.name}
                        onChange={handleCommentChange}
                        required
                        style={{ padding: '12px 15px', borderRadius: '8px' }}
                      />
                    </div>

                    {/* ✅ Email Field - Visible in form */}
                    <div className="mb-3">
                      <Form.Control
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email Address *"
                        value={commentForm.email}
                        onChange={handleCommentChange}
                        required
                        style={{ padding: '12px 15px', borderRadius: '8px' }}
                      />
                    </div>

                    {/* ✅ Contact Number Field - Visible in form */}
                    <div className="mb-3">
                      <Form.Control
                        type="tel"
                        id="contact"
                        name="contact"
                        placeholder="Contact Number *"
                        value={commentForm.contact}
                        onChange={handleCommentChange}
                        required
                        style={{ padding: '12px 15px', borderRadius: '8px' }}
                      />
                    </div>

                    {/* ✅ Message Field */}
                    <div className="mb-4">
                      <Form.Control
                        as="textarea"
                        style={{ height: '150px', padding: '12px 15px', borderRadius: '8px' }}
                        id="message"
                        name="message"
                        placeholder="Your Comment *"
                        rows={4}
                        value={commentForm.message}
                        onChange={handleCommentChange}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="btn-post-comment w-100"
                      style={{ backgroundColor: '#ff7e00', borderColor: '#ff7e00', padding: '12px', borderRadius: '8px', fontWeight: '600' }}
                    >
                      Post Comment
                    </Button>
                  </Form>
                </div>
              </div>
            </Col>

            <Col lg={6} className="comment-column">
              <h3 className="section-title">Comments</h3>
              <div className="comments-container">
                <div className="comments-list-wrapper">
                  <div className="comments-list" id="commentsList">
                    {comments.map(comment => (
                      <div className="comment-item" key={comment.id} style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '10px' }}>
                        {/* ✅ Sirf Name left, Date right - Email aur Phone nahi dikhenge */}
                        <div className="comment-header" style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '10px'
                        }}>
                          <h5 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#333' }}>{comment.name}</h5>
                          <span style={{ fontSize: '11px', color: '#999' }}>{formatDate(comment.date)}</span>
                        </div>
                        {/* ✅ Sirf Comment text */}
                        <p className="comment-text" style={{ color: '#666', lineHeight: '1.5', fontSize: '14px', marginLeft: '0px', marginBottom: '0px' }}>{comment.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-center">
                    <small className="text-muted">Scroll to see more comments</small>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default InnerBlog