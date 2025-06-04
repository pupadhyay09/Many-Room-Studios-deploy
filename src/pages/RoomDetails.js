// RoomDetails.jsx
import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import BookingCelender from "../components/BookingCelender";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import images from "../assets/images/Images";
import { useDispatch, useSelector } from "react-redux";
import { URLS } from "../api/Urls";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getMasterDetails, getRoomDetails, setRoomDetails, getAvailableSlots } from "../redux/slices/rooms";
import noImage from '../assets/images/noimage.png';
import { compose } from "@reduxjs/toolkit";

const RoomDetails = () => {
  const { id } = useParams(); // <-- id from URL
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const { roomDetails, availableSlots } = useSelector((state) => state.rooms);

  useEffect(() => {
    if (id) {
      dispatch(getRoomDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(getMasterDetails("EventType"));
  }, [dispatch]);

  useEffect(() => {
    console.log('Location state:sfbsdmf', location.state);
  }, [location.state]);

  // Example: fetch slots for today on mount or when roomDetails.id changes
  // useEffect(() => {
  //   if (roomDetails?.id) {
  //     const today = new Date().toISOString().split("T")[0];
  //     console.log('Fetching available slots for room:', roomDetails.id, 'on date:', today);
  //     dispatch(getAvailableSlots({ id: roomDetails.id, bookingDate: today }));
  //   }
  // }, [roomDetails?.id, dispatch]);

  const mainroom = [
    {
      title: "BABINGTON HOUSE",
      location: "USA",
      image: `${images.house1}`,
    },
    {
      title: "SOHO FARMHOUSE",
      location: "Russia",
      image: `${images.house2}`,
    },
    {
      title: "WHITE CITY HOUSE",
      location: "Italy",
      image: `${images.house3}`,
    },
    {
      title: "BERLIN LOFT",
      location: "Germany",
      image: `${images.house4}`,
    },
  ];

  return (
    <>
      <section>
        <div
          style={{
            width: "100%",
            margin: "0 auto",
            padding: "50px 0",
            overflow: "hidden",
            backgroundColor: "#F5F5EE",
            height: "1000px",
            position: "relative",
          }}
          className="mainslider"
        >
          {/* Custom Navigation */}
          <div>
            <div
              className="custom-prev"
              style={{
                position: "absolute",
                bottom: "25%",
                right: "20%",
                zIndex: 10,
              }}
            >
              <button className="sliderbtn-add">
                <MdArrowLeft />
              </button>
            </div>
            <div
              className="custom-next"
              style={{
                position: "absolute",
                bottom: "25%",
                right: "15%",
                zIndex: 10,
              }}
            >
              <button className="sliderbtn-add">
                <MdArrowRight />
              </button>
            </div>
          </div>

          <Swiper
            slidesPerView={3}
            centeredSlides={true}
            spaceBetween={30}
            onSlideChange={(swiper) => { console.log('swiper.realIndex===>', swiper.realIndex); setActiveIndex(swiper.realIndex) }}
            loop={true}
            navigation={{
              prevEl: ".custom-prev",
              nextEl: ".custom-next",
            }}
            modules={[Navigation]}
            style={{
              padding: "0 20px",
              margin: "0 20px",
              overflow: "visible",
            }}
            breakpoints={{
              1200: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              320: {
                slidesPerView: 1,
                spaceBetween: 30,
              },
            }}
          >
            {

              roomDetails && roomDetails?.roomImagePath?.length > 0 ?
                roomDetails?.roomImagePath?.map((room, index) => {
                  console.log('room', room);
                  const isActive = index === activeIndex;
                  let imgSrc = URLS.Image_Url + room || noImage;
                  const handleImageError = () => {
                    console.log('Image not found, setting to noImage');
                    imgSrc = noImage;
                  };

                  return (
                    <SwiperSlide
                      key={index}
                      style={{
                        transform: isActive ? "scale(1)" : "scale(0.9)",
                        height: isActive ? "620px" : "580px",
                        transition: "transform 0.3s ease, height 0.3s ease",
                        borderRadius: "16px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        position: "relative",
                      }}
                    >
                      <img
                        src={imgSrc}
                        alt={roomDetails?.roomName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "16px",
                        }}
                        className={isActive ? "add" : ""}
                        onError={handleImageError}
                      />
                    </SwiperSlide>
                  );
                })

                : <SwiperSlide
                  key={0}
                  style={{
                    transform: "scale(1)",
                    height: "620px",
                    transition: "transform 0.3s ease, height 0.3s ease",
                    borderRadius: "16px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    position: "relative",
                  }}
                >
                  <img  
                    src={noImage}
                    alt={roomDetails?.roomName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "16px",
                    }}
                    className={ "add"}
                    // onError={handleImageError}
                  />
                </SwiperSlide>
            }
          </Swiper>

          {/* STATIC TEXT SECTION (not sliding) */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "35%",
              bottom: "8%",
              padding: "20px",
              maxWidth: "33%",
            }}
            className="responsivslider"
          >
            <h5 className="housename">{roomDetails?.roomName}</h5>
            <p className="housetypes">
              <span>Max: {roomDetails?.capacity}</span>{" "}
              <span>{roomDetails.totalBeds + ' bed ' + roomDetails?.totalSofas + ' sofa'}</span>{" "}
              <span>Event Type: {roomDetails.roomEventsName}</span>
            </p>
            <p className="housedescription">{roomDetails.description}</p>
          </div>
        </div>
      </section>

      <section>
        <Container>
          <div className="bookingdesign">
            <BookingCelender availableSlots={availableSlots} />
          </div>
        </Container>
      </section>

      <section>
        <div className="herobgone">
          <Container className="my-5">
            <Row>
              <Col md={12} className="text-center my-5">
                <h1>Discover your desired space</h1>
                <p>
                  Our rooms are the ideal creative space in our well-lit studio,
                  catering to photographers, <br />
                  content creators, and videographers alike. Located across
                  London, our spaces are a <br />
                  collection of meticulously selected rooms, and the number of
                  rooms within the Many <br />
                  Rooms collection is growing...
                </p>
              </Col>

              <Col md={12}>
                <Swiper
                  modules={[Autoplay, Pagination]}
                  loop={true}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  spaceBetween={30}
                  breakpoints={{
                    0: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    992: { slidesPerView: 3 },
                  }}
                >
                  {mainroom.map((item, index) => (
                    <SwiperSlide key={index}>
                      <Card className="bg-dark text-white border-0">
                        <Card.Img
                          src={item.image}
                          alt={item.title}
                          style={{ height: "475px", objectFit: "cover" }}
                        />
                        <Card.ImgOverlay
                          className="d-flex flex-column justify-content-end p-4"
                          style={{ background: "rgba(0, 0, 0, 0.4)" }}
                        >
                          <Card.Title>{item.title}</Card.Title>
                          <Card.Text>{item.location}</Card.Text>
                        </Card.ImgOverlay>
                      </Card>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
    </>
  );
};

export default RoomDetails;
