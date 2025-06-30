import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import images from "../assets/images/Images";
import { FaClock } from "react-icons/fa";
import { GrFormNextLink } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAvailableSlots } from "../redux/slices/rooms";

const BookingCalendar = ({ pkg, onClickBack }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedSlotsByDate, setSelectedSlotsByDate] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [people, setPeople] = useState("");
  const [eventType, setEventType] = useState(0);
  const navigate = useNavigate();
  const { roomDetails, availableSlots } = useSelector((state) => state.rooms);
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
    console.log('date====>', date)
    const dateKey = formatDate(date);
    setCurrentDate(date);
    setSelectedDates([date]);
    setSelectedSlotsByDate({}); // clear previous selection
    if (roomDetails?.id) {
      dispatch(getAvailableSlots({ id: pkg.id, bookingDate: dateKey }));
    }
  };

  const handleTimeSelect = (dateKey, slot) => {
    const isAlreadySelected = selectedSlotsByDate[dateKey]?.[0]?.id === slot.id;
    if (isAlreadySelected) {
      setSelectedSlotsByDate({});
      setSelectedDates([]);
    } else {
      setSelectedSlotsByDate({ [dateKey]: [slot] });
      setSelectedDates([new Date(dateKey)]);
    }
  };

  const handleBooking = () => {
    if (selectedDates.length !== 1) return;
    const date = selectedDates[0];
    const dateKey = formatDate(date);
    const slot = selectedSlotsByDate[dateKey]?.[0];
    if (!slot) return;
    const [start, end] = slot.name.split("-");
    const startDate = `${dateKey}T${start}:00.000Z`;
    const endDate = `${dateKey}T${end}:00.000Z`;

    const bookingFormData = {
      bookingSlotList: [
        {
          startDate,
          endDate,
          roomSlotID: slot.id,
        },
      ],
      startDateTime: startDate,
      endDateTime: endDate,
      gridbookingSlotListByDate: selectedSlotsByDate,
      selectedDates,
      currentDate,
      pkg: pkg
    };
    localStorage.setItem("bookingFormData", JSON.stringify(bookingFormData));
    navigate("/booking", { state: bookingFormData });
  };

  useEffect(() => {
    const preFeildData = localStorage.getItem("bookingFormData");
    if (preFeildData) {
      const formData = JSON.parse(preFeildData);
      if (formData.gridbookingSlotListByDate) {
        setSelectedSlotsByDate(formData.gridbookingSlotListByDate);
      }
      if (formData.selectedDates && Array.isArray(formData.selectedDates)) {
        setSelectedDates(
          formData.selectedDates.map((dateStr) => {
            const dateObj = new Date(dateStr);
            return dateObj;
          })
        );
      }
      setCurrentDate(new Date(formData?.currentDate))
    }
  }, []);


  return (
    <Container className="booking-wrapper">
      <Row className="booking-card">
        <button className="back-btn" onClick={onClickBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg> back
        </button>
        <Col md={5} className="left-panel">
          <img src={images.logo} alt="celender logo" className="mb-3" />
          <p className="mb-0 roomtext">Many Rooms Studio</p>
          <div className="mt-3">
            <p className="clockicontext">
              <FaClock /> 30 min
            </p>
            <h3 className="mb-0">Deluxe Studio Room</h3>
          </div>
          <p>
            Experience comfort and luxury in our Deluxe Studio Room, designed for
            relaxation with modern amenities and elegant style.
          </p>
        </Col>

        <Col md={7} className="right-panel">
          <div className="date-time-container d-flex">
            <div className="custom-booking-datepicker">
              <h4 className="ms-3">Select Date</h4>
              <DatePicker
                selected={currentDate}
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
                openToDate={currentDate}
                dayClassName={(date) => {
                  const isSelected = selectedDates.some(
                    (d) => d.toDateString() === date.toDateString()
                  );
                  return isSelected ? "selected-multi" : "";
                }}
              />
            </div>

            <div className="time-select-wrapper w-100">
              {currentDate && (
                <div className="time-grid time-grid-scrollable">
                  {
                    availableSlots?.length === 0 && (
                      <p className="text-center mt-3">
                        No time slots available for this date.
                      </p>
                    )
                  }

                  {
                    availableSlots?.map((slot) => {
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
              )}

              {Object.keys(selectedSlotsByDate).length > 0 &&
                selectedDates.length === 1 && (
                  <div className="d-flex justify-content-end mt-3">
                    <Button
                      onClick={handleBooking}
                      className="next-btn py-3 w-100 me-xl-4"
                      variant="success"
                    >
                      Next <GrFormNextLink />
                    </Button>
                  </div>
                )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingCalendar;
