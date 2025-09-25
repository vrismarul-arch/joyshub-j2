import React from "react";
import "./YesNoStep.css"; // custom styles
import hostel from "./joy.gif"
export default function YesNoStep({ onSelect, onNoClick, selected }) {
  const handleYes = () => {
    onSelect("YES");

    // Fire FB Pixel event for YES
    if (typeof fbq !== "undefined") {
      fbq("track", "Lead"); // ✅ Yes button -> Lead event
    }
  };

  const handleNo = () => {
    onSelect("NO");
    onNoClick();

    // Fire FB Pixel event for NO
    if (typeof fbq !== "undefined") {
      fbq("track", "CompleteRegistration"); // ✅ No button -> another event
    }
  };

  return (
    <div className="yesno-container">
      {/* Illustration / Image */}
      <div className="yesno-illustration">
        <img
          src={hostel}
          alt="Connect"
        />
      </div>

     

      {/* Buttons */}
      <div className="yesno-button-group">
           <button
          className={`yesno-btn yes-btn ${selected === "YES" ? "active" : ""}`}
          onClick={handleYes}
        >
          Yes, Book Now
        </button>
        <button
          className={`yesno-btn no-btn ${selected === "NO" ? "active" : ""}`}
          onClick={handleNo}
        >
          No, Plan Later
        </button>
     
      </div>

      
    </div>
  );
}
