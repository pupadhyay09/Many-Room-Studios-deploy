import React from "react";

export const Dropdown = ({ label, options, value, onChange }) => {
  return (
    <div className="input-group">
      <label>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        <option value="">Select</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};


export const EventDropdown = ({ label, options, value, onChange }) => {
  return (
    <div className="input-group">
      <label>{label}</label>
      <select value={value} onChange={e => {
        console.log('e.target.value===>', e.target.value);
        onChange(e.target.value)
      }}>
        <option value="0">Select</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
};

