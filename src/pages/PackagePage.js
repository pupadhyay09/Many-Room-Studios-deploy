import React, { useEffect, useState } from "react";
import RoomTabs from "../components/RoomTabs";
import { useLocation, useNavigate } from "react-router-dom";
import { getRoomDropdownList, getRoomPackages } from "../redux/slices/rooms";
import { useDispatch, useSelector } from "react-redux";
import PackageCard from "../components/PackageCard";
import { Container } from "react-bootstrap";

const PackagePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state?.roomID;
 const { roomPackages, roomListDropDown } = useSelector((state) => state.rooms);
 const [selectedRoom, setSelectedRoom] = useState(roomId ? roomId : "-1");

  useEffect(() => {
    getRoomPackagesList();
  }, [dispatch, selectedRoom]);

  useEffect(() => {
    dispatch(getRoomDropdownList());
  }, [dispatch]);

  const getRoomPackagesList = () => {
    dispatch(getRoomPackages(selectedRoom));
  };

  return (
  <Container>
      <div className="package-page">
        <h1>Book Your Room & Time</h1>
        <RoomTabs
          tabs={[
            {
              value: "-1",
              text: "All Rooms",
            },
            ...roomListDropDown,
          ]}
          activeTab={selectedRoom?.toString()}
          onSelect={setSelectedRoom}
        />
       <PackageCard packages={roomPackages} onClickBookNow={(pkgId) => { navigate(`/rooms`, { state: { roomId: selectedRoom, pkgId: pkgId } }); }} />
      </div>
    </Container>
 );
};

export default PackagePage;
