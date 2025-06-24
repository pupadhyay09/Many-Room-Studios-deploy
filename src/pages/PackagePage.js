import React, { useEffect, useState } from 'react';
import RoomTabs from '../components/RoomTabs';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRoomDropdownList, getRoomPackages } from '../redux/slices/rooms';
import { useDispatch, useSelector } from 'react-redux';
import PackageCard from '../components/PackageCard';

const PackagePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state?.roomID;
  const { roomPackages, roomListDropDown } = useSelector((state) => state.rooms);
  console.log('Room Packages from state:', roomPackages);
  console.log('Room ID from state:', roomId);
  const [selectedRoom, setSelectedRoom] = useState(roomId ? roomId : "-1");

  useEffect(() => {
    getRoomPackagesList()
  }, [dispatch, selectedRoom]);

  useEffect(() => {
    dispatch(getRoomDropdownList());
  }, [dispatch]);

  const getRoomPackagesList = () => {
    dispatch(getRoomPackages(selectedRoom));
  };

  return (
    <div className="package-page">
      <h1>Book Your Room & Time</h1>
      <RoomTabs tabs={[{
        "value": "-1",
        "text": "All Rooms"
      }, ...roomListDropDown]} activeTab={selectedRoom?.toString()} onSelect={setSelectedRoom} />
      <PackageCard packages={roomPackages} />
    </div>
  );
};

export default PackagePage;
