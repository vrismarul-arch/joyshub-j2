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

export default function DashboardPage({ onLogout }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      Time: new Date(entry.dateTime).toLocaleTimeString(),
      Status: entry.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Entries");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "entries.xlsx");
    toast.success("Excel file exported");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Date",
      dataIndex: "dateTime",
      key: "date",
      render: (dateTime) => new Date(dateTime).toLocaleDateString(),
    },
    {
      title: "Time",
      dataIndex: "dateTime",
      key: "time",
      render: (dateTime) => new Date(dateTime).toLocaleTimeString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(newStatus) => setCurrentEntry({ ...record, newStatus })}
        >
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Completed">Completed</Select.Option>
          <Select.Option value="Rejected">Rejected</Select.Option>
        </Select>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        currentEntry && currentEntry._id === record._id ? (
          <Popconfirm
            title={`Change status to "${currentEntry.newStatus}"?`}
            onConfirm={() => handleStatusUpdate(record, currentEntry.newStatus)}
            onCancel={() => setCurrentEntry(null)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" loading={statusUpdating}>
              Confirm
            </Button>
          </Popconfirm>
        ) : null,
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
      <Table
        dataSource={entries.filter((e) => e.status === statusMap[tabName])}
        columns={columns}
        rowKey="_id"
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      />
    ),
  }));

  return (
    <div style={{ maxWidth: 1200, margin: "20px auto", padding: "20px" }}>
      <Card style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Title level={2} style={{ textAlign: "center" }}>Admin Dashboard</Title>

          <Space style={{ justifyContent: "center", width: "100%" }} wrap>
            <Button type="primary" onClick={fetchProfile}>
              View Profile
            </Button>
            <Button type="default" onClick={exportToExcel}>
              Export to Excel
            </Button>
            <Button type="primary" danger onClick={handleLogout}>
              Logout
            </Button>
          </Space>

          <Tabs defaultActiveKey="Enquiry" items={items} />
        </Space>
      </Card>

      <Modal
        visible={profileVisible}
        title="Admin Profile"
        onCancel={() => setProfileVisible(false)}
        footer={[
          <Button key="close" onClick={() => setProfileVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {profile ? (
          <Card style={{ borderRadius: 12 }}>
            <Text strong>Name: </Text><Text>{profile.name}</Text><br />
            <Text strong>Email: </Text><Text>{profile.email}</Text>
          </Card>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
}
