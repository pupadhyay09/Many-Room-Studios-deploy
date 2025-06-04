import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const TimeEditModal = ({
  show,
  onHide,
  onChange,
  booking,
  formatTimeRange,
  availableSlots,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontWeight: 800 }}>Edit Time Slots - {booking.date}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-wrap gap-2">
          {availableSlots.map((slot) => {
            const isSelected = booking?.qty?.some((s) => s.id === slot.id);
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
    </Modal>
  );
};

export default TimeEditModal;
