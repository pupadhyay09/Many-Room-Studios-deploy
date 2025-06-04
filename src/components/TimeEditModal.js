import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const TimeEditModal = ({
  show,
  onHide,
  onChange,
  onSave,
  booking,
  formatTimeRange,
  availableSlots,
  selectedSlots = [],
}) => {
  const [selectedTimes, setSelectedTimes] = useState(booking.startTimes || []);

  const handleTimeToggle = (time) => {
    setSelectedTimes((prev) =>
      prev.includes(time)
        ? prev.filter((t) => t !== time)
        : [...prev, time]
    );
  };

  const handleSave = () => {
    onSave(booking.date, selectedTimes);
    onHide();
  };
  console.log("selectedSlots", selectedSlots);

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontWeight: 800 }}>Edit Time Slots - {booking.date}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-wrap gap-2">
          {availableSlots.map((slot) => {
            const isSelected = selectedSlots.some((s) => s.id === slot.id);
            return (
              <Button
                key={slot.id}
                variant={isSelected ? "primary" : "outline-secondary"}
                onClick={() => onChange(booking.date, slot)}
              >
                {formatTimeRange(slot.name)}
              </Button>
            );
          })}
        </div>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default TimeEditModal;
