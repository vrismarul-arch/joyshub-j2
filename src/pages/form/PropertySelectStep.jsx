import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import './PropertySelectStep.css';

// Data for the property options
const propertyOptions = [
{
  key: "3BHK_SingleRoom",
  title: "Single Sharing Room",
  description: "Compact 1 bedroom unit",
  price: "₹ 12,000 per bed",
  availableBeds: 1,}  
];

export default function PropertySelectStep({ onSelect, onNext, onBack, selected }) {
  const [selectedKey, setSelectedKey] = useState(selected || null);

  const handleSelect = (key) => {
    setSelectedKey(key);
    onSelect(key);

    // Fire FB Pixel event
    if (typeof fbq !== "undefined") {
      fbq('track', 'CustomizeProduct', {
        property_type: key
      });
    }

    onNext();
  };

  return (
    <div className="property-step">
      <div className="property-nav">
        <button className="nav-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>
      </div>
      <div className="property-list">
        {propertyOptions.map((prop) => (
          <button
            key={prop.key}
            type="button"
            className={`property-card ${selectedKey === prop.key ? 'selected' : ''}`}
            onClick={() => handleSelect(prop.key)}
          >
            <div className="property-info">
              <h3 className="property-title">{prop.title}</h3>
              <p className="property-desc">{prop.description}</p>
            </div>
            <div className="price-info">
              <span className="regular-price">RentAmount: {prop.price}</span>
<span className="peak-price">Available Beds: {prop.availableBeds}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
