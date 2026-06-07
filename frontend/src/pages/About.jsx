import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import api from '../api';
import { FaChevronLeft, FaChevronRight, FaBullseye, FaTrophy } from 'react-icons/fa';

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [aboutData, setAboutData] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutResponse, teamResponse] = await Promise.all([
          api.getAboutContent(),
          api.getTeam()
        ]);
        setAboutData(aboutResponse.data);
        setTeam(teamResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const nextSlide = () => {
    if (aboutData?.timeline && aboutData.timeline.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % aboutData.timeline.length);
    }
  };

  const prevSlide = () => {
    if (aboutData?.timeline && aboutData.timeline.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + aboutData.timeline.length) % aboutData.timeline.length);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading About Page...</div>;
  }

  if (!aboutData) {
    return (
      <>
        <HeroSection pageName="about" />
        <div className="text-center py-5">
          <h3>No Content Found</h3>
          <p>Please add about content in the CMS admin panel.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <HeroSection pageName="about" />

      {/* 15+ Years Experience Section */}
      <section className="experience-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="experience-image-container">
                <img src="img/img_exp.webp" alt="Experience" className="experience-image" loading="lazy" />
              </div>
            </Col>

            <Col lg={6}>
              <div className="experience-content">
                <h2 className="experience-title">{aboutData.experienceTitle}</h2>

                {aboutData.experienceTexts && aboutData.experienceTexts.length > 0 ? (
                  aboutData.experienceTexts.map((text, index) => (
                    <p key={index} className="experience-text">{typeof text === 'string' ? text : text.text}</p>
                  ))
                ) : (
                  <p className="experience-text">Experience details coming soon...</p>
                )}

                {/* ✅ FIXED: Founder image URL handling */}
                {aboutData.founder && (
                  <div className="founder-profile">
                    <img 
                      src={aboutData.founder.image?.url || aboutData.founder.image} 
                      alt="Founder" 
                      loading="lazy" 
                    />
                    <div className="founder-info">
                      <h6>{aboutData.founder.name}</h6>
                      <p>{aboutData.founder.role}</p>
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Awards Section */}
      <section className="mission-awards-section">
        <Container>
          <Row>
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="info-card">
                <div className="info-card-icon">
                  <FaBullseye />
                </div>
                <h4>{aboutData.mission?.title || 'Our Mission'}</h4>
                <p>{aboutData.mission?.description || 'Coming soon...'}</p>
              </div>
            </Col>

            <Col lg={6}>
              <div className="info-card">
                <div className="info-card-icon">
                  <FaTrophy />
                </div>
                <h4>{aboutData.awards?.title || 'Our Awards'}</h4>
                <p>{aboutData.awards?.description || 'Coming soon...'}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Our History Section */}
      <section className="history-section">
        <Container>
          <h2 className="section-title">{aboutData.historyTitle}</h2>
          <p className="section-subtitle">{aboutData.historySubtitle}</p>

          <div className="timeline-container">
            <div
              className="timeline-slider"
              id="timelineSlider"
              style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
            >
              {aboutData.timeline && aboutData.timeline.length > 0 ? (
                aboutData.timeline.map((item, index) => (
                  <div className="timeline-slide" key={item.id || index}>
                    <div className="timeline-year">{item.year}</div>
                    <p className="timeline-text">{item.text}</p>
                    <div className="timeline-year-display">{item.year}</div>
                  </div>
                ))
              ) : (
                <div className="timeline-slide">
                  <div className="timeline-year">Coming Soon</div>
                  <p className="timeline-text">History timeline will be added soon.</p>
                  <div className="timeline-year-display">---</div>
                </div>
              )}
            </div>
          </div>

          <div className="timeline-nav">
            <button className="timeline-nav-btn" onClick={prevSlide}>
              <FaChevronLeft />
            </button>

            <div className="timeline-dots">
              {aboutData.timeline && aboutData.timeline.length > 0 && [...Array(Math.min(3, Math.ceil(aboutData.timeline.length / 3)))].map((_, index) => (
                <div
                  key={index}
                  className={`timeline-dot ${Math.floor(currentSlide / 3) === index ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index * 3)}
                ></div>
              ))}
            </div>

            <button className="timeline-nav-btn" onClick={nextSlide}>
              <FaChevronRight />
            </button>
          </div>
        </Container>
      </section>

      {/* Our Team Section */}
      <section className="team-section">
        <Container>
          <h2 className="section-title">Our Team.</h2>

          <Row className="mt-5">
            {team.length > 0 ? (
              team.map((member, index) => (
                <Col lg={4} md={6} className="mb-4" key={member.id}>
                  <div className="team-card">
                    <img 
                      src={member.image?.url || member.image} 
                      alt={member.name} 
                      className={`team-image${index + 1}`} 
                      loading="lazy" 
                    />
                    <div className="team-info">
                      <h5>{member.name}</h5>
                      <p>{member.role}</p>
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              <Col className="text-center">
                <p>Team members will be added soon...</p>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default About;