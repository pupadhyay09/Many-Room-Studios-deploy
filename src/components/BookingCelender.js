import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import images from "../assets/images/Images";
import { FaClock } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { GrFormNextLink } from "react-icons/gr";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAvailableSlots } from "../redux/slices/rooms";
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";
import TimeEditModal from "./TimeEditModal";

const BookingCalendar = ({ availableSlots }) => {
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [selectedDates, setSelectedDates] = useState([]); // Make it an array
  const [selectedSlotsByDate, setSelectedSlotsByDate] = useState({}); // { '2025-06-04': [slotId1, slotId2] }
  const [currentDate, setCurrentDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState([]);
  const [endTime, setEndTime] = useState("");
  const [people, setPeople] = useState("");
  const [eventType, setEventType] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [visibleStep, setVisibleStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [bookings, setBookings] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const navigate = useNavigate();
  const [editModalIndex, setEditModalIndex] = useState(null);
  const { roomDetails } = useSelector((state) => state.rooms);
  const dispatch = useDispatch();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const to12HourFormat = (time24) => {
    const [hour, minute] = time24.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };
  const formatTimeRange = (range) => {
    const [start, end] = range.split("-");
    return `${to12HourFormat(start)} - ${to12HourFormat(end)}`;
  };

  const handleDateSelect = async (date) => {
    if (roomDetails?.id) {
      const dateKey = formatDate(date);
      await dispatch(
        getAvailableSlots({ id: roomDetails.id, bookingDate: dateKey })
      );
    }
    setCurrentDate(date);
  };

  const handleTimeSelect = (dateKey, slot) => {
    setSelectedSlotsByDate((prev) => {
      const prevSlots = prev[dateKey] || [];
      const isAlreadySelected = prevSlots.some((s) => s.id === slot.id);
      const updatedSlots = isAlreadySelected
        ? prevSlots.filter((s) => s.id !== slot.id) // Deselect
        : [...prevSlots, slot]; // Select

      const newSelectedSlots = { ...prev, [dateKey]: updatedSlots };

      if (updatedSlots.length === 0) {
        delete newSelectedSlots[dateKey];
        setSelectedDates((prevDates) =>
          prevDates.filter((d) => formatDate(d) !== dateKey)
        );
      } else {
        setSelectedDates((prevDates) => {
          const isDateSelected = prevDates.some(
            (d) => formatDate(d) === dateKey
          );
          return isDateSelected ? prevDates : [...prevDates, new Date(dateKey)];
        });
      }

      return newSelectedSlots;
    });
  };

  const handleNext = () => {
    goToStep(3);
  };

  const goBack = () => {
    if (step > 1) {
      goToStep(step - 1);
    }
  };

  const goToStep = (newStep) => {
    setTransitioning(true);
    setTimeout(() => {
      setVisibleStep(newStep);
      setTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    setStep(visibleStep);
  }, [visibleStep]);

  useEffect(() => {
    const times = [];
    for (let i = 0; i < 25; i++) {
      const hour = 9 + Math.floor(i / 2);
      const minute = (i % 2) * 30;
      const time = `${hour.toString().padStart(2, "0")}:${
        minute === 0 ? "00" : "30"
      }`;
      times.push(time);
    }

    const mockData = [
      {
        date: "2025-06-04",
        startTimes: times,
        qty: 2,
        unit: 10,
        price: 20,
      },
    ];

    setBookings(mockData);
  }, []);

  const handleDeleteDateRow = (dateKey) => {
    setSelectedSlotsByDate((prev) => {
      const updated = { ...prev };
      delete updated[dateKey];
      return updated;
    });
    setSelectedDates((prev) => prev.filter((d) => formatDate(d) !== dateKey));
  };

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!selectedDates || selectedDates.length === 0)
      newErrors.selectedDate = "Please select at least one date.";

    const missingTimes = selectedDates.some(
      (date) => !selectedSlotsByDate[formatDate(date)]
    );
    if (missingTimes)
      newErrors.selectedTime = "Please select time for each date.";

    if (!people) newErrors.people = "Number of people is required.";
    if (Number(people) > Number(roomDetails?.capacity)) {
      newErrors.people = `Number of people cannot exceed room capacity (${roomDetails?.capacity})`;
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const eventTypeObj = roomDetails?.roomEventsList?.find(
      (opt) => String(opt.value) === String(eventType)
    );
    const eventTypeName = eventTypeObj ? eventTypeObj.text : "";

    const bookingSlotList = selectedDates.flatMap((date) => {
      const dateKey = formatDate(date);
      const slots = selectedSlotsByDate[dateKey] || [];

      return slots.map((slot) => {
        const [start, end] = slot.name.split("-");
        const startDate = new Date(`${dateKey}T${start}:00`);
        const endDate = new Date(`${dateKey}T${end}:00`);
        return {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          roomSlotID: slot.id,
        };
      });
    });

    const bookingFormData = {
      roomID: roomDetails?.id,
      dates: bookingSlotList,
      gridDates: selectedSlotsByDate,
      people: Number(people),
      eventType,
      eventTypeName,
      franchiseeAdminID: roomDetails?.franchiseeAdminID,
      roomImagePath: roomDetails?.roomImagePath,
      roomName: roomDetails?.roomName,
      location: roomDetails?.location,
      hourlyPrice: roomDetails?.hourlyPrice,
      discountPercentage: roomDetails?.discountPercentage,
      taxes: roomDetails?.vatPercentage,
      ownership: roomDetails.ownershipTypeName,
    };

    localStorage.setItem("bookingFormData", JSON.stringify(bookingFormData));
    navigate("/booking", { state: bookingFormData });
  };

  console.log("selectedSlotsByDate===>", selectedSlotsByDate);

  const selectedSlotsByDategrid = Object.entries(selectedSlotsByDate).map(
    ([date, slots]) => ({
      date,
      startTimes: slots.map((slot) => slot.name),
      qty: slots.length,
      unit: "Slot(s)", // or your actual unit if dynamic
      price: (slots.length * 100).toFixed(2), // Example logic
    })
  );
  return (
    <Container className="booking-wrapper">
      <Row className="booking-card">
        <Col md={5} className="left-panel">
          <Row>
            <Col md={1}>
              {step === 3 && (
                <IoMdArrowRoundBack
                  variant="link"
                  className="back-button p-0 mb-3"
                  onClick={goBack}
                />
              )}
            </Col>
            <Col md={11}>
              <img src={images.logo} alt="celender logo" className="mb-3" />
              <p className="mb-0 roomtext">Many Rooms Studio</p>
              <h1>INTERVAL BOOKING</h1>
              <div className="mt-3">
                <p className="clockicontext">
                  <FaClock /> 30 min
                </p>
                <h3 className="mb-0">Deluxe Studio Room</h3>
              </div>
              <p>
                Experience comfort and luxury in our Deluxe Studio Room,
                designed for relaxation with modern amenities and elegant style.
              </p>
            </Col>
          </Row>
        </Col>

        <Col md={7} className="right-panel">
          {step < 3 && (
            <div className="date-time-container d-flex">
              <div className="custom-booking-datepicker">
                <h4 className="ms-3">Select Dates</h4>
                <DatePicker
                  selected={null}
                  onChange={handleDateSelect}
                  highlightDates={selectedDates}
                  includeDates={(() => {
                    const dates = [];
                    const today = new Date();
                    const endDate = new Date(today);
                    endDate.setMonth(today.getMonth() + 3);

                    for (
                      let d = new Date(today);
                      d <= endDate;
                      d.setDate(d.getDate() + 1)
                    ) {
                      dates.push(new Date(d));
                    }
                    return dates;
                  })()}
                  inline
                  minDate={new Date()}
                  dayClassName={(date) =>
                    selectedDates.some(
                      (d) => d.toDateString() === date.toDateString()
                    )
                      ? "selected-multi"
                      : ""
                  }
                />
              </div>

              <div
                className={`fade-step w-100 ${transitioning ? "fade-out" : ""}`}
              >
                {currentDate && (
                  <div className="time-select-wrapper">
                    <div className="time-grid time-grid-scrollable">
                      {availableSlots.map((slot) => {
                        const dateKey = formatDate(currentDate);
                        const isSelected = selectedSlotsByDate[dateKey]?.some(
                          (s) => s.id === slot.id
                        );

                        return (
                          <Button
                            key={slot.id}
                            variant={isSelected ? "primary" : "outline-primary"}
                            className="time-btn py-3 w-100 mb-2"
                            onClick={() => handleTimeSelect(dateKey, slot)}
                          >
                            {formatTimeRange(slot.name)}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {selectedSlotsByDate &&
                  Object.keys(selectedSlotsByDate).length > 0 && (
                    <div className="d-flex justify-content-end mt-3">
                      <Button
                        onClick={handleNext}
                        className="next-btn py-3 w-100 me-4"
                        variant="success"
                      >
                        Next <GrFormNextLink />
                      </Button>
                    </div>
                  )}
              </div>
            </div>
          )}

          {step === 3 && (
            <Form className="form-grid" onSubmit={handleSubmit}>
              <Row className="justify-content-between">
                <Col lg={12}>
                  <h5 className="mb-3">Booking Summary</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead className="table-dark">
                        <tr>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Qty</th>
                          <th>Unit</th>
                          <th>Price</th>
                          <th>Manage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedSlotsByDategrid.map((booking, index) => (
                          <tr key={index}>
                            <td>{booking.date}</td>
                            <td>
                              <div
                                style={{
                                  maxHeight: "37px",
                                  overflowY: "auto",
                                }}
                                className="time-scroll-wrapper"
                              >
                                {booking.startTimes.map((time, index) => (
                                  <div key={index} className="mb-1">
                                    <span className="py-1 text-nowrap d-inline-block w-100">
                                      {formatTimeRange(time)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td>{booking.qty}</td>
                            <td>{booking.unit}</td>
                            <td>{booking.price}</td>
                            <td>
                              <div className="set-table-btn d-flex gap-2">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => setEditModalIndex(index)}
                                >
                                  <FaEdit size={16} />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteDateRow(booking.date)
                                  }
                                >
                                  <FaTrash size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Col>
              </Row>

              <div className="form-btn-text">
                <p className="text-center">
                  By proceeding, you confirm that you have read and agree to{" "}
                  <br />
                  <span className="text-primary">
                    Many Rooms Studio Terms of Use{" "}
                  </span>{" "}
                  and <span className="text-primary">Privacy Notice.</span>
                </p>
                <Button type="submit" className="submit-btn-form mt-2">
                  Schedule Event
                </Button>
              </div>
            </Form>
          )}
        </Col>
      </Row>

      <div>
        {editModalIndex !== null && (
          <TimeEditModal
            show={true}
            onHide={() => setEditModalIndex(null)}
            booking={selectedSlotsByDategrid[editModalIndex]}
            formatTimeRange={formatTimeRange}
            onSave={(date, newTimes) => {
              setSelectedSlotsByDate((prev) => ({
                ...prev,
                [date]: newTimes.map((t, i) => ({
                  id: `${date}-${t}-${i}`,
                  name: t,
                })),
              }));
            }}
          />
        )}
      </div>
    </Container>
  );
};

export default BookingCalendar;
