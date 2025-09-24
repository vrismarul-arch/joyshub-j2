import React, { useEffect, useState } from "react";
import { Carousel, Drawer, Button, Tooltip, Modal } from "antd";
import { Phone, Wifi, Coffee, Zap, Car, ArrowLeft } from "lucide-react";
import { EyeOutlined } from "@ant-design/icons";
import FormPageMobile from "../FormPage";
import "./PropertyDetailsStep.css";

export default function PropertyDetailsStep({ selectedProperty, onBack }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [showBookingBar, setShowBookingBar] = useState(true);

  let lastScrollY = 0;

  // Handle scroll for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowBookingBar(false); // scrolling down
      } else {
        setShowBookingBar(true); // scrolling up
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!selectedProperty) return;
    setPreviewImage(selectedProperty.images[0]);
  }, [selectedProperty]);

  if (!selectedProperty) return <p>No property selected.</p>;

  const openImagePreview = (img) => {
    setPreviewImage(img);
    setImagePreviewOpen(true);
  };

  return (
    <div className="property-details-step">
      {/* Back Button */}
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={18} /> Back
      </button>

      {/* Carousel */}
      <div className="property-carousel-wrapper">
        <Carousel autoplay dots>
          {selectedProperty.images.map((img, idx) => (
            <div key={idx} className="carousel-slide">
              <img
                src={img}
                alt={`${selectedProperty.title}-${idx}`}
                className="carousel-image"
                onClick={() => openImagePreview(img)}
              />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Info Card */}
      <div className="property-info-card">
        <p className="property-title">{selectedProperty.title}</p>
        <Tooltip title="View Details">
          <Button
            type="primary"
            shape="circle"
            icon={<EyeOutlined />}
            onClick={() => setDrawerOpen(true)}
            className="view-icon-btn"
          />
        </Tooltip>
      </div>

      {/* Price & Availability */}
      <div className="price-section">
        <div>
          <strong>Rent per Bed:</strong> {selectedProperty.rentAmount}
        </div>
        <div>
          <strong>Available Beds:</strong> {selectedProperty.availableBeds}
        </div>
        <div>
          <strong>AC:</strong> {selectedProperty.ac ? "Yes" : "No"}
        </div>
      </div>

      {/* Drawer for Property Details */}
      <Drawer
        placement="bottom"
        height="75%"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        className="details-drawer"
        title="Property Details"
      >
        <p className="property-short-desc">{selectedProperty.description}</p>

        {/* Amenities */}
        <div className="amenities-section">
          <h4>Amenities:</h4>
          <ul>
            {selectedProperty.amenities.map((item, idx) => {
              let icon = null;
              switch (item) {
                case "Wi-Fi":
                  icon = <Wifi size={16} />;
                  break;
                case "AC":
                  icon = <Zap size={16} />;
                  break;
                case "TV":
                  icon = <EyeOutlined style={{ fontSize: 16 }} />;
                  break;
                case "Parking":
                  icon = <Car size={16} />;
                  break;
                case "Kitchen Access":
                  icon = <Coffee size={16} />;
                  break;
                default:
                  icon = null;
              }
              return (
                <li
                  key={idx}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  {icon} <span>{item}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Booking Info */}
        <div className="booking-info">
          <p>
            <strong>Advance:</strong> {selectedProperty.advance}
          </p>
          <p>
            <strong>Notice Period:</strong> {selectedProperty.notice}
          </p>
          <p>
            <strong>Lock-in Period:</strong> {selectedProperty.lockinPeriod}
          </p>
        </div>
      </Drawer>

      {/* Drawer for Image Preview */}
      <Drawer
        placement="bottom"
        height="80%"
        onClose={() => setImagePreviewOpen(false)}
        open={imagePreviewOpen}
        closable={true}
        footer={null}
        className="image-preview-drawer"
      >
        <img
          src={previewImage}
          alt="Preview"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </Drawer>

      {/* Sticky Booking Bar */}
      <div
        className="booking-actions"
        style={{
          transform: showBookingBar ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <a href="tel:8015147656" className="call-btn">
          <Phone size={18} /> Call Now
        </a>
        <Button
          type="primary"
          className="book-now-btn"
          onClick={() => setFormModalOpen(true)}
        >
          Enquiry
        </Button>
      </div>

      {/* Modal for FormPageMobile */}
      <Modal
        open={formModalOpen}
        onCancel={() => setFormModalOpen(false)}
        footer={null}
        width={600}
        bodyStyle={{ padding: 0 }}
      >
        <FormPageMobile onSuccess={() => setFormModalOpen(false)} />
      </Modal>
    </div>
  );
}
