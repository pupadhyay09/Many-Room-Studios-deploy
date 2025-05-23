import React from "react";
import { Form } from "react-bootstrap";

const TimeSelect = ({ label, value, onChange, minTime }) => {
  console.log('minTime:', minTime);
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type="time"
        value={value}
        min={minTime}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};

export default TimeSelect;

export const CustomTimePicker = ({ value, onChange }) => {
  const { hour = "12", minute = "00", ampm = "AM" } = value || {};

  const handleUpdate = (field, val) => {
    const updated = { hour, minute, ampm, ...value, [field]: val };
    onChange(updated);
  };

  return (
    <div className="d-flex gap-2">
      {/* Hour */}
      <Form.Select
        value={hour}
        onChange={(e) => handleUpdate("hour", e.target.value)}
      >
        {Array.from({ length: 12 }, (_, i) => {
          const h = String(i + 1).padStart(2, "0");
          return <option key={h} value={h}>{h}</option>;
        })}
      </Form.Select>

      {/* Minute */}
      <Form.Select
        value={minute}
        onChange={(e) => handleUpdate("minute", e.target.value)}
      >
        {["00", "15", "30", "45"].map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </Form.Select>

      {/* AM/PM */}
      <Form.Select
        value={ampm}
        onChange={(e) => handleUpdate("ampm", e.target.value)}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </Form.Select>
    </div>
  );
};


