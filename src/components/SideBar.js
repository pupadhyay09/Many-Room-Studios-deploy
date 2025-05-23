import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Offcanvas, Button, Nav } from "react-bootstrap";
import images from "../assets/images/Images";

const Sidebar = () => {
    const [show, setShow] = useState(true);

    const toggleSidebar = () => setShow(!show);

    return (
        <>
            <Button variant="primary" onClick={toggleSidebar} className="d-lg-none">
                ☰
            </Button>

            <Offcanvas show={show} onHide={toggleSidebar} placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        <img src={images.logo} alt="main logo" width="150" />
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">
                        <Nav.Link as={Link} to="/">
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/rooms">
                            Rooms
                        </Nav.Link>
                        <Nav.Link as={Link} to="/booking">
                            Books
                        </Nav.Link>
                        <Nav.Link as={Link} to="/contact">
                            Contact
                        </Nav.Link>
                        <Nav.Link as={Link} to="/events">
                            Events
                        </Nav.Link>
                        <Nav.Link as={Link} to="/faq">
                            Faq
                        </Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default Sidebar;
