  import { useState } from "react";
  import { Form, Input, DatePicker, Button, Select, Card } from "antd";
  import { api } from "../api/api";
  import "./FormPage.css";
  import NotificationCard from "../components/NotificationCard";

  export default function FormPageMobile({ onSuccess }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const onFinish = async (values) => {
      setLoading(true);
      try {
        const payload = {
          name: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber,
          dateTime: values.dateTime.startOf('day').toISOString(), // store date only
          propertyType: values.propertyType,
          urgent: values.urgent,
          notes: values.notes || "",
        };

        const response = await api.post("/api/entries/add", payload);
        form.resetFields();

        setNotification({
          status: "success",
          title: "Booking Successful!",
          message: response.data.message,
          buttonText: "OK",
          onClick: () => {
            setNotification(null);
            if (onSuccess) onSuccess();
          },
        });
      } catch (error) {
        console.error(error);
        setNotification({
          status: "error",
          title: "Booking Failed",
          message: "Please try again later.",
          buttonText: "Retry",
          onClick: () => setNotification(null),
        });
      } finally {
        setLoading(false);
      }
    };

    if (notification) return <NotificationCard {...notification} />;

    return (
      <div className="mobile-form-container">
        <Card className="glass-card-mobile">
          <h2 className="form-title-mobile">Plan Your Stay with Zenova</h2>
          <p>Tell us your preferred date, and our team will confirm availability</p>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="glass-form-mobile"
          >
            {/* Name */}
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Enter your name" }]}
            >
              <Input placeholder="Your full name" />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: "email", message: "Enter a valid email" }]}
            >
              <Input placeholder="Your email address" />
            </Form.Item>

            {/* Phone */}
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[{ required: true, message: "Enter phone number" }]}
            >
              <Input placeholder="10-digit phone number" />
            </Form.Item>

            {/* Date only */}
            <Form.Item
              label="Date"
              name="dateTime"
              rules={[{ required: true, message: "Select a date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            {/* Property Type */}
            <Form.Item
              label="Property Type"
              name="propertyType"
              rules={[{ required: true, message: "Select property type" }]}
            >
              <Select placeholder="Select sharing type">
                <Select.Option value="1single sharing">1 Single Sharing</Select.Option>
                <Select.Option value="2sharing">2 Sharing</Select.Option>
                <Select.Option value="3sharing">3 Sharing</Select.Option>
                <Select.Option value="4sharing">4 Sharing</Select.Option>
              </Select>
            </Form.Item>

            {/* Urgent Booking */}
            <Form.Item
              label="Urgent Booking"
              name="urgent"
              initialValue={false}
            >
              <Select>
                <Select.Option value={true}>Yes, urgent</Select.Option>
                <Select.Option value={false}>No, normal</Select.Option>
              </Select>
            </Form.Item>

            {/* Notes */}
            <Form.Item label="Notes" name="notes">
              <Input.TextArea rows={3} placeholder="Additional notes (optional)" />
            </Form.Item>

            {/* Submit */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              > 
                Submit Booking
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
