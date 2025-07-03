// RoomDetails.jsx
import React, { useEffect, useRef, useState } from "react";
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
import {
  getRoomDetails,
  getRoomPackageDetails,
  getAvailableSlots,
} from "../redux/slices/rooms";
import noImage from "../assets/images/noimage.png";

const RoomDetails = () => {
  const location = useLocation();
  const { roomId, pkgs } = location.state;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSwiperReady, setIsSwiperReady] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const { roomDetails, roomPackageDetails } = useSelector((state) => state.rooms);
  const [pkg, setPackage] = useState(pkgs ? pkgs : "")
  console.log('roomPackageDetails====>', roomPackageDetails)
  useEffect(() => {
    if (roomId) {
      dispatch(getRoomDetails(roomId));
    }
    if (pkgs?.id) {
      dispatch(getRoomPackageDetails(pkgs?.id));
    }
  }, [roomId, dispatch]);

  useEffect(() => {
    if (prevRef.current && nextRef.current) {
      setIsSwiperReady(true);
    }
  }, [prevRef.current, nextRef.current]);

  const roomImages = roomPackageDetails?.roomPackageImagePath || [];

  let extendedImages = roomImages;
  if (roomImages.length === 2 || roomImages.length === 3) {
    extendedImages = [...roomImages, ...roomImages];
  }
  const isSingleImage = roomImages.length === 1;
  const showNavigation = extendedImages.length > 1;

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

  useEffect(() => {
    const preFeildData = localStorage.getItem("bookingFormData");
    console.log('preFeildData=====>', preFeildData)
    if (preFeildData) {
      const formData = JSON.parse(preFeildData);
      setPackage(formData?.pkg)
      dispatch(getAvailableSlots({ id: formData?.pkg?.id, bookingDate: formData?.startDateTime }));
    }
  }, []);

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
            height: isSingleImage ? "auto" : "1000px",
            position: "relative",
          }}
          className="mainslider"
        >
          {/* Custom Navigation Buttons */}
          {showNavigation && (
            <>
              <div
                className="custom-prev"
                style={{
                  position: "absolute",
                  bottom: "25%",
                  right: "20%",
                  zIndex: 10,
                }}
              >
                <button className="sliderbtn-add" ref={prevRef}>
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
                <button className="sliderbtn-add" ref={nextRef}>
                  <MdArrowRight />
                </button>
              </div>
            </>
          )}

          {(isSingleImage || isSwiperReady) &&
            (isSingleImage ? (
              <div className="single-image-container">
                <img
                  src={
                    roomImages[0]
                      ? roomImages[0].startsWith("http")
                        ? roomImages[0]
                        : URLS.Image_Url + roomImages[0]
                      : noImage
                  }
                  alt={roomPackageDetails?.roomPackageName}
                  style={{
                    width: "50%",
                    height: "auto",
                    borderRadius: "16px",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
              </div>
            ) : (
              <Swiper
                onSwiper={setSwiperInstance}
                slidesPerView={1}
                centeredSlides={true}
                spaceBetween={30}
                loop={extendedImages.length > 1}
                navigation={
                  showNavigation
                    ? {
                      prevEl: prevRef.current,
                      nextEl: nextRef.current,
                    }
                    : false
                }
                modules={[Navigation]}
                style={{
                  padding: "0 20px",
                  overflow: "visible",
                }}
                breakpoints={{
                  1200: {
                    slidesPerView: extendedImages.length > 1 ? 3 : 1,
                    spaceBetween: 30,
                  },
                  768: {
                    slidesPerView: extendedImages.length > 1 ? 2 : 1,
                    spaceBetween: 20,
                  },
                  320: { slidesPerView: 1, spaceBetween: 30 },
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              >
                {extendedImages.map((room, index) => {
                  const isActive = index === activeIndex;
                  let imgSrc = room ? URLS.Image_Url + room?.imagePath : noImage;
                  return (
                    <SwiperSlide
                      key={index}
                      style={{
                        transform: isActive ? "scale(1)" : "scale(0.9)",
                        height: isActive ? "620px" : "580px",
                        transition: "transform 0.7s ease, height 0.5s ease",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        position: "relative",
                      }}
                    >
                      <img
                        src={imgSrc}
                        alt={roomPackageDetails?.roomPackageName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "16px",
                          borderTopLeftRadius: isActive ? "100px" : "16px",
                          borderBottomRightRadius: isActive ? "100px" : "16px",
                          border: isActive
                            ? "2px solid black"
                            : "2px solid transparent",
                        }}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            ))}

          {/* Static text section */}
          <div
            style={{
              position: isSingleImage ? "unset" : "absolute",
              bottom: isSingleImage ? "unset" : "5%",
              left: isSingleImage ? "unset" : "35%",
              padding: "20px",
              maxWidth: isSingleImage ? "50%" : "33%",
              margin: isSingleImage ? "0 auto" : "unset",
            }}
            className="responsivslider"
          >
            <div className="row">
              <div className="col-lg-6">
                <p>Room Name: <span className="housename">{roomDetails?.roomName}</span> </p>
              </div>
              <div className="col-lg-6">
                <p>Package Name: <span className="housename">{roomPackageDetails?.roomPackageName}</span> </p>
              </div>
              <div className="col-lg-6">
                <p>Package Interval: <span className="housename">{roomPackageDetails?.interval}hr</span></p>
              </div>
              <div className="col-lg-6">
                <p>Package Price: <span className="housename">{'£' + roomPackageDetails?.amount}</span></p>
              </div>
            </div>
            <p className="housedescription">{roomPackageDetails.description}</p>
          </div>

        </div>
      </section>

      <section>
        <Container>
          <div className="bookingdesign">
            <BookingCelender pkg={pkg} onClickBack={() => { window.history.back(); localStorage.setItem("bookingFormData", ""); }} />
          </div>
        </Container>
      </section>

      <section>
        <div className="herobgone">
          <Container className="my-sm-5 mb-5 mb-sm-0">
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
