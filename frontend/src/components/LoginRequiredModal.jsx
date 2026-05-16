import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LoginRequiredModal = ({ show, onHide, message }) => {
  const navigate = useNavigate();
  
  const handleGoToLogin = () => {
    onHide();
    navigate('/account');
  };
  
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ color: '#FF7E00' }}>Login Required</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ textAlign: 'center', padding: '30px' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔐</div>
        <h5 style={{ marginBottom: '15px' }}>{message || 'Please Login to Continue'}</h5>
        <p style={{ color: '#666' }}>
          You need to be logged in to perform this action.
        </p>
        <p style={{ color: '#666' }}>
          Don't have an account? Sign up now - it's free!
        </p>
      </Modal.Body>
      <Modal.Footer style={{ justifyContent: 'center', gap: '15px' }}>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button style={{ backgroundColor: '#FF7E00', borderColor: '#FF7E00' }} onClick={handleGoToLogin}>
          Go to Login
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginRequiredModal;