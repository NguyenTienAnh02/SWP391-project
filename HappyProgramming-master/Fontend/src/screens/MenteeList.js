import React, { useState, useEffect } from "react";
import { Table, Radio, Button } from "antd";
import { Container } from "react-bootstrap";
import Header from "../component/Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { message } from "antd";

const MemberTable = () => {
  const { id } = useParams();
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const [token, setToken] = useState(sessionStorage.getItem("token"));

  useEffect(() => {
    // Fetch mentee data when the component mounts
    axios
      .get(`http://localhost:8080/api/schedule_class/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // Assuming API returns an array of mentees with properties matching the table columns
        const formattedData = response.data.map((data, index) => ({
          key: data.id,
          index: index + 1,
          username: data.mentee.username,
          fullname: data.mentee.fullname,
          attendanceStatus: data.attendanceStatus,
        }));
        setTableData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching mentee data:", error);
      });
  }, []);

  const handleStatusChange = (e, record) => {
    // Update the status of the specific row
    const updatedData = tableData.map((item) =>
      item.key === record.key
        ? { ...item, attendanceStatus: e.target.value }
        : item
    );
    setTableData(updatedData);
  };

  const handleSave = () => {
    // Prepare data to send to the server for update
    const updateData = tableData.map((item) => ({
      id: item.key,
      status: item.attendanceStatus,
    }));

    axios
      .put(
        "http://localhost:8080/api/schedule_class/update-multiple",
        // Pass body data directly as the second argument
        { scheduleClassUpdates: updateData, scheduleId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        message.success("Update attendance status successfully");
      })
      .catch((error) => {
        message.error("Update attendance status failed");
      });
  };

  const columns = [
    {
      title: "INDEX",
      dataIndex: "index",
      key: "index",
      align: "center",
    },
    {
      title: "USERNAME",
      dataIndex: "username",
      key: "username",
      align: "center",
    },
    {
      title: "FULLNAME",
      dataIndex: "fullname",
      key: "fullname",
      align: "center",
    },
    {
      title: "STATUS",
      dataIndex: "attendanceStatus",
      key: "attendanceStatus",
      align: "center",
      render: (attendanceStatus, record) => (
        <Radio.Group
          value={attendanceStatus}
          onChange={(e) => handleStatusChange(e, record)}
        >
          <Radio value={1}>Attended</Radio>
          <Radio value={0}>Absent</Radio>
        </Radio.Group>
      ),
    },    
  ];

  return (
    <Container>
      <Header />
      <div style={{ marginTop: "100px", padding: "20px" }}>
        <Table
          dataSource={tableData}
          columns={columns}
          bordered
          pagination={false}
          rowKey="key"
          style={{ textAlign: "center" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Button
            className="btn-success"
            style={{ marginRight: "20px" }}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default MemberTable;
