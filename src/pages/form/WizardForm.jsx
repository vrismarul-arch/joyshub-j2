import React, { useState } from "react";
import { Card, Modal } from "antd";
import YesNoStep from "./YesNoStep";
import PropertySelectStep from "./PropertySelectStep";
import PropertyDetailsStep from "./PropertyDetailsStep";
import FormPage from "../FormPage";
import "./Wizard.css";

// Import images
import bhk2bed from "../../assets/2bhk/2bbeedroom.jpg";
import bhk2hall from "../../assets/2bhk/2bhall.jpg";
import bhk2washbasin from "../../assets/2bhk/2bwashbasin.jpg";
import bhk2balcony from "../../assets/2bhk/2balcony.jpg";



// Property options
// Property options
const propertyOptions = [
  {
    key: "3BHK_SingleRoom",
    images: [bhk2bed, bhk2hall, bhk2washbasin, bhk2balcony], // you can replace with 3BHK images if available
    title: "Single Room in 3 BHK Flat",
    description: "Single 2-sharing room in a fully furnished 3 BHK apartment.",
    roomType: "2 sharing",
    ac: true, 
    rentAmount: "₹ 12,000 per bed",
    availableBeds: 1,
    amenities: [
      "Teak wood Cot",
      "Mattress",
      "AC",
      "Wardrobe",
      "Geyser",
      "Washing Machine",
      "Refrigerator",
      "Dining Table",
      "Sofa",
      "TV",
      "Wi-Fi",
    ],
    advance: "₹ 12,000 advance",
    notice: "One month notice",
    lockinPeriod: "3 months minimum lock-in period",
    price: "₹ 12,000 / month",
    peak: "₹ 14,000 / month",
    booknow: "http://airbnb.co.in/h/altair-zenova",
  },
];


export default function Wizard() {
  const steps = [
    {
      key: "yesno",
      title: "Start",
      type: "yesno",
      content: "Are you looking to book a stay immediately",
    },
    { key: "property", title: "Property Selection", type: "property" },
    { key: "details", title: "Property Details", type: "details" },
  ];

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  // --- Handlers ---
  const handleYesNo = (val) => {
    setAnswers((prev) => ({ ...prev, yesno: val }));
    if (val === "YES") goNext();
    else handleNoClick();
  };
  const handleNoClick = () => setShowFormModal(true);
  const handlePropertySelect = (key) => {
    const prop = propertyOptions.find((p) => p.key === key);
    setSelectedProperty(prop);
    setAnswers((prev) => ({ ...prev, property: key }));
  };
  const goNext = () => setCurrent((prev) => Math.min(prev + 1, steps.length - 1));
  const goBack = () => setCurrent((prev) => Math.max(prev - 1, 0));
  const onSubmit = () => alert("Submitted: " + JSON.stringify(answers, null, 2));

  const renderStep = () => {
    switch (steps[current].type) {
      case "yesno":
        return (
          <YesNoStep
            onSelect={handleYesNo}
            onNoClick={handleNoClick}
            selected={answers.yesno}
          />
        );
      case "property":
        return (
          <PropertySelectStep
            onSelect={handlePropertySelect}
            onNext={goNext}
            onBack={goBack}
            selected={answers.property}
          />
        );
      case "details":
        return (
          <PropertyDetailsStep
            selectedProperty={selectedProperty}
            onBack={goBack}
            onSubmit={onSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="wizard-container">
      {/* Step card */}
      <Card className="wizard-card">
        {steps[current].content && <h2>{steps[current].content}</h2>}
        {steps[current].des && <p className="step-description">{steps[current].des}</p>}
        {renderStep()}
      </Card>

      {/* Form modal */}
      <Modal
        open={showFormModal}
        onCancel={() => setShowFormModal(false)}
        footer={null}
        width={600}
      >
        <FormPage onSuccess={() => setShowFormModal(false)} />
      </Modal>
    </div>
  );
}
