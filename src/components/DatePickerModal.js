import React from "react";

const DatePickerModal = ({ value, onChange }) => {
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="input-group">
      <label className="labeltext">Date</label>
      <input
        type="date"
        value={value}
        min={today}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};

export default DatePickerModal;
