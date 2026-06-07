import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap'
import {
  FaShoppingBag,
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaShippingFast,
  FaPhoneAlt,
  FaEnvelope,
  FaSignOutAlt,
  FaChevronDown
} from 'react-icons/fa'
import { useState, useEffect } from 'react'

const NavigationBar = () => {
  const [expanded, setExpanded] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    checkLoginStatus()
    window.addEventListener('storage', checkLoginStatus)
    return () => window.removeEventListener('storage', checkLoginStatus)
  }, [])

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('payload-token')
    const user = localStorage.getItem('user')
    if (token && user) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('payload-token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    navigate('/')
    window.location.reload()
  }

  const handleNavClick = () => {
    if (window.innerWidth <= 991.98) setExpanded(false)
  }

  return (
    <>
      <div className="top-bar">
        <Container>
          <div className="row align-items-center ps-2 pe-3">
            <div className="col-md-4 top-bar-item d-flex align-items-center">
              <div className="top-bar-icon"><FaShippingFast /></div>
              <div className="top-bar-text">Free Shipping</div>
            </div>
            <div className="col-md-4 top-bar-item d-flex align-items-center justify-content-center">
              <div className="top-bar-icon"><FaPhoneAlt /></div>
              <div className="top-bar-text">+123 456 789</div>
            </div>
            <div className="col-md-4 top-bar-item d-flex align-items-center justify-content-end">
              <div className="top-bar-icon"><FaEnvelope /></div>
              <div className="top-bar-text">support@mail.com</div>
            </div>
          </div>
        </Container>
      </div>

      <Navbar expand="lg" bg="white" className="sticky-top" collapseOnSelect expanded={expanded} onToggle={(isExpanded) => setExpanded(isExpanded)}>
        <Container>
          <Navbar.Brand as={Link} to="/" onClick={handleNavClick} className="d-flex align-items-center">
            <div className="logo-circle"><FaShoppingBag /></div>
            <div><strong>NAVRANG</strong><br /><strong>HALL</strong></div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/" end onClick={handleNavClick}>Home</Nav.Link>
              <Nav.Link as={NavLink} to="/about" onClick={handleNavClick}>About Us</Nav.Link>
              <Nav.Link as={NavLink} to="/shop" onClick={handleNavClick}>Shop</Nav.Link>
              <Nav.Link as={NavLink} to="/blog" end onClick={handleNavClick}>Blog</Nav.Link>
              <Nav.Link as={NavLink} to="/contact" onClick={handleNavClick}>Contact</Nav.Link>
            </Nav>

            <div className="d-flex ms-lg-3 icons-mob">
              {isLoggedIn ? (
                <Dropdown align="end">
                  <Dropdown.Toggle as="div" style={{ cursor: 'pointer', padding: '5.5px 10px' }}>
                    <div className="nav-icon" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaUser style={{ color: '#FF7E00' }} />
                      <FaChevronDown style={{ fontSize: '12px', color: '#666' }} />
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleLogout}>
                      <FaSignOutAlt style={{ marginRight: '8px' }} /> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Nav.Link as={Link} to="/account" className="nav-icon" onClick={handleNavClick}>
                  <FaUser />
                </Nav.Link>
              )}
              <Nav.Link as={Link} to="/wishlist" className="nav-icon" onClick={handleNavClick}>
                <FaHeart className="heart-icon" />
              </Nav.Link>
              <Nav.Link as={Link} to="/cart" className="nav-icon" onClick={handleNavClick}>
                <FaShoppingCart />
              </Nav.Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <style>{`
  .top-bar { background: #FF7E00; color: #fff; padding: 10px 0; font-size: 14px; }
  .top-bar-item { display: flex; align-items: center; }
  .top-bar-icon { margin-right: 8px; }
  .top-bar-icon svg { color: #fff; font-size: 16px; }
  @media (max-width: 767.98px) {
    .top-bar-item { flex-direction: column; text-align: center; margin-bottom: 8px; }
    .top-bar-icon { margin-right: 0; margin-bottom: 4px; }
    .top-bar-text { font-size: 12px; }
  }
  @media (max-width: 991.98px) {
    .navbar-collapse { position: absolute; top: 100%; left: 0; right: 0; background: #fff; padding: 1rem; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-radius: 0 0 15px 15px; }
  }
  .logo-circle { width: 40px; height: 40px; background: #FF7E00; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px; }
  .logo-circle svg { color: #fff; font-size: 20px; }
  .nav-item, .nav-icon { transition: all 0.3s ease; }
  .nav-item:hover, .nav-icon:hover { transform: translateY(-2px); }
  .icons-mob { justify-content: center; }
  .dropdown-toggle::after { display: none !important; }
`}</style>
    </>
  )
}

export default NavigationBar