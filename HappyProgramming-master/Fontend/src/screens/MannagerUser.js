import React, { useEffect, useState } from "react";
import TemplateAdmin from "../template/TemplateAdmin";
import { Row, Col, Table, Form } from "react-bootstrap";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";
import axios from "axios";

const ManagerUser = () => {
    const [token] = useState(sessionStorage.getItem("token"));
    const [role] = useState(sessionStorage.getItem("role"));
    const navigate = useNavigate();

    useEffect(() => {
        if (role === "USER_MENTEE" || role === "USER_MENTOR") {
            navigate("/error");
        }
    }, [role, navigate]);

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };

    const [user, setUser] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterGender, setFilterGender] = useState(null);
    const [filterRole, setFilterRole] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);


    useEffect(() => {
        axios.get("http://localhost:8080/api/user", { headers })
            .then((resp) => {
                console.log(resp.data);
                setUser(resp.data);
                setFilteredUsers(resp.data);
            })
            .catch((err) => console.error(err.message));
    }, []);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            const updatedStatus = !currentStatus;
            const response = await axios.put(
                `http://localhost:8080/api/user/${userId}/status`,
                { status: updatedStatus },
                { headers }
            );

            if (response.status === 200) {
                setUser((prevUsers) =>
                    prevUsers.map((u) =>
                        u.id === userId ? { ...u, status: updatedStatus } : u
                    )
                );

                setFilteredUsers((prevFilteredUsers) =>
                    prevFilteredUsers.map((u) =>
                        u.id === userId ? { ...u, status: updatedStatus } : u
                    )
                );
            } else {
                console.error("Failed to update status, unexpected status code:", response.status);
            }
        } catch (error) {
            console.error("Error updating user status:", error.message);
        }
    };

    useEffect(() => {
        let filtered = user;

        if (searchTerm) {
            filtered = filtered.filter(u =>
                u.fullname.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
            );
        }

        if (filterGender !== null) {
            filtered = filtered.filter(u => u.gender === filterGender);
        }

        if (filterRole) {
            filtered = filtered.filter(u => u.roles.some(role => role.name === filterRole));
        }

        setFilteredUsers(filtered);
    }, [searchTerm, filterGender, filterRole, user]);


    return (
        <TemplateAdmin>
            <Row>
                <Col xs={12} style={{ padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f7f9fc" }}>
                    <Row>
                        <Col style={{ textAlign: "left", color: "#007bff", fontWeight: "bold", fontSize: "24px", marginBottom: "20px" }}>
                            <h2 className="template-admin">List User</h2>
                        </Col>
                    </Row>
                    <Row className="mb-3" style={{ display: "flex", gap: "10px" }}>
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                placeholder="Search by username"
                                className = "search-bar"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ borderRadius: "5px", padding: "5px 10px", border: "1px solid #ccc" }}
                            />
                        </Col>
                        <Col md={4} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Form.Check
                                inline
                                label="Male"
                                type="checkbox"
                                checked={filterGender === true}
                                onChange={() => setFilterGender(filterGender === true ? null : true)}
                                style={{ cursor: "pointer", accentColor: "#007bff" }}
                            />
                            <Form.Check
                                inline
                                label="Female"
                                type="checkbox"
                                checked={filterGender === false}
                                onChange={() => setFilterGender(filterGender === false ? null : false)}
                                style={{ cursor: "pointer", accentColor: "#007bff" }}
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Select
                                value={filterRole || ""}
                                onChange={(e) => setFilterRole(e.target.value || "")}
                                placeholder="All Roles"
                                style={{
                                    width: "20%",
                                    borderRadius: "5px",
                                    padding: "8px 12px",
                                    border: "1px solid #ccc",
                                    cursor: "pointer",
                                }}
                            >
                                <option value="" >All Roles</option>
                                <option value="USER_ADMIN">Admin</option>
                                <option value="USER_MENTEE">Mentee</option>
                                <option value="USER_MENTOR">Mentor</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table className="table border shadow" style={{ borderRadius: "10px", overflow: "hidden" }}>
                                <thead>
                                <tr style={{ backgroundColor: "#007bff", color: "#fff", textAlign: "center" }}>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Fullname</th>
                                    <th>Gender</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentUsers.map((u) => (
                                    <tr key={u.id} style={{ textAlign: "center", backgroundColor: u.id % 2 === 0 ? "#f2f2f2" : "#fff" }}>
                                        <td>{u.id}</td>
                                        <td>{u.username}</td>
                                        <td>{u.fullname}</td>
                                        <td>
                                            {u.gender ? (
                                                <span style={{ color: "blue" }}>
                                                    <MaleIcon style={{ width: "2em", height: "40px" }} />
                                                </span>
                                            ) : (
                                                <span style={{ color: "red" }}>
                                                    <FemaleIcon style={{ width: "2em", height: "40px" }} />
                                                </span>
                                            )}
                                        </td>
                                        <td>{u.phone}</td>
                                        <td>{u.email}</td>
                                        <td>{u.roles && u.roles.length > 0 ? u.roles[0].name : "No Role"}</td>
                                        <td style={{ fontWeight: "bold", color: u.status ? "#28a745" : "#dc3545" }}>
                                            {u.status ? "Active" : "Banned"}
                                        </td>
                                        {/* Ẩn nút Ban/Unban nếu role là Admin */}
                                        <td>
                                            {u.roles && !u.roles.some(role => role.name === "USER_ADMIN") && (
                                                <button
                                                    onClick={() => toggleUserStatus(u.id, u.status)}
                                                    className={`btn ${u.status ? 'btn-danger' : 'btn-success'}`}
                                                    style={{
                                                        borderRadius: "5px",
                                                        padding: "5px 10px",
                                                        color: "#fff",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        backgroundColor: u.status ? "#dc3545" : "#28a745",
                                                        transition: "background-color 0.3s"
                                                    }}
                                                >
                                                    {u.status ? "Ban" : "Unban"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                            <Pagination
                                current={currentPage}
                                total={filteredUsers.length}
                                pageSize={usersPerPage}
                                onChange={paginate}
                                style={{ marginTop: "16px", textAlign: "center" }}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </TemplateAdmin>
    );
};

export default ManagerUser;
