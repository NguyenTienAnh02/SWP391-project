import React, { useState, useEffect } from "react";
import { Table, Button, message, Spin } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { MENTOR_ROLE } from "../constants/constant";
import Header from "../component/Header";
import { Container } from "react-bootstrap";

const MentorListPage = () => {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch list of mentors
  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/user/list-by-role", {
        params: { role: MENTOR_ROLE },
        headers: { Authorization: `Bearer ${token}` },
      });
      setMentors(response.data);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      message.error("Failed to fetch mentors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const columns = [
    {
      title: "Mentor Name",
      dataIndex: "username",
      key: "username",
      render: (text, record) => (
        <Link to={`/schedule/mentor/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
  ];

  return (
    <Container style={{ marginTop: "60px", maxWidth: "90%" }}>
      <Header />
      <br />
      <h1 style={{ marginTop: "20px", marginBottom: "20px" }}>Mentor List</h1>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={mentors}
          bordered
          pagination={false}
          rowKey="id"
        />
      </Spin>
    </Container>
  );
};

export default MentorListPage;
