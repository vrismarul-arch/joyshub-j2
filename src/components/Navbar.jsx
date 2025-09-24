import { useNavigate } from "react-router-dom";
import { Avatar, Dropdown, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const items = [
    {
      key: "login",
      label: "Admin Login",
      onClick: () => navigate("/admin/login"),
    }
  ];

  return (
    <nav className="navbar">
      {/* Logo left */}
      <div className="navbar-left">
        <img src="logo.png" alt="Zenzones Logo" className="logo-img" />
      </div>

      {/* Right side */}
      <div className="navbar-right">
        <a href="tel:8015147656" className="phone-number">
          8015147656
        </a>

        {/* Ant Design Avatar Dropdown */}
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <Space>
            <Avatar size="large" icon={<UserOutlined />} />
          </Space>
        </Dropdown>
      </div>
    </nav>
  );
}
