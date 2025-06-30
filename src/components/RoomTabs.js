import React from 'react';

const RoomTabs = ({ tabs, activeTab, onSelect }) => {
  return (
    <div className="room-tabs-wrapper">
      <div className="room-tabs-scroll">
        {tabs?.map(tab => (
          <button
            key={tab.value || tab}
            className={`tab-button ${activeTab === tab.value ? 'active' : ''}`}
            onClick={() => onSelect(tab.value || tab)}
          >
            {tab.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoomTabs;