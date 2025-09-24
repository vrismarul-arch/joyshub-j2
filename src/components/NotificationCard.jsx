import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import "./NotificationCard.css";

export default function NotificationCard({
  status = "success",
  title,
  message,
  buttonText = "OK",
  onClick,
  duration = 4000,
}) {
  const [open, setOpen] = useState(false);
  const isSuccess = status === "success";

  useEffect(() => {
    setOpen(true);
    const timer = setTimeout(() => {
      setOpen(false);
      if (onClick) onClick(); // auto-close callback
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClick]);

  return (
    <Modal
      open={open}
      closable={false}
      footer={null}
      centered
      width={340} // 👈 shrink width
      onCancel={() => {
        setOpen(false);
        if (onClick) onClick();
      }}
      className={`notif-modal ${isSuccess ? "success" : "error"}`}
    >
      <div className="notif-header">
        <span className="notif-icon">
          {isSuccess ? (
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          ) : (
            <CloseCircleTwoTone twoToneColor="#ff4d4f" />
          )}
        </span>
        <h3 className="notif-title">{title}</h3>
      </div>

      <p className="notif-message">{message}</p>

      <div className="notif-footer">
        <Button type={isSuccess ? "primary" : "default"} onClick={onClick} block>
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
}
