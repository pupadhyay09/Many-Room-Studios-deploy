import React, { useState } from "react";
import { RiImageAiFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { URLS } from "../api/Urls";
import noImage from '../assets/images/noimage.png';

const RoomCardOne = ({
  id,
  roomImagePath,
  roomName,
  hourlyPrice,
  discountPercentage,
  totalBeds,
  totalSofas,
  description,
  onPlayClick,
  onBookClick
}) => {
  const [imgSrc, setImgSrc] = useState(
    roomImagePath?.length > 0 ? URLS.Image_Url + roomImagePath[0] : noImage
  );

  return (
    <div className="room-card">
      <div className="room-image-container">
        <img
          src={imgSrc}
          alt={roomName}
          className="room-image"
          onError={() => setImgSrc(noImage)}
        />

        {discountPercentage && <span className="room-offer">{discountPercentage}% off</span>}
        <span className="room-price">From: ${hourlyPrice}/hour</span>
        <button className="play-btn" onClick={() => onPlayClick(imgSrc)}>
          <RiImageAiFill size={25} />
        </button>
      </div>
      <div>
        <h5 className="room-title">{roomName}</h5>
        <p className="room-meta">
          {totalBeds} Beds {totalSofas} Sofas
        </p>
        <p className="room-description">{description}</p>
        <button className="book-btn" onClick={() => { onBookClick(id) }}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default RoomCardOne;
