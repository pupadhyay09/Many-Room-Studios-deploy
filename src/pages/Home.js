import { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import RoomCardOne from "../components/RoomCardOne";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAvailableSlots, getRoomDropdownList, getRoomPackages, setRoomDetails } from "../redux/slices/rooms";
import PackageCard from "../components/PackageCard";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roomListDropDown, roomPackages } = useSelector((state) => state.rooms);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState('-1');

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    getRoomListCall()
  }, [dispatch]);

  const getRoomListCall = () => {
    dispatch(getRoomDropdownList());
  };

  useEffect(() => {
    getRoomPackagesList();
  }, [dispatch, selectedRoomId]);

  const getRoomPackagesList = () => {
    dispatch(getRoomPackages(selectedRoomId));
  };

  return (
    <>
      <Container >
        <div className="explore-rooms py-5">
          <div className="mb-3 exploretext">
            <h2>
              Book Your Room & Time
            </h2>
          </div>

          <div className="room-tabs-container mb-4">
            {[{ value: "-1", text: "All Rooms" }, ...roomListDropDown]?.map((room) => (
              <button
                key={room.id}
                className={`room-tab ${selectedRoomId === room.value ? 'selected' : ''}`}
                onClick={() => setSelectedRoomId(room.value)}
              >
                <em>{room.text}</em>
              </button>
            ))}
          </div>

          <PackageCard packages={roomPackages} onClickBookNow={(pkg) => {
            const today = new Date().toISOString().split("T")[0];
            dispatch(getAvailableSlots({ id: pkg.id, bookingDate: today }));
            navigate(`/rooms`, { state: { roomId: pkg?.roomID, pkgs: pkg } })
          }} />
        </div>
      </Container>

    </>
  );
};

export default Home;
