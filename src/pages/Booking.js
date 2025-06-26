import React, { useState } from "react";
import { Col, Container, Card, Row, Form, Button } from "react-bootstrap";
import images from "../assets/images/Images";
import { IoLocationSharp } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { roomBooking } from "../redux/slices/rooms";
import { URLS } from "../api/Urls";
import noImage from "../assets/images/noimage.png";

function isValidEmail(email) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const Booking = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const bookingFormData = location.state || {};
  const { roomDetails } = useSelector((state) => state.rooms);
  console.log("bookingFormData====>", bookingFormData);
  const [imgSrc, setImgSrc] = useState(
    roomDetails?.roomImagePath?.length > 0
      ? URLS.Image_Url + roomDetails?.roomImagePath[0]
      : noImage
  );
  console.log("roomDetails Form Data:", roomDetails);
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
    console.log("PraveenUpadhhsdgs");
    e.preventDefault();
    debugger;
    let newErrors = {};
    if (!form.name) newErrors.name = "Name is required.";
    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.mobileNo) newErrors.mobileNo = "Phone number is required.";
    if (!/^[0-9]{7,15}$/.test(form.mobileNo)) {
      newErrors.mobileNo = "Enter a valid phone number.";
    }
    if (!form.purposeOfHire)
      newErrors.purposeOfHire = "Purpose of hire is required.";
    if (!form.termsAndCondition)
      newErrors.termsAndCondition = "You must accept the terms and conditions.";
    if (!roomDetails.id) newErrors.roomID = "Room ID missing.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const data = {
      franchiseeAdminID: roomDetails?.franchiseeAdminID,
      roomEventID: roomDetails?.eventType,
      roomID: roomDetails?.id,
      roomPackageID: bookingFormData?.pkg?.id,
      bookingStartDateTime: bookingFormData?.startDateTime,
      bookingEndDateTime: bookingFormData?.endDateTime,
      name: form?.name,
      email: form?.email,
      purposeOfHire: form?.purposeOfHire,
      mobileNo: form?.mobileNo,
      termsAndCondition: form?.termsAndCondition,
      bookingSlotList: bookingFormData?.bookingSlotList,
    };
    console.log("data====>", data);
    try {
      const action = await dispatch(roomBooking(JSON.stringify(data)));
      console.log("Booking action dispatched:", action);
      if (action.payload?.type === "success") {
        const response = action.payload.data;
        if (response && response.stripsessionurl) {
          window.location.href = response.stripsessionurl;
        }
      } else if (action.payload?.type === "rejected" || action.error) {
        // Error logic
        setErrors({
          api:
            action.payload?.message ||
            action.error?.message ||
            "Booking failed.",
        });
      }
    } catch (error) {
      // Show API error message if available
      setErrors({ api: error?.message || "Booking failed. Please try again." });
    }
  };

  const taxesPercentage = Number(roomDetails?.taxes) || 0; // taxes as percentage
  const discountPercentage = Number(roomDetails?.discountPercentage) || 0;

  const roomCost = bookingFormData?.pkg?.amount;
  const discount = +((roomCost * discountPercentage) / 100).toFixed(2);
  const taxes = +((roomCost * taxesPercentage) / 100).toFixed(2);
  const total = +(roomCost - discount + taxes).toFixed(2);

  const formatExactISOString = (isoString) => {
    const [datePart, timePart] = isoString.split("T");
    const [year, month, day] = datePart.split("-");
    const [hourStr, minuteStr] = timePart.split(":");

    const hour = parseInt(hourStr, 10);
    const minute = minuteStr;

    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthName = monthNames[parseInt(month, 10) - 1];

    return `${day} ${monthName} ${year} ${hour12}:${minute} ${ampm}`;
  };

  return (
    <Container className="bookingbg">
      <Row>
        <Col lg={8}>
          <Row className="bookhead justify-content-center">
            <Col md={4}>
              <div className="bookroomimg">
                <img
                  src={imgSrc}
                  alt={bookingFormData?.roomName}
                  className="room-image"
                  onError={() => setImgSrc(noImage)}
                />
              </div>
            </Col>
            <Col md={8} className="setborderbo">
              <div className="bookingheadtext">
                <h3>{bookingFormData?.roomName?.toUpperCase()}</h3>
                <p>{roomDetails?.location || "Moscow, Russia"}</p>
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
                <Form>
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
                        {errors.name && (
                          <div className="text-danger mt-1">{errors.name}</div>
                        )}
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
                        {errors.email && (
                          <div className="text-danger mt-1">{errors.email}</div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-4 g-3">
                    <Col md={12}>
                      <Form.Label>Phone Number</Form.Label>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Form.Select
                          name="countryCode"
                          value={form.countryCode}
                          onChange={handleChange}
                          style={{ width: "30%" }}
                        >
                          <option value="+44">+44</option>
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
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
                      {errors.mobileNo && (
                        <div className="text-danger mt-1">
                          {errors.mobileNo}
                        </div>
                      )}
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
                        {errors.purposeOfHire && (
                          <div className="text-danger mt-1">
                            {errors.purposeOfHire}
                          </div>
                        )}
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
                    {errors.termsAndCondition && (
                      <div className="text-danger mt-1">
                        {errors.termsAndCondition}
                      </div>
                    )}
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
          </Row>
        </Col>

        <Col lg={4}>
          <div className="p-3">
            <h5 className="mb-3 border-bottom pb-2 fw-bold">
              YOUR BOOKING DETAILS
            </h5>

            <div className="d-flex justify-content-between mb-4">
              <div>
                <strong style={{color: "#354259"}}>Room Name</strong>
                <div className="numbertext">
                  {roomDetails?.roomName ? roomDetails?.roomName : "--"}
                </div>
              </div>
              <div className="text-end">
                <strong style={{color: "#354259"}}>Package Name</strong>
                <div className="numbertext">
                  {bookingFormData?.pkg?.roomPackageName
                    ? bookingFormData?.pkg?.roomPackageName
                    : "--"}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between mb-4">
              <div>
                <strong style={{color: "#354259"}}>Interval</strong>
                <div className="numbertext">
                  {bookingFormData?.pkg?.interval
                    ? `${bookingFormData?.pkg?.interval} houre`
                    : "--"}
                </div>
              </div>
              <div className="text-end">
                <strong style={{color: "#354259"}}>Amount</strong>
                <div className="numbertext">
                  {bookingFormData?.pkg?.amount
                    ? bookingFormData?.pkg?.amount
                    : "--"}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between mb-4">
              <div>
                <strong style={{ color: "#354259" }}>Start Time</strong>
                <div className="numbertext">
                  {bookingFormData.startDateTime
                    ? (() => {
                        const formatted = formatExactISOString(
                          bookingFormData.startDateTime
                        );
                        const [date, time] =
                          formatted.split(/ (?=\d{1,2}:\d{2} )/);
                        return (
                          <>
                            <span style={{ fontWeight: "600" }}>{date}</span>
                            <br />
                            <span style={{ fontWeight: "600" }}>{time}</span>
                          </>
                        );
                      })()
                    : "--"}
                </div>
              </div>
              <div className="text-end">
                <strong style={{ color: "#354259" }}>End Time</strong>
                <div className="numbertext">
                  {bookingFormData.endDateTime
                    ? (() => {
                        const formatted = formatExactISOString(
                          bookingFormData.endDateTime
                        );
                        const [date, time] =
                          formatted.split(/ (?=\d{1,2}:\d{2} )/);
                        return (
                          <>
                            <span style={{ fontWeight: "600" }}>{date}</span>
                            <br />
                            <span style={{ fontWeight: "600" }}>{time}</span>
                          </>
                        );
                      })()
                    : "--"}
                </div>
              </div>
            </div>
            <hr />

            <h6 className="mb-3 fw-bold">CHARGES</h6>
            <div className="d-flex justify-content-between mb-2">
              <strong style={{color: "#354259"}} >Room Cost</strong>
              <span className="pricetext">£ {roomCost.toFixed(2)}</span>
            </div>
            {discountPercentage > 0 && (
              <div className="d-flex justify-content-between mb-2">
                <span>Discount ({discountPercentage}%)</span>
                <span className="pricetext text-success">
                  -£ {discount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="d-flex justify-content-between mb-2">
              <strong style={{color: "#354259"}}>Taxes & Fees ({taxesPercentage}%)</strong>
              <span className="pricetext">£ {taxes.toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-4">
              <strong>GRAND TOTAL</strong>
              <strong className="pricetext">£ {total.toFixed(2)}</strong>
            </div>

            <Button
              variant="danger"
              className="mb-2 w-100"
              onClick={() => {
                navigate(-1, { state: bookingFormData });
              }}
            >
              Go Back
            </Button>
            <Button
              type="submit"
              variant="dark"
              className="w-100 py-3"
              onClick={handlePayment}
            >
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
