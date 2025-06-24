import { URLS } from '../api/Urls';

const PackageCard = ({ packages }) => {
  console.log('Packages:', packages);
  return (
    <div className="package-grid">
      {packages?.map(pkg => (
        <div className="package-card">
          <img src={pkg.roomPackageImagePath ? URLS.Image_Url + pkg.roomPackageImagePath[0].imagePath : ''} alt={pkg.roomPackageName} className="package-img" />
          <h3>{pkg.roomPackageName}</h3>
          <p>{pkg.description}</p>
          <p><strong>{pkg.interval} - {pkg.amount}</strong></p>
          <button className="book-btn">
            {"Book Now"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PackageCard;
