import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import images from "../assets/images/Images";
import { FaClock } from 'react-icons/fa';
import { IoMdArrowRoundBack } from "react-icons/io";
import { GrFormNextLink } from "react-icons/gr";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAvailableSlots } from "../redux/slices/rooms";

function to12HourFormat(time24) {
    // time24: "HH:mm"
    const [hour, minute] = time24.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

const BookingCalendar = ({ availableSlots }) => {
    const location = useLocation();
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState(""); // Selected Date
    const [selectedTime, setSelectedTime] = useState(""); // Start Time
    const [endTime, setEndTime] = useState("");           // End Time
    const [people, setPeople] = useState("");             // Number of People
    const [eventType, setEventType] = useState(0);       // Event Type
    const [transitioning, setTransitioning] = useState(false);
    const [visibleStep, setVisibleStep] = useState(1);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { roomDetails } = useSelector((state) => state.rooms);
    const dispatch = useDispatch();

    const timeOptions = Array.isArray(availableSlots)
        ? availableSlots.map(slot => slot.name.padStart(2, "0") + ":00")
        : [];

    const handleDateSelect = (date) => {
        console.log("Selected date:", date);
        setSelectedDate(date);
        goToStep(2);
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleNext = () => {
        if (selectedTime) {
            goToStep(3);
        }
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
        const preFeildData = localStorage.getItem("bookingFormData");
        if (preFeildData) {
            const formData = JSON.parse(preFeildData);
            setStep(3);
            if (formData.date) {
                setSelectedDate(new Date(formData.date + "T00:00:00Z"));
            }
            if (formData.startTime) {
                // Only take "HH:mm" part if full datetime string
                let start = formData.startTime;
                if (start.length > 5 && start.includes("T")) {
                    start = start.split("T")[1].slice(0, 5);
                }
                setSelectedTime(start);
            }
            if (formData.endTime) {
                let end = formData.endTime;
                if (end.length > 5 && end.includes("T")) {
                    end = end.split("T")[1].slice(0, 5);
                }
                setEndTime(end);
            }
            if (formData.people) setPeople(formData.people);
            if (formData.eventType) setEventType(formData.eventType);
        }
    }, [location]);

    useEffect(() => {
        if (selectedDate && roomDetails?.id) {
            const date = new Date(selectedDate);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formatted = `${year}-${month}-${day}`;
            dispatch(getAvailableSlots({ id: roomDetails.id, bookingDate: formatted }));
        }
    }, [selectedDate, roomDetails?.id, dispatch]);

    const handleChange = (setter, field) => (e) => {
        setter(e.target.value);
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = {};

        if (!selectedTime) newErrors.selectedTime = "Start time is required.";
        if (!endTime) newErrors.endTime = "End time is required.";
        if (!people) newErrors.people = "Number of people is required.";
        if (!selectedDate) newErrors.selectedDate = "Please select a date.";
        if (Number(people) > Number(roomDetails?.capacity)) {
            newErrors.people = `Number of people cannot exceed room capacity (${roomDetails?.capacity})`;
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
        const eventTypeObj = roomDetails?.roomEventsList?.find(opt => String(opt.value) === String(eventType));
        console.log("eventTypeObj:", eventTypeObj);
        const eventTypeName = eventTypeObj ? eventTypeObj.text : "";
        console.log("eventTypeName:", eventTypeName);
        // const dateStr = new Date(selectedDate).toISOString().split("T")[0];
        const date = new Date("Wed May 28 2025 00:00:00 GMT+0530");
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formatted = `${year}-${month}-${day}`;

        const startTimestamp = `${formatted}T${selectedTime}:00.000Z`;
        const endTimestamp = `${formatted}T${endTime}:00.000Z`;

        const bookingFormData = {
            roomID: roomDetails?.id,
            startTime: startTimestamp,
            endTime: endTimestamp,
            eventTypeName: eventTypeName,
            people: Number(people),
            eventType: eventType,
            date: formatted,
            franchiseeAdminID: roomDetails?.franchiseeAdminID,
            roomImagePath: roomDetails?.roomImagePath,
            roomName: roomDetails?.roomName,
            location: roomDetails?.location,
            hourlyPrice: roomDetails?.hourlyPrice,
            discountPercentage: roomDetails?.discountPercentage,
            taxes: roomDetails?.vatPercentage,
            ownership: roomDetails.ownershipTypeName
        };
        console.log("Booking Form Data:", bookingFormData);
        localStorage.setItem("bookingFormData", JSON.stringify(bookingFormData));
        // Pass data to Booking page
        navigate("/booking", { state: bookingFormData });
    };

    return (
        <Container className="booking-wrapper">
            <Row className="booking-card">
                <Col md={5} className="left-panel">
                    <Row>
                        <Col md={1}>
                            {step === 3 && (
                                <IoMdArrowRoundBack variant="link" className="back-button p-0 mb-3" onClick={goBack} />
                            )}
                        </Col>
                        <Col md={11}>
                            <img src={images.logo} alt="celender logo" className="mb-3" />
                            <p className="mb-0 roomtext">Many Rooms Studio</p>
                            <h1>INTERVAL BOOKING</h1>
                            <div className="mt-3">
                                <p className="clockicontext"><FaClock /> 30 min</p>
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
                                <h4 className="ms-3">Select a Date</h4>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={handleDateSelect}
                                    inline
                                    dayClassName={(date) =>
                                        date.toDateString() === new Date().toDateString()
                                            ? "today-day"
                                            : undefined
                                    }
                                    minDate={new Date()}
                                />
                            </div>
                            <div className={`fade-step w-100 ${transitioning ? "fade-out" : ""}`}>
                                {selectedDate && (
                                    <div className="time-select-wrapper">
                                        <p>{selectedDate?.toDateString()}</p>
                                        <div className="time-grid time-grid-scrollable">
                                            {timeOptions.map((time) => {
                                                const isSelected = selectedTime === time;
                                                return isSelected ? (
                                                    <div key={time} className="d-flex gap-2">
                                                        <Button
                                                            variant="primary"
                                                            className="time-btn py-3 w-100"
                                                            onClick={() => handleTimeSelect(time)}
                                                        >
                                                            {to12HourFormat(time)}
                                                        </Button>
                                                        <Button onClick={handleNext} className="next-btn py-3 w-100" variant="success">
                                                            Next <GrFormNextLink />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div key={time}>
                                                        <Button
                                                            variant="outline-primary"
                                                            className="time-btn py-3 w-100"
                                                            onClick={() => handleTimeSelect(time)}
                                                        >
                                                            {to12HourFormat(time)}
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <>
                            <Form className="form-grid" onSubmit={handleSubmit}>
                                <Row className="justify-content-between">
                                    <Col md={5}>
                                        <Form.Group className="mb-4">
                                            <Form.Label>Start Time</Form.Label>
                                            <Form.Select
                                                value={selectedTime}
                                                onChange={e => {
                                                    setSelectedTime(e.target.value);
                                                    setEndTime(""); // Reset end time if start time changes
                                                    setErrors(prev => ({ ...prev, selectedTime: "" }));
                                                }}
                                            >
                                                <option value="">Select Start Time</option>
                                                {timeOptions.map((time) => (
                                                    <option key={time} value={time}>{to12HourFormat(time)}</option>
                                                ))}
                                            </Form.Select>
                                            {errors.selectedTime && (
                                                <div className="text-danger mt-1">{errors.selectedTime}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={5}>
                                        <Form.Group className="mb-4">
                                            <Form.Label>End Time</Form.Label>
                                            <Form.Select
                                                value={endTime}
                                                onChange={e => {
                                                    setEndTime(e.target.value);
                                                    setErrors(prev => ({ ...prev, endTime: "" }));
                                                }}
                                                disabled={!selectedTime}
                                            >
                                                <option value="">Select End Time</option>
                                                {selectedTime &&
                                                    timeOptions
                                                        .filter(time => time > selectedTime)
                                                        .map(time => (
                                                            <option key={time} value={time}>{to12HourFormat(time)}</option>
                                                        ))
                                                }
                                            </Form.Select>
                                            {errors.endTime && <div className="text-danger mt-1">{errors.endTime}</div>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={5}>
                                        <Form.Group className="mb-4">
                                            <Form.Label>Number of People max({roomDetails?.capacity})</Form.Label>
                                            <Form.Control
                                                placeholder="Number"
                                                type="number"
                                                value={people}
                                                max={roomDetails?.capacity?.toString()}
                                                onChange={e => {
                                                    let val = e.target.value;
                                                    if (roomDetails?.capacity && Number(val) > Number(roomDetails.capacity)) {
                                                        val = roomDetails.capacity.toString();
                                                    }
                                                    setPeople(val);
                                                    setErrors(prev => ({ ...prev, people: "" }));
                                                }}
                                            />
                                            {errors.people && <div className="text-danger mt-1">{errors.people}</div>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={5}>
                                        <Form.Group className="mb-4">
                                            <Form.Label>Event Type</Form.Label>
                                            <Form.Select
                                                value={eventType}
                                                onChange={handleChange(setEventType, "eventType")}
                                            >
                                                <option value="">Select</option>
                                                {roomDetails?.roomEventsList?.length > 0 && roomDetails?.roomEventsList?.map(opt => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.text}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            {/* No error for eventType, it's optional */}
                                        </Form.Group>
                                    </Col>
                                    <Col md={5}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Selected Date</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={selectedDate ? selectedDate.toDateString() : ""}
                                                readOnly
                                            />
                                            {errors.selectedDate && <div className="text-danger mt-1">{errors.selectedDate}</div>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="form-btn-text">
                                    <p className="text-center">
                                        By proceeding, you confirm that you have read and agree to <br />
                                        <span className="text-primary">Many Rooms Studio Terms of Use </span> and <span className="text-primary">Privacy Notice.</span>
                                    </p>
                                    <Button type="submit" className="submit-btn-form mt-2">
                                        Schedule Event
                                    </Button>
                                </div>
                            </Form>
                        </>
                    )}
                </Col>
            </Row>
        </Container >
    );
};

export default BookingCalendar;