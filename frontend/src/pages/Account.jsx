import { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import HeroSection from '../components/HeroSection'
import {
  FaSignInAlt,
  FaUserPlus,
  FaEnvelope,
  FaUser,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa'

import api from '../api'

const Account = () => {

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [loginAlert, setLoginAlert] = useState({
    show: false,
    type: '',
    message: ''
  })

  const [registerAlert, setRegisterAlert] = useState({
    show: false,
    type: '',
    message: ''
  })

  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // CHECK LOGIN STATUS
  useEffect(() => {
    const token = localStorage.getItem('payload-token')
    const user = localStorage.getItem('user')
    if (token && user) {
      // Already logged in, redirect to home
      window.location.href = '/'
    }
  }, [])

  // LOGIN
  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    if (!loginData.email || !loginData.password) {
      setLoginAlert({
        show: true,
        type: 'error',
        message: 'Please fill in all fields.'
      })
      return
    }

    try {
      const response = await api.login(loginData)

      if (response.data.token) {
        localStorage.setItem('payload-token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        // ✅ Direct redirect - No intermediate page
        window.location.href = '/'
      }
    } catch (error) {
      setLoginAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.error || 'Login failed. Please try again.'
      })
    }
  }

  // REGISTER
  const handleRegisterSubmit = async (e) => {
    e.preventDefault()

    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setRegisterAlert({
        show: true,
        type: 'error',
        message: 'Please fill in all fields.'
      })
      return
    }

    if (registerData.password.length < 6) {
      setRegisterAlert({
        show: true,
        type: 'error',
        message: 'Password must be at least 6 characters.'
      })
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterAlert({
        show: true,
        type: 'error',
        message: 'Passwords do not match.'
      })
      return
    }

    try {
      await api.register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password
      })

      setRegisterAlert({
        show: true,
        type: 'success',
        message: 'Registration successful! Please login to continue.'
      })

      setRegisterData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      })

      setTimeout(() => {
        setRegisterAlert({ show: false, type: '', message: '' })
      }, 4000)

    } catch (error) {
      setRegisterAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.error || 'Registration failed.'
      })
    }
  }

  return (
    <>
      <HeroSection pageName="account" />

      <section style={{ padding: '80px 0', background: '#fff' }}>
        <Container>
          <Row className="align-items-stretch">

            {/* Login Card */}
            <Col lg={6} md={6} className="mb-4 mb-lg-0">
              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
                height: '100%'
              }}>
                <div style={{
                  textAlign: 'center',
                  marginBottom: '30px',
                  paddingBottom: '20px',
                  borderBottom: '3px solid #FF7E00'
                }}>
                  <div style={{ fontSize: '40px', color: '#FF7E00', marginBottom: '15px' }}>
                    <FaSignInAlt />
                  </div>
                  <h3 style={{ fontSize: '28px', fontWeight: '700' }}>Log In.</h3>
                </div>

                {loginAlert.show && (
                  <div style={{
                    padding: '12px 20px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    backgroundColor: loginAlert.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: loginAlert.type === 'success' ? '#155724' : '#721c24'
                  }}>
                    {loginAlert.message}
                  </div>
                )}

                <Form onSubmit={handleLoginSubmit}>
                  {/* Email */}
                  <div style={{ marginBottom: '25px', position: 'relative' }}>
                    <Form.Control
                      type="email"
                      placeholder="Email Address"
                      name="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      style={{ padding: '12px 45px 12px 20px', borderRadius: '10px' }}
                    />
                    <FaEnvelope style={{
                      position: 'absolute',
                      right: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#999'
                    }} />
                  </div>

                  {/* Password */}
                  <div style={{ marginBottom: '25px', position: 'relative' }}>
                    <Form.Control
                      type={showLoginPassword ? 'text' : 'password'}
                      placeholder="Password"
                      name="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      style={{ padding: '12px 20px', borderRadius: '10px' }}
                    />
                    <span
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      style={{
                        position: 'absolute',
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#999'
                      }}
                    >
                      {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    style={{
                      width: '100%',
                      background: '#FF7E00',
                      color: 'white',
                      padding: '14px',
                      borderRadius: '30px',
                      border: 'none',
                      fontWeight: '600'
                    }}
                  >
                    Log In
                  </Button>
                </Form>
              </div>
            </Col>

            {/* Register Card */}
            <Col lg={6} md={6}>
              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 5px 25px rgba(0,0,0,0.08)',
                height: '100%'
              }}>
                <div style={{
                  textAlign: 'center',
                  marginBottom: '30px',
                  paddingBottom: '20px',
                  borderBottom: '3px solid #FF7E00'
                }}>
                  <div style={{ fontSize: '40px', color: '#FF7E00', marginBottom: '15px' }}>
                    <FaUserPlus />
                  </div>
                  <h3 style={{ fontSize: '28px', fontWeight: '700' }}>Register.</h3>
                </div>

                {registerAlert.show && (
                  <div style={{
                    padding: '12px 20px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    backgroundColor: registerAlert.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: registerAlert.type === 'success' ? '#155724' : '#721c24'
                  }}>
                    {registerAlert.message}
                  </div>
                )}

                <Form onSubmit={handleRegisterSubmit}>
                  {/* Name */}
                  <div style={{ marginBottom: '25px', position: 'relative' }}>
                    <Form.Control
                      type="text"
                      placeholder="Full Name"
                      name="name"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                      style={{ padding: '12px 45px 12px 20px', borderRadius: '10px' }}
                    />
                    <FaUser style={{
                      position: 'absolute',
                      right: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#999'
                    }} />
                  </div>

                  {/* Email */}
                  <div style={{ marginBottom: '25px', position: 'relative' }}>
                    <Form.Control
                      type="email"
                      placeholder="Email Address"
                      name="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                      style={{ padding: '12px 45px 12px 20px', borderRadius: '10px' }}
                    />
                    <FaEnvelope style={{
                      position: 'absolute',
                      right: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#999'
                    }} />
                  </div>

                  {/* Password */}
                  <div style={{ marginBottom: '25px', position: 'relative' }}>
                    <Form.Control
                      type={showRegisterPassword ? 'text' : 'password'}
                      placeholder="Password (min. 6 characters)"
                      name="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                      minLength={6}
                      style={{ padding: '12px 20px', borderRadius: '10px' }}
                    />
                    <span
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      style={{
                        position: 'absolute',
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#999'
                      }}
                    >
                      {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  {/* Confirm Password */}
                  <div style={{ marginBottom: '25px', position: 'relative' }}>
                    <Form.Control
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                      style={{ padding: '12px 20px', borderRadius: '10px' }}
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#999'
                      }}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  <Button
                    type="submit"
                    style={{
                      width: '100%',
                      background: '#FF7E00',
                      color: 'white',
                      padding: '14px',
                      borderRadius: '30px',
                      border: 'none',
                      fontWeight: '600'
                    }}
                  >
                    Register
                  </Button>
                </Form>
              </div>
            </Col>

          </Row>
        </Container>
      </section>
    </>
  )
}

export default Account