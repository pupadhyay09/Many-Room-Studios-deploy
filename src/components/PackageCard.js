import React from 'react';
import { URLS } from '../api/Urls';

const PackageCard = ({ packages,onClickBookNow }) => {
  return (
    <div className="package-grid">
      {packages?.map(pkg => (
        <div className="package-card" key={pkg.id || pkg.roomPackageName}>
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
            <p className="package-desc">{pkg.description}</p>
            <p className="package-price">
              <strong>{pkg.interval} - ₹{pkg.amount}</strong>
            </p>
            <button className="book-btn" onClick={() => { onClickBookNow(pkg.id) }}>
            {"Book Now"}
          </button>
          </div>
</div>
      ))}
    </div>
  );
};

export default PackageCard;
