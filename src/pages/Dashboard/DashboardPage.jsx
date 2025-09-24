import { useEffect, useState } from "react";
import { api } from "../../api/api";
import {
  Table,
  Button,
  Select,
  Space,
  Tabs,
  Popconfirm,
  Modal,
  Card,
  Typography,
} from "antd";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { Title, Text } = Typography;

// Mobile card component
const MobileEntries = ({ entries, handleStatusUpdate, statusUpdating }) => (
  <Space direction="vertical" style={{ width: "100%" }}>
    {entries.map((entry) => (
      <Card key={entry._id} style={{ borderRadius: 12, marginBottom: 16 }}>
        <Title level={5}>{entry.name}</Title>
        <Text strong>Email: </Text><Text>{entry.email}</Text><br/>
        <Text strong>Phone: </Text><Text>{entry.phoneNumber}</Text><br/>
        <Text strong>Date: </Text><Text>{new Date(entry.dateTime).toLocaleDateString()}</Text><br/>
        <Text strong>Property Type: </Text><Text>{entry.propertyType}</Text><br/>
        <Text strong>Urgent: </Text><Text>{entry.urgent ? "Yes" : "No"}</Text><br/>
        <Text strong>Notes: </Text><Text>{entry.notes || "-"}</Text><br/>
        <Text strong>Status: </Text>
        <Select
          value={entry.status}
          style={{ width: 120, marginTop: 4 }}
          onChange={(newStatus) => handleStatusUpdate(entry, newStatus)}
          disabled={statusUpdating}
        >
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Completed">Completed</Select.Option>
          <Select.Option value="Rejected">Rejected</Select.Option>
        </Select>
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

  // Fetch all entries
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
    if (!token) {
      toast.error("Not authenticated");
      return;
    }
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
    if (entries.length === 0) {
      toast.error("No data to export");
      return;
    }

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

  const statusMap = {
    Enquiry: "Pending",
    Proposed: "Completed",
    "Closed Accounts": "Rejected",
  };

  const items = Object.keys(statusMap).map((tabName) => ({
    key: tabName,
    label: `${tabName} (${entries.filter((e) => e.status === statusMap[tabName]).length})`,
    children: (
      <>
        {/* Desktop Table */}
        <div className="desktop-table" style={{ display: "block" }}>
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

        {/* Mobile Cards */}
        <div className="mobile-cards" style={{ display: "none" }}>
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
    <div style={{ maxWidth: 1200, margin: "20px auto", padding: "20px" }}>
      <Card style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Title level={2} style={{ textAlign: "center" }}>Admin Dashboard</Title>

          <Space style={{ justifyContent: "center", width: "100%" }} wrap>
            <Button type="primary" onClick={fetchProfile}>View Profile</Button>
            <Button type="default" onClick={exportToExcel}>Export to Excel</Button>
            <Button type="primary" danger onClick={handleLogout}>Logout</Button>
          </Space>

          <Tabs defaultActiveKey="Enquiry" items={items} />
        </Space>
      </Card>

      <Modal
        visible={profileVisible}
        title="Admin Profile"
        onCancel={() => setProfileVisible(false)}
        footer={[
          <Button key="close" onClick={() => setProfileVisible(false)}>Close</Button>,
        ]}
      >
        {profile ? (
          <Card style={{ borderRadius: 12 }}>
            <Text strong>Name: </Text><Text>{profile.name}</Text><br/>
            <Text strong>Email: </Text><Text>{profile.email}</Text>
          </Card>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>

      {/* Responsive CSS */}
      <style>
        {`
          @media (max-width: 768px) {
            .desktop-table { display: none !important; }
            .mobile-cards { display: block !important; }
          }
        `}
      </style>
    </div>
  );
}
