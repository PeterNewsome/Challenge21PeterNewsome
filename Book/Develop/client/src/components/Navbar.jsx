import React from 'react';
import { Navbar, Nav, Container, Modal, Tab, Button } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';
import Auth from '../utils/auth';

const AppNavbar = ({ showModal, setShowModal }) => {
  const handleCloseModal = () => setShowModal(false);

  return (
    <Navbar bg='dark' variant='dark' expand='lg'>
      <Container fluid>
        <Navbar.Brand as={Button} variant="link" onClick={() => setShowModal(false)} style={{color: 'rgba(255, 255, 255, 0.55)', textDecoration: 'none'}}>
          Google Books Search
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='navbar' />
        <Navbar.Collapse id='navbar'>
          <Nav className='ml-auto'>
            <Nav.Link as={Button} variant="link" onClick={() => setShowModal(false)} style={{color: 'rgba(255, 255, 255, 0.55)'}}>
              Search For Books
            </Nav.Link>
            {Auth.loggedIn() ? (
              <>
                <Nav.Link as={Button} variant="link" onClick={() => setShowModal(false)} style={{color: 'rgba(255, 255, 255, 0.55)'}}>
                  See Your Books
                </Nav.Link>
                <Button variant="link" style={{color: 'rgba(255, 255, 255, 0.55)'}} onClick={Auth.logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button type='button' variant="link" style={{color: 'rgba(255, 255, 255, 0.55)'}} onClick={() => setShowModal(true)}>
                Login/Sign Up
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <Modal size='lg' show={showModal} onHide={handleCloseModal} aria-labelledby='signup-modal'>
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                <LoginForm handleModalClose={handleCloseModal} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <SignUpForm handleModalClose={handleCloseModal} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </Navbar>
  );
};

export default AppNavbar;
