import React, { useEffect, useRef, useState } from 'react';
import { URLS } from '../api/Urls';

const PackageCard = ({ packages, onClickBookNow }) => {
  const [expandedId, setExpandedId] = useState(null);
  const descRefs = useRef({}); // Store multiple refs
  const [overflowMap, setOverflowMap] = useState({});

  useEffect(() => {
    const map = {};
    packages?.forEach(pkg => {
      const el = descRefs.current[pkg.id];
      if (el) {
        map[pkg.id] = el.scrollHeight > el.clientHeight;
      }
    });
    setOverflowMap(map);
  }, [packages]);

  return (
    <div className="row">
      {packages?.map(pkg => {
        const isExpanded = expandedId === pkg.id;
        const isOverflowing = overflowMap[pkg.id];

        return (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={pkg.id || pkg.roomPackageName}>
            <div className="package-card">
              <div className="img-wrapper">
                <img
                  src={
                    pkg.roomPackageImagePath
                      ? URLS.Image_Url + pkg.roomPackageImagePath[0].imagePath
                      : ''
                  }
                  alt={pkg.roomPackageName}
                  className="package-img"
                />
              </div>
              <div className="package-content">
                <h3 className="package-title">{pkg.roomPackageName}</h3>

                <div >
                  <p
                    ref={(el) => (descRefs.current[pkg.id] = el)}
                    className={`package-desc ${isExpanded ? 'expanded' : ''}`}
                  >
                    {pkg.description}
                  </p>
                  {/* {isOverflowing && ( */}
                  <button
                    className="toggle-button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : pkg.id)
                    }
                  >
                    {isOverflowing ? isExpanded ? 'Less' : 'More' : ''}
                  </button>
                  {/* )} */}
                  </div>

                  <p className="package-price">
                    <strong>{pkg.interval}hr</strong>
                  </p>
                  <p className="package-price">
                    <strong>£{pkg.amount}</strong>
                  </p>
                  <button
                    className="book-btn"
                    onClick={() => onClickBookNow(pkg)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
            );
      })}
          </div>
        );
      };

      export default PackageCard;
