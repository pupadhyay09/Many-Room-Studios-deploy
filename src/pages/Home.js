import { useState, useEffect } from "react";
import images from "../assets/images/Images";
import { Container, Row, Col, Form } from "react-bootstrap";
import DatePickerModal from "../components/DatePickerModal";
import TimeSelect from "../components/TimeSelect";
import { Dropdown, EventDropdown } from "../components/Dropdown";
import RoomCardOne from "../components/RoomCardOne";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMasterDetails, getRoomList, setRoomDetails } from "../redux/slices/rooms";
import moment from "moment";
import { toast } from "react-toastify"; // Add this if you want to show error messages

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [date, setDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState(moment(new Date()).format("HH:mm"));
  const [endTime, setEndTime] = useState(moment(new Date()).add(1, 'hour').format("HH:mm"));
  const [people, setPeople] = useState(1);
  const [eventType, setEventType] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 6;
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const { roomList, masterList } = useSelector((state) => state.rooms);
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = roomList.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(roomList.length / roomsPerPage);
  const today = moment(new Date()).format("YYYY-MM-DD");
  const nowTime = moment(new Date()).format("HH:mm:ss");
  const isToday = date === today;

  const handleShowModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    localStorage.setItem("bookingFormData", "");
    dispatch(getMasterDetails("EventType"));
  }, [dispatch]);

  useEffect(() => {
    getRoomListCall()
  }, [dispatch, eventType, startTime, endTime, people, date]);

  const handleStartTimeChange = (value) => {
    setStartTime(value);
    // If endTime is less than 1 hour after startTime, adjust endTime
    const start = moment(value, "HH:mm");
    const end = moment(endTime, "HH:mm");
    if (end.diff(start, "minutes") < 60) {
      setEndTime(start.clone().add(1, "hour").format("HH:mm"));
    }
  };

  const handleEndTimeChange = (value) => {
    const start = moment(startTime, "HH:mm");
    const end = moment(value, "HH:mm");
    if (end.diff(start, "minutes") < 60) {
      toast.error("End time must be at least 1 hour after start time.");
      return;
    }
    setEndTime(value);
  };

  const getRoomListCall = () => {
    // Convert to HH:mm:ss for API
    const startTimeApi = moment(startTime, "HH:mm").format("HH:mm:ss");
    const endTimeApi = moment(endTime, "HH:mm").format("HH:mm:ss");
    const data = {
      bookingDate: date ? date : moment(new Date()).format("YYYY-MM-DD"),
      startTime: startTimeApi,
      endTime: endTimeApi,
      numberofpeople: people,
      eventType: eventType
    };
    dispatch(getRoomList(JSON.stringify(data)));
  };

  const handleBookRoom = (id) => {
    const roomDetails = roomList.find((room) => room.id === id);
    dispatch(setRoomDetails(roomDetails));
    navigate(`/rooms/${id}`);
  };
  return (
    <>
      <Container fluid>
        <Row>
          <Col>
            <header>
              <div
                className="hero-container"
                style={{ backgroundImage: `url(${images.herobg})` }}
              >
                <div className="overlay-hero"></div>
                <div className="hero-content">
                  <h1>
                    London’s most popular
                    <br />
                    content creation space
                  </h1>
                  <p>
                    <span>Fully equipped rooms</span>
                    <span className="divider">|</span>
                    <span>Affordable rates</span>
                  </p>
                  {/* <button
                    className="hero-button"
                    onClick={() => {
                      navigate("/rooms");
                    }}
                  >
                    Book Now
                  </button> */}
                </div>
              </div>
            </header>
          </Col>
        </Row>

        <div className="datetime">
          <Container className="py-4 booking-form">
            <Row className="justify-content-between">
              <Col lg={2} md={6} className="mb-3">
                <DatePickerModal value={date} onChange={setDate} minDate={new Date()} />
              </Col>
              <Col lg={2} md={6} className="mb-3">
                <TimeSelect
                  label="Start time"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  minTime={isToday ? nowTime.slice(0,5) : "00:00"}
                  format="HH:mm"
                />
              </Col>
              <Col lg={2} md={6} className="mb-3">
                <TimeSelect
                  label="End time"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  minTime={moment(startTime, "HH:mm").add(1, "hour").format("HH:mm")}
                  format="HH:mm"
                />
              </Col>
              <Col lg={2} md={6} className="mb-3">
                <Form.Label>Number of People</Form.Label>
                <Form.Control placeholder="Number" type="number" value={people} onChange={(e) => { setPeople(e.target.value) }} />
              </Col>
              <Col lg={2} md={6} className="mb-3">
                <EventDropdown
                  label="Event type"
                  options={masterList ? masterList : []}
                  value={eventType}
                  onChange={setEventType}
                />
              </Col>
            </Row>
          </Container>
        </div>

        <div className="explore-rooms py-5">
          <div className="text-center mb-4 exploretext">
            <h2>
              Explore Our <br /> Featured{" "}
              <span style={{ color: "teal" }}>Rooms</span>
            </h2>
          </div>

          <Row>
            {currentRooms.map((room, idx) => (
              <Col lg={4} md={6} className="mb-4" key={idx}>
                <RoomCardOne {...room} onPlayClick={handleShowModal} onBookClick={handleBookRoom} />
              </Col>
            ))}
          </Row>

          <div className="pagination text-center mt-4">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`mx-1 px-3 py-1 border ${currentPage === i + 1 ? "bg-dark text-white" : ""
                  }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </Container>

      <>
        <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Room Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={selectedImage} alt="Room" className="modal-image" />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
};

export default Home;
