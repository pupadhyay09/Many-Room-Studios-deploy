import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaInstagram, FaTiktok, FaFacebookF, FaTwitter } from 'react-icons/fa';
import images from '../assets/images/Images';

const Footer = () => {
    return (
        <footer className="py-4 border-top">
            <Container>
                <Row className="align-items-center text-center text-md-start">
                    <Col md={12} className='d-flex justify-content-center gap-2 mb-3'>
                        <div className="d-flex mt-2">
                            <a href="/" className="text-dark me-3"><FaInstagram /></a>
                            <a href="/" className="text-dark me-3"><FaTiktok /></a>
                            <a href="/" className="text-dark me-3"><FaFacebookF /></a>
                            <a href="/" className="text-dark"><FaTwitter /></a>
                        </div>
                    </Col>

                    <Col md={2} className="mb-3 mb-md-0 addrightline">
                        <img
                            src={images.logo}
                            alt="Many Rooms Studios"
                            style={{ maxWidth: '150px' }}
                        />
                    </Col>

                    <Col md={2} className='addrightline'>
                        <p className="mb-1"><a href="/privacy" className="text-decoration-none text-dark">Privacy Policy</a></p>
                        <p><a href="/" className="text-decoration-none text-dark">Blog</a></p>
                    </Col>

                    <Col md={3} className='addrightline'>
                        <p className="mb-1">Copyright of Many Rooms Studios LTD</p>
                        <p className="mb-1">company no. 10026300</p>
                    </Col>

                    <Col md={2} className='addrightline'>
                        <p className="mb-1">0736 158 6558</p>
                    </Col>

                    <Col md={3}>
                        <p className="mb-1">info@manyroomsstudios.com</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
