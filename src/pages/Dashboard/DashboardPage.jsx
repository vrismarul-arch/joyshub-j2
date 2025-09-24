import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { Table, Button, Select, Space, Tabs, Modal, Card, Typography } from "antd";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./DashboardPage.css";

const { Title, Text } = Typography;

// Mobile card component
const MobileEntries = ({ entries, handleStatusUpdate, statusUpdating }) => (
  <Space direction="vertical" style={{ width: "100%" }}>
    {entries.map((entry) => (
      <Card key={entry._id} className="mobile-entry-card">
        <Title level={5}>{entry.name}</Title>
        <div className="field">
          <span className="field-label">Email: </span>
          <span className="field-value">{entry.email}</span>
        </div>
        <div className="field">
          <span className="field-label">Phone: </span>
          <span className="field-value">{entry.phoneNumber}</span>
        </div>
        <div className="field">
          <span className="field-label">Date: </span>
          <span className="field-value">{new Date(entry.dateTime).toLocaleDateString()}</span>
        </div>
        <div className="field">
          <span className="field-label">Property Type: </span>
          <span className="field-value">{entry.propertyType}</span>
        </div>
        <div className="field">
          <span className="field-label">Urgent: </span>
          <span className="field-value">{entry.urgent ? "Yes" : "No"}</span>
        </div>
        <div className="field">
          <span className="field-label">Notes: </span>
          <span className="field-value">{entry.notes || "-"}</span>
        </div>
        <div className="field">
          <span className="field-label">Status: </span>
          <Select
            value={entry.status}
            style={{ width: "100%", marginTop: 8 }}
            onChange={(newStatus) => handleStatusUpdate(entry, newStatus)}
            disabled={statusUpdating}
          >
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="Completed">Completed</Select.Option>
            <Select.Option value="Rejected">Rejected</Select.Option>
          </Select>
        </div>
      </Card>
    ))}
  </Space>
);

export default function DashboardPage({ onLogout }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/entries/all");
      setEntries(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleStatusUpdate = async (entry, newStatus) => {
    setStatusUpdating(true);
    try {
      await api.put(`/api/entries/status/${entry._id}`, { status: newStatus });
      toast.success("Status updated successfully");
      fetchEntries();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    onLogout();
    navigate("/admin/login");
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return toast.error("Not authenticated");

    try {
      const response = await api.get("/api/admin/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      setProfileVisible(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch profile");
    }
  };

  const exportToExcel = () => {
    if (entries.length === 0) return toast.error("No data to export");

    const data = entries.map((entry) => ({
      Name: entry.name,
      Email: entry.email,
      Phone: entry.phoneNumber,
      Date: new Date(entry.dateTime).toLocaleDateString(),
      PropertyType: entry.propertyType,
      Urgent: entry.urgent ? "Yes" : "No",
      Notes: entry.notes || "-",
      Status: entry.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entries");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "entries.xlsx");
    toast.success("Excel file exported");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Date", dataIndex: "dateTime", key: "date", render: (dt) => new Date(dt).toLocaleDateString() },
    { title: "Property Type", dataIndex: "propertyType", key: "propertyType" },
    { title: "Urgent", dataIndex: "urgent", key: "urgent", render: (u) => (u ? "Yes" : "No") },
    { title: "Notes", dataIndex: "notes", key: "notes" },
    { title: "Status", dataIndex: "status", key: "status",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(newStatus) => handleStatusUpdate(record, newStatus)}
          disabled={statusUpdating}
        >
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Completed">Completed</Select.Option>
          <Select.Option value="Rejected">Rejected</Select.Option>
        </Select>
      ),
    },
  ];

  const statusMap = { Enquiry: "Pending", Proposed: "Completed", "Closed Accounts": "Rejected" };
  const items = Object.keys(statusMap).map((tabName) => ({
    key: tabName,
    label: `${tabName} (${entries.filter((e) => e.status === statusMap[tabName]).length})`,
    children: (
      <>
        <div className="desktop-table">
          <Table
            dataSource={entries.filter((e) => e.status === statusMap[tabName])}
            columns={columns}
            rowKey="_id"
            loading={loading}
            bordered
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          />
        </div>
        <div className="mobile-cards">
          <MobileEntries
            entries={entries.filter((e) => e.status === statusMap[tabName])}
            handleStatusUpdate={handleStatusUpdate}
            statusUpdating={statusUpdating}
          />
        </div>
      </>
    ),
  }));

  return (
    <div className="dashboard-container">
      <Card className="dashboard-card">
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Title level={2} className="dashboard-title">Admin Dashboard</Title>
          <div className="dashboard-actions">
            <Button type="primary" onClick={fetchProfile}>View Profile</Button>
            <Button type="default" onClick={exportToExcel}>Export to Excel</Button>
            <Button type="primary" danger onClick={handleLogout}>Logout</Button>
          </div>
          <Tabs defaultActiveKey="Enquiry" items={items} />
        </Space>
      </Card>

      <Modal
        visible={profileVisible}
        title="Admin Profile"
        onCancel={() => setProfileVisible(false)}
        footer={[<Button key="close" onClick={() => setProfileVisible(false)}>Close</Button>]}
      >
        {profile ? (
          <Card className="profile-card">
            <Text strong>Name: </Text><Text>{profile.name}</Text><br/>
            <Text strong>Email: </Text><Text>{profile.email}</Text>
          </Card>
        ) : <p>Loading...</p>}
      </Modal>
    </div>
  );
}
