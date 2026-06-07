import { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import api from '../api'

const TestimonialsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.getTestimonials()
        let testimonialsData = response.data || []
        
        // ✅ Ensure it's an array and handle image URLs
        if (testimonialsData && testimonialsData.docs) {
          testimonialsData = testimonialsData.docs
        }
        if (!Array.isArray(testimonialsData)) {
          testimonialsData = []
        }
        
        setTestimonials(testimonialsData)
      } catch (error) {
        console.error('Error fetching testimonials:', error)
        setTestimonials([])
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        nextSlide()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [testimonials.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  if (loading) {
    return null
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section className="testimonials-section">
      <Container>
        <h2>Our Testimonials.</h2>

        <div className="testimonial-slider">
          <button className="testimonial-arrow prev" onClick={prevSlide}>
            <FaChevronLeft />
          </button>

          <button className="testimonial-arrow next" onClick={nextSlide}>
            <FaChevronRight />
          </button>

          <div
            className="testimonial-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {testimonials.map(testimonial => (
              <div className="testimonial-slide" key={testimonial.id}>
                <div className="testimonial-card">
                  {/* ✅ FIXED: Handle image URL from object */}
                  <div
                    className="testimonial-avatar1"
                    style={{ 
                      backgroundImage: `url(${testimonial.image?.url || testimonial.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                    loading="lazy"
                  ></div>
                  <p className="fst-italic">{testimonial.text}</p>
                  <h5>{testimonial.name}</h5>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonial-nav">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`testimonial-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default TestimonialsSection