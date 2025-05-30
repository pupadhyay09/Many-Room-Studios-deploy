import React, { useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import images from "../assets/images/Images";
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { roomBooking } from "../redux/slices/rooms";
import { URLS } from "../api/Urls";
import noImage from '../assets/images/noimage.png';

function to12HourFormat(timeStr) {
  // timeStr: "2025-05-28T13:00:00.000Z" or "13:00"
  let time = timeStr;
  if (timeStr.includes("T")) {
    time = timeStr.split("T")[1].substring(0, 5); // "13:00"
  }
  const [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

function isValidEmail(email) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const Booking = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state || {};
  const [imgSrc, setImgSrc] = useState(
    bookingData?.roomImagePath?.length > 0 ? URLS.Image_Url + bookingData?.roomImagePath[0] : noImage
  );
  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileNo: "",
    purposeOfHire: "",
    termsAndCondition: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!form.name) newErrors.name = "Name is required.";
    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.mobileNo) newErrors.mobileNo = "Phone number is required.";
    if (!form.purposeOfHire) newErrors.purposeOfHire = "Purpose of hire is required.";
    if (!form.termsAndCondition) newErrors.termsAndCondition = "You must accept the terms and conditions.";
    if (!bookingData.roomID) newErrors.roomID = "Room ID missing.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const data = {
      franchiseeAdminID: bookingData?.franchiseeAdminID,
      roomEventID: bookingData?.eventType,
      roomID: bookingData?.roomID,
      bookingStartDateTime: bookingData?.startTime,
      bookingEndDateTime: bookingData?.endTime,
      numberofPeople: bookingData?.people,
      name: form?.name,
      email: form?.email,
      purposeOfHire: form?.purposeOfHire,
      mobileNo: form?.mobileNo,
      termsAndCondition: form?.termsAndCondition,
    };

    try {
      const action = await dispatch(roomBooking(JSON.stringify(data)));
      console.log('Booking action dispatched:', action);
      if (action.payload?.type === "success") {
        // Success logic
        const response = action.payload.data;
        if (response && response.stripsessionurl) {
          window.location.href = response.stripsessionurl;
        }
      } else if (action.payload?.type === "rejected" || action.error) {
        // Error logic
        setErrors({ api: action.payload?.message || action.error?.message || "Booking failed." });
      }
    } catch (error) {
      // Show API error message if available
      setErrors({ api: error?.message || "Booking failed. Please try again." });
    }
  };

  function getHourDiff(start, end) {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate;
    const diffHrs = diffMs / (1000 * 60 * 60);
    return diffHrs > 0 ? diffHrs : 0;
  }

  const hourlyPrice = Number(bookingData?.hourlyPrice) || 0;
  const taxesPercentage = Number(bookingData?.taxes) || 0; // taxes as percentage
  const discountPercentage = Number(bookingData?.discountPercentage) || 0;
  const hours = getHourDiff(bookingData.startTime, bookingData.endTime);

  const roomCost = +(hourlyPrice * hours).toFixed(2);
  // Both discount and taxes are calculated on base price (roomCost)
  const discount = +((roomCost * discountPercentage) / 100).toFixed(2);
  const taxes = +((roomCost * taxesPercentage) / 100).toFixed(2);
  const total = +(roomCost - discount + taxes).toFixed(2);

  return (
    <Container className="bookingbg">
      <Row>
        <Col lg={8}>
          <Row className="bookhead">
            <Col md={4}>
              <div className="bookroomimg">
                {/* <img src={images.room1} alt="Room" /> */}
                <img
                  src={imgSrc}
                  alt={bookingData?.roomName}
                  className="room-image"
                  onError={() => setImgSrc(noImage)}
                />
              </div>
            </Col>
            <Col md={8} className="setborderbo">
              <div className="bookingheadtext">
                <h3>{bookingData?.roomName?.toUpperCase()}</h3>
                {/* <p>{bookingData?.location}</p> */}
                {/* <h3>SOHO FARMHOUSE</h3> */}
                <p>Moscow, Russia</p>
              </div>
              <div className="setloctaionmap">
                <div>
                  <IoLocationSharp size={22} color="red" />
                  Location
                </div>
                <div className="maptext">
                  <p>View On Map</p>
                </div>
              </div>
              <div className="textlocation">
                <p>
                  Chobotovskaya 2nd avenue <br />
                  Moscow
                </p>
              </div>
            </Col>
            <div className="bottomtext">
              <p>Booking & Cancellation Policy</p>
            </div>

            <div className="setform">
              <h4>Your Details please</h4>
            </div>

            <Row>
              <div className="p-sm-4 p-2">
                <Form >
                  <Row className="mb-3 g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          type="text"
                          placeholder="Enter your name"
                        />
                        {errors.name && <div className="text-danger mt-1">{errors.name}</div>}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          type="email"
                          placeholder="Enter your email"
                        />
                        {errors.email && <div className="text-danger mt-1">{errors.email}</div>}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-4 g-3">
                    <Col md={12}>
                      <Form.Label>Phone Number</Form.Label>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Form.Select style={{ width: "30%" }}>
                          <option>+44</option>
                          <option>+91</option>
                          <option>+1</option>
                        </Form.Select>
                        <Form.Control
                          name="mobileNo"
                          value={form.mobileNo}
                          onChange={handleChange}
                          required
                          type="text"
                          placeholder="Phone number"
                        />
                      </div>
                      {errors.mobileNo && <div className="text-danger mt-1">{errors.mobileNo}</div>}
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Purpose Of Hire</Form.Label>
                        <Form.Control
                          name="purposeOfHire"
                          value={form.purposeOfHire}
                          onChange={handleChange}
                          required
                          type="text"
                          placeholder="Purpose of hire"
                        />
                        {errors.purposeOfHire && <div className="text-danger mt-1">{errors.purposeOfHire}</div>}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      Do you require a colorama (paper) backdrop? If yes, please
                      state which colour(s). We provide the backdrop on request
                      only. We are able to order a specific colour that you
                      require with 7 days notice. There is an additional charge
                      of £15 per roll.
                    </Form.Label>
                    <Form.Control as="textarea" rows={2} className="mb-2" />
                    <Form.Check
                      type="checkbox"
                      name="termsAndCondition"
                      checked={form.termsAndCondition}
                      onChange={handleChange}
                      label={
                        <>
                          I certify that I have read and accept the Terms and
                          Conditions outlined in the{" "}
                          <a to="/" className="text-dark">
                            Studio Hire Agreement
                          </a>
                        </>
                      }
                    />
                    {errors.termsAndCondition && <div className="text-danger mt-1">{errors.termsAndCondition}</div>}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      We now offer holiday props and additional equipment for
                      hire. Please let us know if you are interested.
                    </Form.Label>
                    <Form.Control as="textarea" rows={2} />
                  </Form.Group>

                  {/* <Form.Group className="mb-4">
                    <Form.Label>Number Of Attendees</Form.Label>
                    <Form.Control type="text" placeholder="e.g. 10" />
                  </Form.Group> */}

                  {/* <Form.Group className="mb-3 paymentbox">
                    <p>Payment</p>
                    <Form.Label>Standard + room hire</Form.Label>
                    <Form.Select>
                      <option>Pay Now</option>
                      <option>Google Pay</option>
                      <option>Phone Pay</option>
                    </Form.Select>
                  </Form.Group> */}

                  {/* <Button type="submit" variant="dark" className="w-100 py-3">
                    Make Payment
                  </Button> */}
                </Form>
              </div>
            </Row>

            {/* <Row className="allpaymetbox">
              <Col lg={3} sm={6} className="paymetlogo">
                <img src={images.pay1} alt="payment one" />
              </Col>
              <Col lg={3} sm={6} className="paymetlogo">
                <img src={images.pay2} alt="payment two" />
              </Col>
              <Col lg={3} sm={6} className="paymetlogo">
                <img src={images.pay3} alt="payment three" />
              </Col>
              <Col lg={3} sm={6} className="paymetlogo">
                <img src={images.pay4} alt="payment four" />
              </Col>
            </Row> */}
          </Row>
        </Col>

        <Col lg={4}>
          <div className="p-3">
            <h5 className="mb-3 border-bottom pb-2 fw-bold">
              YOUR BOOKING DETAILS
            </h5>

            <div className="mb-2">
              <strong>Check in</strong>
              <div className="numbertext">
                {bookingData.date
                  ? new Date(bookingData.date).toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "long", day: "numeric" })
                  : "--"}
              </div>
            </div>

            <div className="mb-2">
              <strong>Check Out</strong>
              <div className="numbertext">
                {bookingData.date
                  ? new Date(bookingData.date).toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "long", day: "numeric" })
                  : "--"}
              </div>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <div>
                <strong>Start Time</strong>
                <div className="numbertext">
                  {bookingData.startTime
                    ? to12HourFormat(bookingData.startTime)
                    : "--"}
                </div>
              </div>
              <div>
                <strong>End Time</strong>
                <div className="numbertext">
                  {bookingData.endTime
                    ? to12HourFormat(bookingData.endTime)
                    : "--"}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <div>
                <strong>Attendees</strong>
                <div className="numbertext">
                  {bookingData.people ? bookingData.people : "--"}
                </div>
              </div>
              <div>
                <strong>Event Type</strong>
                <div className="numbertext">
                  {bookingData.eventTypeName
                    ? bookingData.eventTypeName
                    : "N/A"}
                </div>
              </div>
            </div>

            <hr />

            <h6 className="mb-3 fw-bold">CHARGES</h6>
            <div className="d-flex justify-content-between mb-2">
              <span>Hourly Price</span>
              <span className="pricetext">£ {hourlyPrice.toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Duration</span>
              <span className="pricetext">{hours.toFixed(2)} hour(s)</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Room Cost</span>
              <span className="pricetext">£ {roomCost.toLocaleString()}</span>
            </div>
            {discountPercentage > 0 && (
              <div className="d-flex justify-content-between mb-2">
                <span>Discount ({discountPercentage}%)</span>
                <span className="pricetext text-success">-£ {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="d-flex justify-content-between mb-2">
              <span>Taxes & Fees ({taxesPercentage}%)</span>
              <span className="pricetext">£ {taxes.toLocaleString()}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-4">
              <strong>GRAND TOTAL</strong>
              <strong className="pricetext">£ {total.toLocaleString()}</strong>
            </div>

            <Button
              variant="danger"
              className="mb-2 w-100"
              onClick={() => {
                // navigate(-1, {
                //   state: {
                //     ...bookingData,
                //   }
                // });
                navigate(-1, { state: bookingData });
              }}
            >
              Go Back
            </Button>
            <Button type="submit" variant="dark" className="w-100 py-3" onClick={handlePayment}>
              Make Payment
            </Button>
            {errors.api && <div className="text-danger mt-2">{errors.api}</div>}
          </div>
        </Col>
      </Row>
    </Container>
  );

};

export default Booking;
