import { useState } from "react";
import { api } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { Input, Button, Form, Card, Typography } from "antd";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

export default function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await api.post("/api/admin/login", values);
      toast.success(response.data.message);
      localStorage.setItem("adminToken", response.data.token);
      onLogin();
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
        padding: "20px",
      }}
    >
      <Card
        bordered={false}
        style={{
          maxWidth: 400,
          width: "100%",
          borderRadius: "16px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.15)",
          padding: "50px 30px",
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
        {/* Optional Logo */}
        <div style={{ marginBottom: 20 }}>
          <img
            src="/fav.png" // replace with your logo path
            alt="Logo"
            style={{ width: 100, height: 100, objectFit: "contain" }}
          />
        </div>

        <Title level={3} style={{ marginBottom: "20px" }}>
          Admin Login
        </Title>
        <Text type="secondary">Please enter your credentials to continue</Text>

        <Form layout="vertical" onFinish={handleSubmit} style={{ marginTop: 30 }}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                padding: "12px 0",
                fontSize: "16px",
                borderRadius: "8px",
                background: "linear-gradient(90deg, #4d6e5b 0%, #4d6e5b 100%)",
                border: "none",
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
