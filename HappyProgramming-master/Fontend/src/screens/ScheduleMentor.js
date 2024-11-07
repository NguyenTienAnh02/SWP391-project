import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Select,
  Typography,
  Spin,
  Modal,
  Form,
  DatePicker,
  message,
  Popconfirm,
} from "antd";
import { EyeOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";
import Header from "../component/Header";
import { Container } from "react-bootstrap";
import { MENTOR_ROLE, ADMIN_ROLE } from "../constants/constant";

const { Text } = Typography;
const { Option } = Select;
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ScheduleTable = () => {
  const { id } = useParams();
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [userId, setUserId] = useState(id);
  const [role, setRole] = useState(sessionStorage.getItem("role"));
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [weekOptions, setWeekOptions] = useState([]);
  const [slots, setSlots] = useState([]);
  const [mentors, setMentors] = useState([]); // List of mentors
  const [skills, setSkills] = useState([]); // List of skills
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  // Form instance
  const [form] = Form.useForm();

  const getCurrentWeek = () => {
    const year = moment().year();
    const startDate = moment(`${year}-01-01`).startOf("week").add(1, "days");
    const weeks = [];
    for (let i = 0; i < 52; i++) {
      const weekStart = startDate.clone().add(i * 7, "days");
      const weekEnd = weekStart.clone().add(6, "days");
      const weekRange = `${weekStart.format("YYYY-MM-DD")} To ${weekEnd.format(
        "YYYY-MM-DD"
      )}`;
      weeks.push({ label: weekRange, value: weekRange });
    }
    setWeekOptions(weeks);
    const currentDate = moment();
    const currentWeek = weeks.find((week) => {
      const [start, end] = week.value.split(" To ");
      return currentDate.isBetween(start, end, null, "[]");
    });
    return currentWeek ? currentWeek.value : weeks[0].value;
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchSlotsData();
  
      const currentWeek = getCurrentWeek();
      setSelectedWeek(currentWeek);
  
      await fetchMentors();
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    // Trigger the fetch of the schedule data when userId or selectedWeek changes
    if (selectedWeek && userId) {
      fetchScheduleData();
    }
  }, [selectedWeek, userId]);

  useEffect(() => {
    if (selectedMentor) {
      fetchSkills(selectedMentor);
    }
  }, [selectedMentor]);

  const fetchSlotsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/slot", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(response.data);
    } catch (error) {
      console.error("Error fetching slots data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/user/list-by-role",
        {
          params: { role: MENTOR_ROLE },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMentors(response.data);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  };

  const fetchSkills = async (mentorId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/skill/mentor/${mentorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSkills(response.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const handleWeekChange = (value) => {
    setSelectedWeek(value);
  };

  const handleMentorChange = (value) => {
    setSelectedMentor(value);
  };

  const fetchScheduleData = async () => {
    if (!selectedWeek || !userId) return;
    try {
      setLoading(true);
      const [startDate, endDate] = selectedWeek.split(" To ");
      const response = await axios.get("http://localhost:8080/api/schedule", {
        params: { startDate: startDate, endDate: endDate, userId: userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      // Log to ensure data is correct
      const transformedData = slots.map((slot) => {
        const slotSchedules = response.data.filter(
          (item) => item.slot.id === slot.id
        );
        const daysData = days.reduce((acc, day) => {
          const schedule = slotSchedules.find(
            (sch) => moment(sch.date).format("ddd") === day
          );
          acc[day] = schedule
            ? { ...schedule, skillName: schedule.skill.skillName }
            : null;
          return acc;
        }, {});
        return {
          key: slot.id,
          slot: slot.name,
          time: `${slot.startTime} - ${slot.endTime}`,
          ...daysData,
        };
      });

      setDataSource(transformedData);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/schedule/delete/${scheduleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Schedule deleted successfully");
      fetchScheduleData();
    } catch (error) {
      message.error("Failed to delete schedule");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCreateSchedule = async (values) => {
    try {
      await axios.post(
        "http://localhost:8080/api/schedule/create",
        {
          mentorId: values.mentor,
          skillId: values.skill,
          slotId: values.slot,
          date: values.date.format("YYYY-MM-DD"),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("Schedule created successfully");
      fetchScheduleData();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(error.response.data.error);
    }
  };

  const columns = [
    {
      title: "Slot",
      dataIndex: "slot",
      key: "slot",
      width: 100,
      fixed: "left",
      render: (text, record) => (
        <div>
          <strong>{text}</strong>
          <div style={{ fontSize: 12, color: "#999" }}>{record.time}</div>
        </div>
      ),
    },
    ...days.map((day) => ({
      title: day,
      dataIndex: day,
      key: day,
      render: (text) =>
        text ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Link
              to={"/mentee/list"}
              style={{ marginBottom: "4px", textAlign: "center" }}
            >
              {text.skillName}
            </Link>
            <Button
              size="small"
              icon={<EyeOutlined />}
              style={{ marginTop: "4px" }}
            >
              View Materials
            </Button>
            {role === ADMIN_ROLE && (
              <Popconfirm
                title="Are you sure to delete this schedule?"
                onConfirm={() => handleDeleteSchedule(text.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  size="small"
                  icon={<DeleteOutlined />}
                  style={{ marginTop: "4px", color: "red" }}
                >
                  Delete
                </Button>
              </Popconfirm>
            )}
          </div>
        ) : (
          "-"
        ),
    })),
  ];

  return (
    <Container style={{ marginTop: "60px", maxWidth: "90%" }}>
      <Header />
      <br />
      <h1 style={{ marginTop: "20px", marginBottom: "20px" }}>
        Schedule Management
      </h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Text>Select Week:</Text>
          <Select
            value={selectedWeek}
            onChange={handleWeekChange}
            style={{ width: "200px", marginLeft: "10px" }}
          >
            {weekOptions.map((week) => (
              <Option key={week.value} value={week.value}>
                {week.label}
              </Option>
            ))}
          </Select>
        </div>
        {role === ADMIN_ROLE && (
          <Button
            icon={<PlusOutlined />}
            type="primary"
            style={{ marginBottom: "20px" }}
            onClick={showModal}
          >
            Add Schedule
          </Button>
        )}
      </div>
      <Spin spinning={loading}>
        {dataSource.length > 0 && (
          <Table
            columns={columns}
            dataSource={dataSource}
            bordered
            pagination={false}
            scroll={{ x: "1000px" }}
          />
        )}
      </Spin>

      <Modal
        title="Add Schedule"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateSchedule}>
          <Form.Item name="mentor" label="Mentor" rules={[{ required: true }]}>
            <Select placeholder="Select Mentor" onChange={handleMentorChange}>
              {mentors.map((mentor) => (
                <Option key={mentor.id} value={mentor.id}>
                  {mentor.username}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="skill" label="Skill" rules={[{ required: true }]}>
            <Select placeholder="Select Skill">
              {skills.map((skill) => (
                <Option key={skill.id} value={skill.id}>
                  {skill.skillName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="slot" label="Slot" rules={[{ required: true }]}>
            <Select placeholder="Select Slot">
              {slots.map((slot) => (
                <Option key={slot.id} value={slot.id}>
                  {slot.name} ({slot.startTime} - {slot.endTime})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

export default ScheduleTable;
