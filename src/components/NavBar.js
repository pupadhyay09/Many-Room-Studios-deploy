import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import images from "../assets/images/Images";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const isDisabled = true;
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <Navbar expand="lg" className="bg-body-light">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={images.logo} alt="main logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="mx-auto my-2 my-lg-0 fw-bold py-3 gap-5" navbarScroll>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to={isDisabled ? "#" : "/rooms"}>
              Rooms
            </Nav.Link>
            <Nav.Link as={Link} to={isDisabled ? "#" : "/booking"}>
              Books
            </Nav.Link>
            <Nav.Link as={Link} to={isDisabled ? "#" : "/contact"}>
              Contact
            </Nav.Link>
            <Nav.Link as={Link} to={isDisabled ? "#" : "/events"}>
              Events
            </Nav.Link>
            <Nav.Link as={Link} to={isDisabled ? "#" : "/faq"}>
              Faq
            </Nav.Link>
          </Nav>
          {/* <Form className="d-flex">
            <Button variant="outline-dark px-4 py-2">Book Now</Button>
          </Form> */}
          <Nav className="d-flex">
            <Button variant="outline-dark px-4 py-2 mx-5" onClick={handleLogout}>logout</Button>
          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
};

export default NavBar;
